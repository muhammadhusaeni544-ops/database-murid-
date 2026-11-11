export type Gender = 'L' | 'P';
export type StudentStatus = 'Aktif' | 'Lulus' | 'Mutasi' | 'Cuti';
export type TahfidzRating = 'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Maqbul';
export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export interface ParentInfo {
  namaAyah: string;
  nikAyah: string;
  pekerjaanAyah: string;
  pendidikanAyah: string;
  namaIbu: string;
  nikIbu: string;
  pekerjaanIbu: string;
  pendidikanIbu: string;
  telepon: string;
  email?: string;
}

export interface AddressInfo {
  jalan: string;
  rtRw: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
}

export interface TahfidzInfo {
  juzTerakhir: string;
  suratTerakhir: string;
  totalSurat: number;
  predikat: TahfidzRating;
  terakhirSetor: string;
  catatanUstadz?: string;
}

export interface PaymentRecord {
  id: string;
  bulan: string;
  tanggal: string;
  jumlah: number;
  metode: 'Tunai' | 'Transfer Bank' | 'QRIS';
  keterangan: string;
}

export interface FinanceInfo {
  statusSPP: 'Lunas' | 'Menunggak';
  nominalSPP: number;
  bulanTerbayar: string[]; // e.g. ["Juli 2024", "Agustus 2024"]
  terakhirBayar: string;
  riwayat: PaymentRecord[];
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  nik: string;
  nama: string;
  namaPanggilan: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  anakKe: number;
  jumlahSaudara: number;
  golonganDarah: string;
  kelas: string;
  tingkat: number;
  tahunMasuk: string;
  tahunAjaran: string;
  status: StudentStatus;
  waliKelas: string;
  alamat: AddressInfo;
  orangTua: ParentInfo;
  penerimaPIP: boolean;
  nomorKIP?: string;
  tahfidz: TahfidzInfo;
  keuangan: FinanceInfo;
  foto: string;
  catatanKhusus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  nis: string;
  studentName: string;
  kelas: string;
  tanggal: string; // YYYY-MM-DD
  status: AttendanceStatus;
  waktu: string; // HH:mm:ss
  keterangan?: string;
}

export interface SchoolProfile {
  nama: string;
  nsm: string;
  npsn: string;
  akreditasi: string;
  kepalaMadrasah: string;
  nipKepala: string;
  alamat: string;
  kota: string;
  telepon: string;
  email: string;
  tahunAjaranAktif: string;
  semesterAktif: string;
}

export interface RealtimeEvent {
  type: 'student_created' | 'student_updated' | 'student_deleted' | 'attendance_recorded' | 'payment_added' | 'bulk_imported';
  studentId?: string;
  data?: any;
  message: string;
  timestamp: string;
}
