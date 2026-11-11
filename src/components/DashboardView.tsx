import React from 'react';
import { 
  Users, UserCheck, CalendarCheck, Award, CreditCard, 
  Sparkles, TrendingUp, ArrowUpRight, School, Clock, 
  CheckCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Student, SchoolProfile } from '../types/student.ts';

interface DashboardViewProps {
  stats: any;
  students: Student[];
  profile: SchoolProfile | null;
  onNavigate: (tab: string) => void;
  onNewStudent: () => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  students,
  profile,
  onNavigate,
  onNewStudent,
  onSelectStudent
}) => {
  const total = stats?.totalStudents || students.length;
  const active = stats?.activeStudents || students.filter(s => s.status === 'Aktif').length;
  const male = stats?.maleCount || students.filter(s => s.jenisKelamin === 'L').length;
  const female = stats?.femaleCount || students.filter(s => s.jenisKelamin === 'P').length;
  const pip = stats?.pipCount || students.filter(s => s.penerimaPIP).length;
  const todayAtt = stats?.todayAttendance || { hadir: 0, sakit: 0, izin: 0, alpa: 0, persentaseHadir: 0 };
  const sppDue = stats?.sppDueCount || students.filter(s => s.keuangan?.statusSPP === 'Menunggak').length;

  const classMap = stats?.classMap || {};
  const sortedClasses = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '5A', '6A'];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <School className="w-64 h-64 text-white -mr-16" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-emerald-950 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Sistem Database Induk Murid Real-Time
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Ahlan Wa Sahlan di Database {profile?.nama || 'MI Nurul Iman'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
            Pusat data terpadu siswa madrasah: sinkronisasi otomatis ke semua perangkat guru & wali kelas secara real-time melalui web dan mobile.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-2">
            <button
              onClick={onNewStudent}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold rounded-xl shadow transition-all active:scale-95"
            >
              + Tambah Murid Baru
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="px-4 py-2 bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-600 text-xs font-semibold rounded-xl transition-all"
            >
              Scan / Absensi Harian
            </button>
            <button
              onClick={() => onNavigate('idcard')}
              className="px-4 py-2 bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-600 text-xs font-semibold rounded-xl transition-all"
            >
              Cetak Kartu Siswa
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Murid */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Siswa Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">{active}</span>
            <span className="text-xs text-slate-400 ml-1">/ {total} terdaftar</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center">
            {male} Santri Laki • {female} Santri Perempuan
          </p>
        </div>

        {/* Kehadiran Hari Ini */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kehadiran Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {todayAtt.persentaseHadir}%
            </span>
            <span className="text-xs text-slate-400 ml-1 font-medium">hadir</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium truncate">
            {todayAtt.hadir} Hadir • {todayAtt.sakit} Sakit • {todayAtt.izin} Izin • {todayAtt.alpa} Alpa
          </p>
        </div>

        {/* Penerima PIP/KIP */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-purple-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bantuan PIP / KIP</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">{pip}</span>
            <span className="text-xs text-purple-700 ml-1 font-medium">Penerima</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Program Indonesia Pintar Kemenag
          </p>
        </div>

        {/* Status SPP */}
        <div 
          onClick={() => onNavigate('finance')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tunggakan SPP</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-800">{sppDue}</span>
            <span className="text-xs text-slate-400 ml-1 font-medium">murid perlu ditagih</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">
            Iuran Madrasah TA 2024/2025
          </p>
        </div>

      </div>

      {/* Middle Row: Sebaran Kelas & Quick Student List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sebaran Kelas & Rombel (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Distribusi Siswa per Rombongan Belajar (Rombel)</h3>
              <p className="text-xs text-slate-500">Jumlah santri aktif di setiap tingkat kelas 1 s/d 6</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
              {Object.keys(classMap).length} Rombel
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {sortedClasses.map((cls) => {
              const count = classMap[cls] || 0;
              const maxCount = 30; // standard madrasah rombel cap
              const percentage = Math.min(100, Math.round((count / maxCount) * 100));

              return (
                <div 
                  key={cls}
                  onClick={() => onNavigate('students')}
                  className="bg-slate-50 hover:bg-emerald-50/70 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer text-center group"
                >
                  <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-800">
                    Kelas {cls}
                  </p>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">
                    {count}
                  </p>
                  <p className="text-[10px] text-slate-400">/ {maxCount} Kuota</p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.max(10, percentage)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gender Ratio Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Perbandingan Gender:</span> {male} Laki-laki ({total > 0 ? Math.round((male/total)*100) : 0}%) & {female} Perempuan ({total > 0 ? Math.round((female/total)*100) : 0}%)
            </div>
            <div className="w-full sm:w-64 h-3 bg-rose-200 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-sky-600 h-full transition-all" 
                style={{ width: `${total > 0 ? (male/total)*100 : 50}%` }}
                title={`Laki-laki: ${male}`}
              />
              <div 
                className="bg-rose-500 h-full transition-all" 
                style={{ width: `${total > 0 ? (female/total)*100 : 50}%` }}
                title={`Perempuan: ${female}`}
              />
            </div>
          </div>
        </div>

        {/* Murid Berprestasi / Update Tahfidz Terbaru (1 Col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Hafalan Tahfidz Mumtaz
              </h3>
              <button 
                onClick={() => onNavigate('tahfidz')}
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                Lihat Semua
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {students.filter(s => s.tahfidz.predikat === 'Mumtaz').slice(0, 4).map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => onSelectStudent(s)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={s.foto}
                      alt={s.nama}
                      className="w-8 h-8 rounded-full object-cover border border-amber-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nama)}&background=047857&color=fff`;
                      }}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">{s.nama}</p>
                      <p className="text-[10px] text-slate-500">Kelas {s.kelas} • {s.tahfidz.juzTerakhir}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {s.tahfidz.suratTerakhir}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('attendance')}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors text-center"
            >
              Buka Form Presensi Real-Time
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
