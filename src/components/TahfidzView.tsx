import React, { useState } from 'react';
import { BookOpen, Award, Sparkles, Search, CheckCircle, Plus, Calendar } from 'lucide-react';
import { Student } from '../types/student.ts';

interface TahfidzViewProps {
  students: Student[];
  onUpdateTahfidz: (studentId: string, tahfidzData: any) => Promise<any>;
}

export const TahfidzView: React.FC<TahfidzViewProps> = ({
  students,
  onUpdateTahfidz
}) => {
  const [selectedJuz, setSelectedJuz] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');
  const [selectedStudentForSetor, setSelectedStudentForSetor] = useState<Student | null>(null);

  // Form setoran state
  const [formJuz, setFormJuz] = useState('Juz 30');
  const [formSurat, setFormSurat] = useState('');
  const [formPredikat, setFormPredikat] = useState<'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid'>('Mumtaz');
  const [formCatatan, setFormCatatan] = useState('');

  const filtered = students.filter(s => {
    const matchJuz = selectedJuz === 'Semua' ? true : s.tahfidz?.juzTerakhir === selectedJuz;
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || 
                        s.kelas.toLowerCase().includes(search.toLowerCase()) ||
                        (s.tahfidz?.suratTerakhir && s.tahfidz.suratTerakhir.toLowerCase().includes(search.toLowerCase()));
    return matchJuz && matchSearch;
  });

  const handleOpenSetor = (student: Student) => {
    setSelectedStudentForSetor(student);
    setFormJuz(student.tahfidz?.juzTerakhir || 'Juz 30');
    setFormSurat(student.tahfidz?.suratTerakhir || '');
    setFormPredikat((student.tahfidz?.predikat as any) || 'Mumtaz');
    setFormCatatan(student.tahfidz?.catatanUstadz || '');
  };

  const handleSaveSetoran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForSetor) return;

    try {
      await onUpdateTahfidz(selectedStudentForSetor.id, {
        ...selectedStudentForSetor.tahfidz,
        juzTerakhir: formJuz,
        suratTerakhir: formSurat,
        predikat: formPredikat,
        catatanUstadz: formCatatan,
        terakhirSetor: new Date().toISOString().split('T')[0]
      });
      alert(`Setoran hafalan untuk ${selectedStudentForSetor.nama} berhasil disimpan!`);
      setSelectedStudentForSetor(null);
    } catch (err: any) {
      alert(`Gagal menyimpan setoran: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-700/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Program Unggulan MI Nurul Iman
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Monitoring Tahfidz Al-Qur'an & Juz 'Amma
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1">
              Pantau capaian setoran hafalan, mutaba'ah yaumiyah, dan sertifikasi munaqasyah santri.
            </p>
          </div>

          <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-700/80 text-center shrink-0">
            <p className="text-xs text-amber-300 font-bold uppercase">Predikat Mumtaz</p>
            <p className="text-2xl font-extrabold text-white">
              {students.filter(s => s.tahfidz?.predikat === 'Mumtaz').length} Santri
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-4 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {['Semua', 'Juz 30', 'Juz 29', 'Juz 28'].map(juz => (
              <button
                key={juz}
                onClick={() => setSelectedJuz(juz)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedJuz === juz
                    ? 'bg-amber-400 text-emerald-950'
                    : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
                }`}
              >
                {juz}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari santri / surat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-emerald-950/90 border border-emerald-700 text-white placeholder-emerald-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Grid of Tahfidz Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(student => (
          <div 
            key={student.id}
            className="bg-white rounded-xl border border-slate-200/90 hover:border-amber-400 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={student.foto}
                    alt={student.nama}
                    className="w-10 h-10 rounded-full object-cover border border-amber-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nama)}&background=047857&color=fff`;
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 truncate max-w-[170px]">{student.nama}</h4>
                    <p className="text-xs text-slate-500">Kelas {student.kelas} • NIS {student.nis}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  student.tahfidz.predikat === 'Mumtaz'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {student.tahfidz.predikat}
                </span>
              </div>

              <div className="mt-3.5 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Juz & Surat Terakhir:</span>
                  <span className="font-bold text-emerald-900">{student.tahfidz.juzTerakhir}</span>
                </div>
                <div className="mt-1 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Surat:</span>
                  <span className="font-semibold text-slate-800">{student.tahfidz.suratTerakhir}</span>
                </div>
                <div className="mt-1 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Terakhir Setor:</span>
                  <span className="font-mono">{student.tahfidz.terakhirSetor}</span>
                </div>
              </div>

              {student.tahfidz.catatanUstadz && (
                <p className="mt-2 text-xs italic text-slate-600 line-clamp-2 bg-amber-50/50 p-2 rounded border border-amber-100">
                  "{student.tahfidz.catatanUstadz}"
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total {student.tahfidz.totalSurat} Surat</span>
              <button
                onClick={() => handleOpenSetor(student)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Setoran</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Input Setoran */}
      {selectedStudentForSetor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Input Setoran Tahfidz: {selectedStudentForSetor.nama}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Kelas {selectedStudentForSetor.kelas} • NIS {selectedStudentForSetor.nis}
            </p>

            <form onSubmit={handleSaveSetoran} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Juz</label>
                <select
                  value={formJuz}
                  onChange={(e) => setFormJuz(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  <option value="Juz 30">Juz 30</option>
                  <option value="Juz 29">Juz 29</option>
                  <option value="Juz 28">Juz 28</option>
                  <option value="Juz 1">Juz 1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nama Surat & Ayat</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. An-Naba Ayat 1-40"
                  value={formSurat}
                  onChange={(e) => setFormSurat(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Predikat</label>
                <select
                  value={formPredikat}
                  onChange={(e) => setFormPredikat(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  <option value="Mumtaz">Mumtaz (Sangat Lancar & Tartil)</option>
                  <option value="Jayyid Jiddan">Jayyid Jiddan (Lancar)</option>
                  <option value="Jayyid">Jayyid (Cukup Lancar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Catatan Tajwid / Evaluasi Ustadz</label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Catatan waqaf, ikhfa, mad..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForSetor(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Simpan Setoran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
