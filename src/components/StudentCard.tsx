import React from 'react';
import { Eye, Edit3, Trash2, IdCard, CheckCircle2, Phone, Award } from 'lucide-react';
import { Student } from '../types/student.ts';

interface StudentCardProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string, name: string) => void;
  onPrintCard: (student: Student) => void;
  onQuickAttend: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onView,
  onEdit,
  onDelete,
  onPrintCard,
  onQuickAttend
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 hover:border-emerald-500/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      
      {/* Top Header Card */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          
          {/* Avatar with Gender Border */}
          <div className="relative shrink-0">
            <img
              src={student.foto}
              alt={student.nama}
              className={`w-14 h-14 rounded-full object-cover border-2 shadow-sm ${
                student.jenisKelamin === 'L' ? 'border-sky-500' : 'border-rose-400'
              }`}
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nama)}&background=${student.jenisKelamin === 'L' ? '0284c7' : 'e11d48'}&color=fff`;
              }}
            />
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow ${
                student.jenisKelamin === 'L' ? 'bg-sky-600' : 'bg-rose-500'
              }`}
              title={student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
            >
              {student.jenisKelamin}
            </span>
          </div>

          {/* Student Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Kelas {student.kelas}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                student.status === 'Aktif' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {student.status}
              </span>
            </div>

            <h3 
              onClick={() => onView(student)} 
              className="text-sm sm:text-base font-bold text-slate-800 hover:text-emerald-700 transition-colors truncate mt-1 cursor-pointer"
              title={student.nama}
            >
              {student.nama}
            </h3>

            <p className="text-xs text-slate-500 truncate">
              NIS: <span className="font-mono text-slate-700">{student.nis}</span> • NISN: <span className="font-mono text-slate-700">{student.nisn || '-'}</span>
            </p>
          </div>
        </div>

        {/* Badges / Key Details */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          
          {/* Tahfidz Progress */}
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-amber-700 font-medium">Hafalan Tahfidz</p>
              <p className="font-semibold text-slate-800 truncate text-[11px]">
                {student.tahfidz.juzTerakhir} ({student.tahfidz.suratTerakhir})
              </p>
            </div>
          </div>

          {/* SPP Status */}
          <div className={`border rounded-lg p-2 flex items-center gap-2 ${
            student.keuangan.statusSPP === 'Lunas'
              ? 'bg-emerald-50/70 border-emerald-200/60 text-emerald-800'
              : 'bg-rose-50/70 border-rose-200/60 text-rose-800'
          }`}>
            <div className="truncate">
              <p className="text-[10px] opacity-80 font-medium">Status SPP</p>
              <p className="font-bold text-[11px] flex items-center gap-1">
                {student.keuangan.statusSPP === 'Lunas' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                    Lunas
                  </>
                ) : (
                  'Menunggak'
                )}
              </p>
            </div>
          </div>

        </div>

        {/* Parent / Contact info */}
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
          <span className="truncate">Wali: {student.orangTua.namaAyah || student.orangTua.namaIbu}</span>
          {student.penerimaPIP && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
              KIP/PIP
            </span>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="bg-slate-50/90 px-3 py-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
        <button
          onClick={() => onView(student)}
          className="flex-1 py-1 px-2 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1 shadow-xs transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Detail</span>
        </button>

        <button
          onClick={() => onQuickAttend(student)}
          title="Presensi Hadir Cepat Hari Ini"
          className="p-1.5 rounded-lg text-xs font-medium bg-white hover:bg-green-50 text-green-700 border border-slate-200 hover:border-green-300 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPrintCard(student)}
          title="Cetak Kartu Tanda Pelajar"
          className="p-1.5 rounded-lg text-xs font-medium bg-white hover:bg-amber-50 text-amber-700 border border-slate-200 hover:border-amber-300 transition-colors"
        >
          <IdCard className="w-4 h-4" />
        </button>

        <button
          onClick={() => onEdit(student)}
          title="Ubah Data Murid"
          className="p-1.5 rounded-lg text-xs font-medium bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(student.id, student.nama)}
          title="Hapus Murid"
          className="p-1.5 rounded-lg text-xs font-medium bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
