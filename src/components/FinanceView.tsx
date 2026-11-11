import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertTriangle, Printer, Search, Download, Plus } from 'lucide-react';
import { Student } from '../types/student.ts';

interface FinanceViewProps {
  students: Student[];
  onRecordPayment: (studentId: string, bulan: string, jumlah: number, metode: any, keterangan: string) => Promise<any>;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  students,
  onRecordPayment
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterKelas, setFilterKelas] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');
  
  // Modal Bayar
  const [payStudent, setPayStudent] = useState<Student | null>(null);
  const [payMonth, setPayMonth] = useState('Februari 2025');
  const [payAmount, setPayAmount] = useState(250000);
  const [payMethod, setPayMethod] = useState<'Tunai' | 'Transfer Bank' | 'QRIS'>('Tunai');
  const [payNote, setPayNote] = useState('');

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<{ student: Student; payment: any } | null>(null);

  const filtered = students.filter(s => {
    const matchStatus = filterStatus === 'Semua' ? true : s.keuangan?.statusSPP === filterStatus;
    const matchKelas = filterKelas === 'Semua' ? true : s.kelas === filterKelas;
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    return matchStatus && matchKelas && matchSearch;
  });

  const totalNominalBulan = students.reduce((acc, s) => acc + (s.keuangan?.nominalSPP || 250000), 0);
  const lunasCount = students.filter(s => s.keuangan?.statusSPP === 'Lunas').length;
  const nunggakCount = students.filter(s => s.keuangan?.statusSPP === 'Menunggak').length;

  const handleOpenPay = (student: Student) => {
    setPayStudent(student);
    setPayAmount(student.keuangan?.nominalSPP || 250000);
    setPayNote(`Pembayaran SPP ${payMonth}`);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStudent) return;

    try {
      const updatedStudent = await onRecordPayment(payStudent.id, payMonth, payAmount, payMethod, payNote);
      alert(`Pembayaran SPP untuk ${payStudent.nama} berhasil dicatat!`);
      // Open receipt for printing
      if (updatedStudent && updatedStudent.keuangan?.riwayat?.[0]) {
        setSelectedReceipt({
          student: updatedStudent,
          payment: updatedStudent.keuangan.riwayat[0]
        });
      }
      setPayStudent(null);
    } catch (err: any) {
      alert(`Gagal mencatat pembayaran: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Target SPP Bulanan</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">
              Rp {totalNominalBulan.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{students.length} Total Santri</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Status Lunas Bulan Ini</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              {lunasCount} Santri
            </p>
            <p className="text-[11px] text-emerald-600 mt-0.5">
              {students.length > 0 ? Math.round((lunasCount / students.length) * 100) : 0}% Terpenuhi
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Santri Menunggak</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">
              {nunggakCount} Santri
            </p>
            <p className="text-[11px] text-amber-600 mt-0.5">Perlu tindak lanjut / penagihan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Status SPP Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-600">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-0 font-bold text-slate-800 focus:outline-none"
              >
                <option value="Semua">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Menunggak">Menunggak</option>
              </select>
            </div>

            {/* Kelas Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-600">Kelas:</span>
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="bg-transparent border-0 font-bold text-slate-800 focus:outline-none"
              >
                <option value="Semua">Semua Kelas</option>
                <option value="1A">Kelas 1A</option>
                <option value="1B">Kelas 1B</option>
                <option value="2A">Kelas 2A</option>
                <option value="3A">Kelas 3A</option>
                <option value="4A">Kelas 4A</option>
                <option value="5A">Kelas 5A</option>
                <option value="6A">Kelas 6A</option>
              </select>
            </div>

          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari murid..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table of Students & Finance */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Murid</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5">Nominal / Bln</th>
                <th className="p-3.5">Status SPP</th>
                <th className="p-3.5">Terakhir Bayar</th>
                <th className="p-3.5 text-right">Aksi Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => {
                const isLunas = student.keuangan?.statusSPP === 'Lunas';
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
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
                          <p className="font-bold text-slate-800">{student.nama}</p>
                          <p className="text-[11px] text-slate-400">NIS: {student.nis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">Kelas {student.kelas}</td>
                    <td className="p-3.5 font-mono font-semibold text-slate-800">
                      Rp {(student.keuangan?.nominalSPP || 250000).toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isLunas ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isLunas ? 'Lunas' : 'Menunggak'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono">
                      {student.keuangan?.terakhirBayar || '-'}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenPay(student)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                        >
                          Bayar SPP
                        </button>
                        {student.keuangan?.riwayat?.[0] && (
                          <button
                            onClick={() => setSelectedReceipt({ student, payment: student.keuangan.riwayat[0] })}
                            title="Cetak Kuitansi Terakhir"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Bayar SPP */}
      {payStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Catat Pembayaran SPP: {payStudent.nama}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Kelas {payStudent.kelas} • NIS {payStudent.nis}
            </p>

            <form onSubmit={handleSubmitPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bulan SPP</label>
                <input
                  type="text"
                  required
                  value={payMonth}
                  onChange={(e) => setPayMonth(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Jumlah Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Metode Pembayaran</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  <option value="Tunai">Tunai / Teller Madrasah</option>
                  <option value="Transfer Bank">Transfer Bank Syariah</option>
                  <option value="QRIS">QRIS / E-Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="Catatan kwitansi..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayStudent(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kuitansi Cetak */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            
            {/* Printable Receipt Layout */}
            <div className="border-2 border-emerald-800 p-5 rounded-xl bg-amber-50/20 text-slate-800 relative">
              <div className="text-center border-b-2 border-emerald-800 pb-3 mb-3">
                <h3 className="font-extrabold text-sm text-emerald-900 uppercase tracking-wider">
                  MADRASAH IBTIDAIYAH NURUL IMAN
                </h3>
                <p className="text-[10px] text-slate-600">
                  Jl. H. Syarif No. 45 Sukamaju, Cilodong, Kota Depok • Telp: (021) 7788-9900
                </p>
                <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-800 text-white text-[11px] font-bold mt-1">
                  KUITANSI PEMBAYARAN RESMI
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Bukti / ID:</span>
                  <span className="font-mono font-bold">{selectedReceipt.payment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telah Diterima Dari:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.student.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas / NIS:</span>
                  <span className="font-semibold">{selectedReceipt.student.kelas} / {selectedReceipt.student.nis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Untuk Pembayaran:</span>
                  <span className="font-semibold text-emerald-900">{selectedReceipt.payment.keterangan || selectedReceipt.payment.bulan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode:</span>
                  <span className="font-semibold">{selectedReceipt.payment.metode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal:</span>
                  <span className="font-mono">{selectedReceipt.payment.tanggal}</span>
                </div>

                <div className="mt-3 pt-3 border-t-2 border-dashed border-slate-300 flex justify-between items-center bg-white p-2.5 rounded-lg border">
                  <span className="text-xs font-bold text-slate-700">Jumlah Uang:</span>
                  <span className="text-base font-extrabold text-emerald-800 font-mono">
                    Rp {selectedReceipt.payment.jumlah.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex justify-between items-end text-[10px] text-slate-500">
                <div className="text-center">
                  <p>Penyetor</p>
                  <p className="mt-8 font-semibold text-slate-700">{selectedReceipt.student.orangTua.namaAyah || 'Orang Tua Murid'}</p>
                </div>
                <div className="text-center">
                  <p>Depok, {selectedReceipt.payment.tanggal}</p>
                  <p>Bendahara Madrasah</p>
                  <p className="mt-8 font-bold text-emerald-900 underline">Ustadzah Siti Maryam, S.Pd.I</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Nota Kuitansi</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
