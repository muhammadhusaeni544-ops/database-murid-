import React, { useState } from 'react';
import { 
  Search, Filter, LayoutGrid, List, UserPlus, 
  Download, Eye, Edit3, Trash2, IdCard, CheckCircle2 
} from 'lucide-react';
import { Student } from '../types/student.ts';
import { StudentCard } from './StudentCard.tsx';

interface StudentListViewProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string, name: string) => void;
  onPrintCard: (student: Student) => void;
  onQuickAttend: (student: Student) => void;
  onNewStudent: () => void;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onPrintCard,
  onQuickAttend,
  onNewStudent
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedGender, setSelectedGender] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [filterPip, setFilterPip] = useState<boolean>(false);

  // Filter students
  const filtered = students.filter(student => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = student.nama.toLowerCase().includes(q);
      const matchNis = student.nis.toLowerCase().includes(q);
      const matchNisn = (student.nisn || '').toLowerCase().includes(q);
      const matchParent = (student.orangTua.namaAyah || '').toLowerCase().includes(q) ||
                          (student.orangTua.namaIbu || '').toLowerCase().includes(q);
      if (!matchName && !matchNis && !matchNisn && !matchParent) return false;
    }

    // Class
    if (selectedClass !== 'Semua' && student.kelas !== selectedClass) return false;

    // Gender
    if (selectedGender !== 'Semua' && student.jenisKelamin !== selectedGender) return false;

    // Status
    if (selectedStatus !== 'Semua' && student.status !== selectedStatus) return false;

    // PIP
    if (filterPip && !student.penerimaPIP) return false;

    return true;
  });

  return (
    <div className="space-y-5">
      
      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan Nama Murid, NIS, NISN, atau Nama Orang Tua..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Quick Action: New & View Mode Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Kartu (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Tabel (List)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onNewStudent}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Murid</span>
            </button>
          </div>

        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          
          {/* Filter Kelas */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent border-0 font-bold text-slate-800 focus:outline-none"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="1A">Kelas 1A</option>
              <option value="1B">Kelas 1B</option>
              <option value="2A">Kelas 2A</option>
              <option value="2B">Kelas 2B</option>
              <option value="3A">Kelas 3A</option>
              <option value="3B">Kelas 3B</option>
              <option value="4A">Kelas 4A</option>
              <option value="5A">Kelas 5A</option>
              <option value="6A">Kelas 6A</option>
            </select>
          </div>

          {/* Filter Gender */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500">Gender:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-transparent border-0 font-bold text-slate-800 focus:outline-none"
            >
              <option value="Semua">Semua</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-0 font-bold text-slate-800 focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Lulus">Lulus</option>
              <option value="Mutasi">Mutasi</option>
            </select>
          </div>

          {/* PIP / KIP toggle */}
          <button
            onClick={() => setFilterPip(!filterPip)}
            className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors flex items-center gap-1 ${
              filterPip
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>KIP / PIP</span>
          </button>

          {/* Reset Filters */}
          {(search || selectedClass !== 'Semua' || selectedGender !== 'Semua' || selectedStatus !== 'Semua' || filterPip) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedClass('Semua');
                setSelectedGender('Semua');
                setSelectedStatus('Semua');
                setFilterPip(false);
              }}
              className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
            >
              Reset Filter
            </button>
          )}

        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Menampilkan <strong className="text-slate-800">{filtered.length}</strong> dari {students.length} santri
        </span>
        {selectedClass !== 'Semua' && (
          <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Rombel: Kelas {selectedClass}
          </span>
        )}
      </div>

      {/* Content: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onView={onViewStudent}
              onEdit={onEditStudent}
              onDelete={onDeleteStudent}
              onPrintCard={onPrintCard}
              onQuickAttend={onQuickAttend}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-base font-bold text-slate-700">Tidak ada santri yang sesuai kriteria pencarian</p>
              <p className="text-xs text-slate-400">Silakan ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          )}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nama Murid</th>
                  <th className="p-3.5">NIS / NISN</th>
                  <th className="p-3.5">Kelas</th>
                  <th className="p-3.5">Gender</th>
                  <th className="p-3.5">Tahfidz</th>
                  <th className="p-3.5">Wali Murid & Telepon</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.foto}
                          alt={student.nama}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nama)}&background=047857&color=fff`;
                          }}
                        />
                        <div>
                          <p 
                            onClick={() => onViewStudent(student)} 
                            className="font-bold text-slate-800 hover:text-emerald-700 cursor-pointer"
                          >
                            {student.nama}
                          </p>
                          <p className="text-[10px] text-slate-400">{student.tempatLahir}, {student.tanggalLahir}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono">
                      <span className="text-slate-800 font-semibold">{student.nis}</span>
                      <span className="block text-[10px] text-slate-400">{student.nisn || '-'}</span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-800">
                      Kelas {student.kelas}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        student.jenisKelamin === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800">{student.tahfidz.juzTerakhir}</p>
                      <p className="text-[10px] text-amber-700 font-medium">{student.tahfidz.suratTerakhir} ({student.tahfidz.predikat})</p>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      <p className="font-medium text-slate-800">{student.orangTua.namaAyah || student.orangTua.namaIbu}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{student.orangTua.telepon || '-'}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewStudent(student)}
                          title="Lihat Detail Profil"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 text-emerald-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onQuickAttend(student)}
                          title="Presensi Hadir"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-green-50 text-green-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onPrintCard(student)}
                          title="Cetak KTA"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-amber-50 text-amber-700"
                        >
                          <IdCard className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditStudent(student)}
                          title="Edit"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-blue-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student.id, student.nama)}
                          title="Hapus"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
