import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import { Student, SchoolProfile, AttendanceRecord, RealtimeEvent } from '../src/types/student.ts';
import { initialSchoolProfile, initialStudents, initialAttendanceRecords } from './seedData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  schoolProfile: SchoolProfile;
  students: Student[];
  attendance: AttendanceRecord[];
}

class StorageManager {
  private db: DatabaseSchema = {
    schoolProfile: initialSchoolProfile,
    students: initialStudents,
    attendance: initialAttendanceRecords
  };

  private sseClients: Response[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.db = {
          schoolProfile: parsed.schoolProfile || initialSchoolProfile,
          students: parsed.students || initialStudents,
          attendance: parsed.attendance || initialAttendanceRecords
        };
      } else {
        this.saveToFile();
      }
    } catch (err) {
      console.error('Error initializing database, using defaults:', err);
    }
  }

  private saveToFile() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // Real-Time SSE Methods
  public addSseClient(res: Response) {
    this.sseClients.push(res);
  }

  public removeSseClient(res: Response) {
    this.sseClients = this.sseClients.filter(c => c !== res);
  }

  public broadcast(event: RealtimeEvent) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    this.sseClients.forEach(client => {
      try {
        client.write(payload);
      } catch (err) {
        // Client might have disconnected
      }
    });
  }

  // School Profile
  public getProfile(): SchoolProfile {
    return this.db.schoolProfile;
  }

  public updateProfile(profile: Partial<SchoolProfile>): SchoolProfile {
    this.db.schoolProfile = { ...this.db.schoolProfile, ...profile };
    this.saveToFile();
    return this.db.schoolProfile;
  }

  // Students
  public getStudents(filters?: { search?: string; kelas?: string; gender?: string; status?: string }): Student[] {
    let list = [...this.db.students];
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(s =>
        s.nama.toLowerCase().includes(q) ||
        s.nis.toLowerCase().includes(q) ||
        s.nisn.toLowerCase().includes(q) ||
        s.orangTua.namaAyah.toLowerCase().includes(q) ||
        s.orangTua.namaIbu.toLowerCase().includes(q)
      );
    }
    if (filters?.kelas && filters.kelas !== 'Semua') {
      list = list.filter(s => s.kelas === filters.kelas);
    }
    if (filters?.gender && filters.gender !== 'Semua') {
      list = list.filter(s => s.jenisKelamin === filters.gender);
    }
    if (filters?.status && filters.status !== 'Semua') {
      list = list.filter(s => s.status === filters.status);
    }
    return list;
  }

  public getStudentById(id: string): Student | undefined {
    return this.db.students.find(s => s.id === id || s.nis === id || s.nisn === id);
  }

  public createStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Student {
    const newId = `std-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const student: Student = {
      ...studentData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    this.db.students.unshift(student);
    this.saveToFile();

    this.broadcast({
      type: 'student_created',
      studentId: student.id,
      data: student,
      message: `Murid baru "${student.nama}" (Kelas ${student.kelas}) berhasil ditambahkan.`,
      timestamp: now
    });

    return student;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = this.db.students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    this.db.students[index] = {
      ...this.db.students[index],
      ...updates,
      updatedAt: now
    };

    this.saveToFile();

    const updatedStudent = this.db.students[index];
    this.broadcast({
      type: 'student_updated',
      studentId: id,
      data: updatedStudent,
      message: `Data murid "${updatedStudent.nama}" telah diperbarui.`,
      timestamp: now
    });

    return updatedStudent;
  }

  public deleteStudent(id: string): boolean {
    const student = this.db.students.find(s => s.id === id);
    if (!student) return false;

    this.db.students = this.db.students.filter(s => s.id !== id);
    this.db.attendance = this.db.attendance.filter(a => a.studentId !== id);
    this.saveToFile();

    const now = new Date().toISOString();
    this.broadcast({
      type: 'student_deleted',
      studentId: id,
      message: `Data murid "${student.nama}" telah dihapus.`,
      timestamp: now
    });

    return true;
  }

  public bulkImport(students: Partial<Student>[]): { added: number; updated: number } {
    let added = 0;
    let updated = 0;
    const now = new Date().toISOString();

    for (const item of students) {
      if (!item.nama || !item.nis) continue;
      const existingIdx = this.db.students.findIndex(s => s.nis === item.nis || (item.nisn && s.nisn === item.nisn));
      if (existingIdx !== -1) {
        this.db.students[existingIdx] = {
          ...this.db.students[existingIdx],
          ...item,
          updatedAt: now
        };
        updated++;
      } else {
        const newStudent: Student = {
          id: `std-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          nis: item.nis,
          nisn: item.nisn || '',
          nik: item.nik || '',
          nama: item.nama,
          namaPanggilan: item.namaPanggilan || item.nama.split(' ')[0],
          jenisKelamin: item.jenisKelamin || 'L',
          tempatLahir: item.tempatLahir || 'Depok',
          tanggalLahir: item.tanggalLahir || '2016-01-01',
          agama: 'Islam',
          anakKe: item.anakKe || 1,
          jumlahSaudara: item.jumlahSaudara || 1,
          golonganDarah: item.golonganDarah || '-',
          kelas: item.kelas || '1A',
          tingkat: item.tingkat || 1,
          tahunMasuk: item.tahunMasuk || '2023',
          tahunAjaran: item.tahunAjaran || '2024/2025',
          status: item.status || 'Aktif',
          waliKelas: item.waliKelas || 'Ustadzah Siti Maryam, S.Pd.I',
          alamat: item.alamat || {
            jalan: 'Jl. Raya Pesantren',
            rtRw: '01/01',
            desaKelurahan: 'Sukamaju',
            kecamatan: 'Cilodong',
            kabupatenKota: 'Kota Depok',
            provinsi: 'Jawa Barat',
            kodePos: '16415'
          },
          orangTua: item.orangTua || {
            namaAyah: '-',
            nikAyah: '',
            pekerjaanAyah: '-',
            pendidikanAyah: '-',
            namaIbu: '-',
            nikIbu: '',
            pekerjaanIbu: '-',
            pendidikanIbu: '-',
            telepon: '-'
          },
          penerimaPIP: !!item.penerimaPIP,
          nomorKIP: item.nomorKIP || '',
          tahfidz: item.tahfidz || {
            juzTerakhir: 'Juz 30',
            suratTerakhir: 'An-Nas',
            totalSurat: 10,
            predikat: 'Jayyid',
            terakhirSetor: now.split('T')[0]
          },
          keuangan: item.keuangan || {
            statusSPP: 'Lunas',
            nominalSPP: 250000,
            bulanTerbayar: ['Juli 2024'],
            terakhirBayar: now.split('T')[0],
            riwayat: []
          },
          foto: item.foto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
          catatanKhusus: item.catatanKhusus || '',
          createdAt: now,
          updatedAt: now
        };
        this.db.students.push(newStudent);
        added++;
      }
    }

    this.saveToFile();

    this.broadcast({
      type: 'bulk_imported',
      data: { added, updated },
      message: `Impor data selesai: ${added} murid baru ditambahkan, ${updated} murid diperbarui.`,
      timestamp: now
    });

    return { added, updated };
  }

  // Attendance
  public getAttendance(tanggal: string, kelas?: string): AttendanceRecord[] {
    let list = this.db.attendance.filter(a => a.tanggal === tanggal);
    if (kelas && kelas !== 'Semua') {
      list = list.filter(a => a.kelas === kelas);
    }
    return list;
  }

  public recordAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const existingIndex = this.db.attendance.findIndex(
      a => a.studentId === record.studentId && a.tanggal === record.tanggal
    );

    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      this.db.attendance[existingIndex] = {
        ...this.db.attendance[existingIndex],
        status: record.status,
        waktu: record.waktu,
        keterangan: record.keterangan
      };
      this.saveToFile();

      this.broadcast({
        type: 'attendance_recorded',
        data: this.db.attendance[existingIndex],
        message: `Presensi "${record.studentName}" diubah menjadi ${record.status}.`,
        timestamp: now
      });

      return this.db.attendance[existingIndex];
    } else {
      const newRecord: AttendanceRecord = {
        ...record,
        id: `att-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
      };
      this.db.attendance.push(newRecord);
      this.saveToFile();

      this.broadcast({
        type: 'attendance_recorded',
        data: newRecord,
        message: `Presensi "${record.studentName}" tercatat: ${record.status}.`,
        timestamp: now
      });

      return newRecord;
    }
  }

  // SPP Payment
  public recordPayment(studentId: string, bulan: string, jumlah: number, metode: 'Tunai' | 'Transfer Bank' | 'QRIS', keterangan: string): Student | null {
    const student = this.db.students.find(s => s.id === studentId);
    if (!student) return null;

    const paymentId = `pay-${Date.now().toString(36)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const currentMonths = student.keuangan.bulanTerbayar || [];
    if (!currentMonths.includes(bulan)) {
      currentMonths.push(bulan);
    }

    student.keuangan.riwayat = student.keuangan.riwayat || [];
    student.keuangan.riwayat.unshift({
      id: paymentId,
      bulan,
      tanggal: dateStr,
      jumlah,
      metode,
      keterangan: keterangan || `Pembayaran SPP ${bulan}`
    });

    student.keuangan.statusSPP = 'Lunas';
    student.keuangan.terakhirBayar = dateStr;
    student.updatedAt = now.toISOString();

    this.saveToFile();

    this.broadcast({
      type: 'payment_added',
      studentId: student.id,
      data: student,
      message: `Pembayaran SPP ${bulan} an. ${student.nama} sebesar Rp ${jumlah.toLocaleString('id-ID')} berhasil dicatat.`,
      timestamp: now.toISOString()
    });

    return student;
  }

  // Dashboard Stats
  public getStats() {
    const totalStudents = this.db.students.length;
    const activeStudents = this.db.students.filter(s => s.status === 'Aktif').length;
    const graduatedStudents = this.db.students.filter(s => s.status === 'Lulus').length;
    const mutatedStudents = this.db.students.filter(s => s.status === 'Mutasi').length;

    const maleCount = this.db.students.filter(s => s.jenisKelamin === 'L').length;
    const femaleCount = this.db.students.filter(s => s.jenisKelamin === 'P').length;
    const pipCount = this.db.students.filter(s => s.penerimaPIP).length;
    const sppDueCount = this.db.students.filter(s => s.keuangan.statusSPP === 'Menunggak').length;

    // Distribution per class
    const classMap: Record<string, number> = {};
    for (const s of this.db.students) {
      classMap[s.kelas] = (classMap[s.kelas] || 0) + 1;
    }

    // Today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.db.attendance.filter(a => a.tanggal === today);
    const hadir = todayAttendance.filter(a => a.status === 'Hadir').length;
    const sakit = todayAttendance.filter(a => a.status === 'Sakit').length;
    const izin = todayAttendance.filter(a => a.status === 'Izin').length;
    const alpa = todayAttendance.filter(a => a.status === 'Alpa').length;

    return {
      totalStudents,
      activeStudents,
      graduatedStudents,
      mutatedStudents,
      maleCount,
      femaleCount,
      pipCount,
      sppDueCount,
      classMap,
      todayAttendance: {
        tanggal: today,
        total: todayAttendance.length,
        hadir,
        sakit,
        izin,
        alpa,
        persentaseHadir: totalStudents > 0 ? Math.round((hadir / totalStudents) * 100) : 0
      }
    };
  }
}

export const storage = new StorageManager();
