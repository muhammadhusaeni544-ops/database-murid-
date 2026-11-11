import React, { useState } from 'react';
import { 
  Calendar, CheckCircle, AlertCircle, Clock, QrCode, 
  Search, Users, CheckCheck, RefreshCw, Send, Check
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types/student.ts';

interface AttendanceViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onRecordAttendance: (data: Omit<AttendanceRecord, 'id'>) => Promise<any>;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendance,
  onRecordAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('1A');
  const [scanInput, setScanInput] = useState<string>('');
  const [scanMessage, setScanMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isSimulatingCamera, setIsSimulatingCamera] = useState<boolean>(false);

  // Filter students for the selected class
  const classStudents = students.filter(s => selectedClass === 'Semua' ? true : s.kelas === selectedClass);

  // Map student attendance for the selected date
  const getStudentAttendance = (studentId: string): AttendanceRecord | undefined => {
    return attendance.find(a => a.studentId === studentId && a.tanggal === selectedDate);
  };

  const handleMarkStatus = async (student: Student, status: AttendanceStatus, keterangan = '') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    try {
      await onRecordAttendance({
        studentId: student.id,
        nis: student.nis,
        studentName: student.nama,
        kelas: student.kelas,
        tanggal: selectedDate,
        status,
        waktu: timeStr,
        keterangan: keterangan || undefined
      });
    } catch (err: any) {
      alert(`Gagal mencatat presensi: ${err.message}`);
    }
  };

  // Mark all students in the current view as Hadir
  const handleMarkAllPresent = async () => {
    if (!confirm(`Tandai semua ${classStudents.length} siswa di Kelas ${selectedClass} sebagai HADIR hari ini?`)) return;
    
    for (const student of classStudents) {
      const current = getStudentAttendance(student.id);
      if (!current || current.status !== 'Hadir') {
        await handleMarkStatus(student, 'Hadir');
      }
    }
  };

  // Barcode / QR / NIS quick scanner submit
  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const query = scanInput.trim().toLowerCase();
    const found = students.find(s => 
      s.nis.toLowerCase() === query || 
      s.nisn.toLowerCase() === query || 
      s.nama.toLowerCase().includes(query)
    );

    if (found) {
      await handleMarkStatus(found, 'Hadir');
      setScanMessage({ text: `✓ Presensi Berhasil: ${found.nama} (Kelas ${found.kelas}) dicatat HADIR!` });
      setScanInput('');
    } else {
      setScanMessage({ text: `❌ Murid dengan NIS/NISN "${scanInput}" tidak ditemukan!`, isError: true });
    }

    setTimeout(() => setScanMessage(null), 4000);
  };

  // Calculate statistics for the selected class & date
  const totalInView = classStudents.length;
  const recordsInView = classStudents.map(s => getStudentAttendance(s.id)).filter(Boolean) as AttendanceRecord[];
  const hadirCount = recordsInView.filter(r => r.status === 'Hadir').length;
  const sakitCount = recordsInView.filter(r => r.status === 'Sakit').length;
  const izinCount = recordsInView.filter(r => r.status === 'Izin').length;
  const alpaCount = recordsInView.filter(r => r.status === 'Alpa').length;
  const belumAbsenCount = totalInView - recordsInView.length;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Fast QR Scanner Box */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              Presensi Harian Siswa Real-Time
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Data absensi tersimpan otomatis dan tersinkronisasi instan ke seluruh guru dan aplikasi orang tua.
            </p>
          </div>

          {/* Quick Scanner Barcode/QR input */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleScanSubmit} className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-80">
                <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Scan QR Kartu / Masukkan NIS..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
              >
                Absenkan
              </button>
            </form>
            {scanMessage && (
              <p className={`text-xs mt-1 font-semibold ${scanMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                {scanMessage.text}
              </p>
            )}
          </div>
        </div>

        {/* Filter Controls: Date & Class */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Tanggal */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Tanggal:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs bg-transparent border-0 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            {/* Pilih Kelas */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs bg-transparent border-0 font-bold text-emerald-800 focus:outline-none"
              >
                <option value="1A">Kelas 1A</option>
                <option value="1B">Kelas 1B</option>
                <option value="2A">Kelas 2A</option>
                <option value="2B">Kelas 2B</option>
                <option value="3A">Kelas 3A</option>
                <option value="4A">Kelas 4A</option>
                <option value="5A">Kelas 5A</option>
                <option value="6A">Kelas 6A</option>
                <option value="Semua">Semua Kelas</option>
              </select>
            </div>

          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-700" />
              <span>Setel Semua Hadir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-emerald-800">Hadir</p>
          <p className="text-xl font-extrabold text-emerald-900 mt-0.5">{hadirCount}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-amber-800">Sakit</p>
          <p className="text-xl font-extrabold text-amber-900 mt-0.5">{sakitCount}</p>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-sky-800">Izin</p>
          <p className="text-xl font-extrabold text-sky-900 mt-0.5">{izinCount}</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-rose-800">Alpa</p>
          <p className="text-xl font-extrabold text-rose-900 mt-0.5">{alpaCount}</p>
        </div>
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold text-slate-600">Belum Absen</p>
          <p className="text-xl font-extrabold text-slate-800 mt-0.5">{belumAbsenCount}</p>
        </div>
      </div>

      {/* Attendance List Table (Responsive Card/Row) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Daftar Murid {selectedClass !== 'Semua' ? `Kelas ${selectedClass}` : 'Semua Kelas'} ({totalInView} Siswa)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {selectedDate}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {classStudents.map((student, idx) => {
            const att = getStudentAttendance(student.id);
            const status = att?.status;

            return (
              <div 
                key={student.id} 
                className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  status ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 w-6 text-center hidden sm:inline-block">
                    {idx + 1}
                  </span>

                  <img
                    src={student.foto}
                    alt={student.nama}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nama)}&background=047857&color=fff`;
                    }}
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-800">{student.nama}</h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-600">
                        Kelas {student.kelas}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      NIS: <span className="font-mono text-slate-700">{student.nis}</span>
                      {att?.waktu && (
                        <span className="ml-2 text-[11px] text-emerald-700 font-medium">
                          • Tercatat pkl {att.waktu}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Big Action Buttons (Thumb-friendly on mobile) */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  
                  {/* HADIR */}
                  <button
                    onClick={() => handleMarkStatus(student, 'Hadir')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      status === 'Hadir'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                    }`}
                  >
                    Hadir
                  </button>

                  {/* SAKIT */}
                  <button
                    onClick={() => {
                      const ket = prompt('Keterangan sakit (misal: Demam/Flu):', att?.keterangan || '');
                      if (ket !== null) handleMarkStatus(student, 'Sakit', ket);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      status === 'Sakit'
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                        : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700'
                    }`}
                  >
                    Sakit
                  </button>

                  {/* IZIN */}
                  <button
                    onClick={() => {
                      const ket = prompt('Alasan izin:', att?.keterangan || '');
                      if (ket !== null) handleMarkStatus(student, 'Izin', ket);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      status === 'Izin'
                        ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300'
                        : 'bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700'
                    }`}
                  >
                    Izin
                  </button>

                  {/* ALPA */}
                  <button
                    onClick={() => handleMarkStatus(student, 'Alpa', 'Tanpa keterangan')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      status === 'Alpa'
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                        : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                    }`}
                  >
                    Alpa
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
