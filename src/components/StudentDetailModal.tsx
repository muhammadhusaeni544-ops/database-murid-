import React, { useState, useEffect } from 'react';
import { 
  X, User, MapPin, Phone, BookOpen, Award, CreditCard, 
  Calendar, Printer, CheckCircle, AlertCircle, Sparkles, 
  Share2, ShieldCheck, Download
} from 'lucide-react';
import { Student, SchoolProfile } from '../types/student.ts';
import { generateStudentQR } from '../utils/qr.ts';

interface StudentDetailModalProps {
  student: Student | null;
  profile: SchoolProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onRecordPayment: (studentId: string, bulan: string, jumlah: number, metode: any, keterangan: string) => void;
  onUpdateTahfidz: (studentId: string, tahfidzData: any) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  profile,
  isOpen,
  onClose,
  onEdit,
  onRecordPayment,
  onUpdateTahfidz
}) => {
  const [activeTab, setActiveTab] = useState<'biodata' | 'orangtua' | 'tahfidz' | 'keuangan' | 'kta'>('biodata');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Payment quick state
  const [payMonth, setPayMonth] = useState('Februari 2025');
  const [payAmount, setPayAmount] = useState(250000);
  const [payMethod, setPayMethod] = useState<'Tunai' | 'Transfer Bank' | 'QRIS'>('Tunai');
  const [paySuccess, setPaySuccess] = useState(false);

  // Tahfidz quick state
  const [newJuz, setNewJuz] = useState('Juz 30');
  const [newSurat, setNewSurat] = useState('');
  const [newPredikat, setNewPredikat] = useState<'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid'>('Mumtaz');
  const [newCatatan, setNewCatatan] = useState('');

  useEffect(() => {
    if (student) {
      // Generate QR Code containing student verification string
      const qrData = JSON.stringify({
        madrasah: 'MI NURUL IMAN',
        nis: student.nis,
        nisn: student.nisn,
        nama: student.nama,
        kelas: student.kelas,
        status: student.status
      });
      generateStudentQR(qrData).then(url => setQrCodeUrl(url));
      setNewJuz(student.tahfidz.juzTerakhir || 'Juz 30');
      setNewSurat(student.tahfidz.suratTerakhir || '');
      setNewPredikat(student.tahfidz.predikat as any || 'Mumtaz');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordPayment(student.id, payMonth, payAmount, payMethod, `Pembayaran SPP ${payMonth}`);
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 3000);
  };

  const handleSaveTahfidz = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTahfidz(student.id, {
      ...student.tahfidz,
      juzTerakhir: newJuz,
      suratTerakhir: newSurat || student.tahfidz.suratTerakhir,
      predikat: newPredikat,
      catatanUstadz: newCatatan || student.tahfidz.catatanUstadz,
      terakhirSetor: new Date().toISOString().split('T')[0]
    });
    alert('Hafalan Tahfidz berhasil diperbarui!');
  };

  const getWaLink = (rawNumber: string) => {
    let clean = rawNumber.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    return `https://wa.me/${clean}?text=${encodeURIComponent(`Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak/Ibu Wali dari ${student.nama} (MI Nurul Iman)...`)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative">
              <img
                src={student.foto}
                alt={student.nama}
                className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nama)}&background=047857&color=fff`;
                }}
              />
              <span className={`absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded font-bold text-white shadow ${
                student.jenisKelamin === 'L' ? 'bg-sky-600' : 'bg-rose-500'
              }`}>
                {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
              </span>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-amber-400 text-emerald-950 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  Kelas {student.kelas}
                </span>
                <span className="bg-emerald-700/80 text-emerald-100 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {student.status}
                </span>
                {student.penerimaPIP && (
                  <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    PIP/KIP: {student.nomorKIP || 'Terdaftar'}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight text-white">
                {student.nama}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                NIS: <span className="font-mono text-white font-semibold">{student.nis}</span> • NISN: <span className="font-mono text-white font-semibold">{student.nisn || '-'}</span> • Wali Kelas: {student.waliKelas}
              </p>
            </div>

            <div className="flex items-center gap-2 self-center sm:self-start">
              <button
                onClick={() => onEdit(student)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white transition-colors"
              >
                Ubah Data
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 mt-5 border-t border-emerald-700/60 pt-3 overflow-x-auto scrollbar-none">
            {[
              { id: 'biodata', label: 'Biodata Siswa' },
              { id: 'orangtua', label: 'Orang Tua / Wali' },
              { id: 'tahfidz', label: 'Tahfidz Al-Qur\'an' },
              { id: 'keuangan', label: 'SPP & Keuangan' },
              { id: 'kta', label: 'Kartu Pelajar (KTA)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: BIODATA */}
          {activeTab === 'biodata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Identitas Siswa</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Nama Lengkap</span>
                      <span className="font-semibold text-slate-800">{student.nama}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Nama Panggilan</span>
                      <span className="font-semibold text-slate-800">{student.namaPanggilan || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">NIK (Kependudukan)</span>
                      <span className="font-mono font-semibold text-slate-800">{student.nik || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Tempat, Tgl Lahir</span>
                      <span className="font-semibold text-slate-800">{student.tempatLahir}, {student.tanggalLahir}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Jenis Kelamin</span>
                      <span className="font-semibold text-slate-800">{student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Agama</span>
                      <span className="font-semibold text-slate-800">{student.agama}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Gol. Darah / Anak ke</span>
                      <span className="font-semibold text-slate-800">{student.golonganDarah} / Anak ke-{student.anakKe} dari {student.jumlahSaudara} bersaudara</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Akademik & Domisili</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Tingkat / Rombel</span>
                      <span className="font-semibold text-emerald-800">Kelas {student.kelas} (Tingkat {student.tingkat})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Tahun Masuk / Ajaran</span>
                      <span className="font-semibold text-slate-800">{student.tahunMasuk} ({student.tahunAjaran})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Status Siswa</span>
                      <span className="font-semibold text-green-700">{student.status}</span>
                    </div>
                    <div className="py-1">
                      <span className="text-slate-500 block mb-1">Alamat Tempat Tinggal:</span>
                      <p className="font-medium text-slate-800 leading-relaxed bg-white p-2 rounded border border-slate-200">
                        {student.alamat.jalan}, RT {student.alamat.rtRw}, Kel. {student.alamat.desaKelurahan}, Kec. {student.alamat.kecamatan}, {student.alamat.kabupatenKota}, {student.alamat.provinsi} ({student.alamat.kodePos})
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {student.catatanKhusus && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                  <span className="font-bold flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Catatan Prestasi / Khusus:
                  </span>
                  <p>{student.catatanKhusus}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORANG TUA / WALI */}
          {activeTab === 'orangtua' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Ayah */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      A
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">Data Ayah Kandung</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Nama Ayah</span>
                      <span className="font-semibold text-slate-800">{student.orangTua.namaAyah || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">NIK Ayah</span>
                      <span className="font-mono text-slate-800">{student.orangTua.nikAyah || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Pekerjaan</span>
                      <span className="font-semibold text-slate-800">{student.orangTua.pekerjaanAyah || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Pendidikan</span>
                      <span className="font-semibold text-slate-800">{student.orangTua.pendidikanAyah || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Ibu */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-xs">
                      I
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">Data Ibu Kandung</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Nama Ibu</span>
                      <span className="font-semibold text-slate-800">{student.orangTua.namaIbu || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">NIK Ibu</span>
                      <span className="font-mono text-slate-800">{student.orangTua.nikIbu || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Pekerjaan</span>
                      <span className="font-semibold text-slate-800">{student.orangTua.pekerjaanIbu || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Pendidikan</span>
                      <span className="font-semibold text-slate-800">{student.orangTua.pendidikanIbu || '-'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Contact Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Kontak WhatsApp / Telepon Orang Tua</h4>
                    <p className="text-xs text-emerald-800 font-mono font-semibold">
                      {student.orangTua.telepon || 'Belum diisi'}
                    </p>
                  </div>
                </div>

                {student.orangTua.telepon && (
                  <a
                    href={getWaLink(student.orangTua.telepon)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>Chat WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TAHFIDZ */}
          {activeTab === 'tahfidz' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">Capaian Tahfidz Al-Qur'an</p>
                    <h3 className="text-lg font-bold text-slate-800">
                      {student.tahfidz.juzTerakhir} • Surat {student.tahfidz.suratTerakhir}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Total {student.tahfidz.totalSurat} Surat • Predikat: <span className="font-bold text-emerald-700">{student.tahfidz.predikat}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-amber-400 text-emerald-950 font-bold text-xs rounded-full shadow-xs">
                    {student.tahfidz.predikat}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Setor: {student.tahfidz.terakhirSetor}</p>
                </div>
              </div>

              {student.tahfidz.catatanUstadz && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <p className="font-semibold text-slate-700 mb-1">Catatan Ustadz Pembimbing Tahfidz:</p>
                  <p className="italic text-slate-600">"{student.tahfidz.catatanUstadz}"</p>
                </div>
              )}

              {/* Form Input Setoran Baru */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  Update Setoran Hafalan Baru
                </h4>
                <form onSubmit={handleSaveTahfidz} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Juz</label>
                    <select
                      value={newJuz}
                      onChange={(e) => setNewJuz(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Juz 30">Juz 30 (Amma)</option>
                      <option value="Juz 29">Juz 29 (Tabarak)</option>
                      <option value="Juz 28">Juz 28</option>
                      <option value="Juz 1">Juz 1</option>
                      <option value="Juz Lainnya">Juz Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Surat & Ayat</label>
                    <input
                      type="text"
                      placeholder="e.g. Al-Fajr Ayat 1-30"
                      value={newSurat}
                      onChange={(e) => setNewSurat(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Predikat Kelancaran</label>
                    <select
                      value={newPredikat}
                      onChange={(e) => setNewPredikat(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Mumtaz">Mumtaz (Sempurna)</option>
                      <option value="Jayyid Jiddan">Jayyid Jiddan (Sangat Baik)</option>
                      <option value="Jayyid">Jayyid (Baik)</option>
                      <option value="Maqbul">Maqbul (Cukup)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Catatan / Evaluasi Tajwid</label>
                    <input
                      type="text"
                      placeholder="Catatan makhraj, mad, atau kelancaran..."
                      value={newCatatan}
                      onChange={(e) => setNewCatatan(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Simpan Setoran Tahfidz
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: KEUANGAN / SPP */}
          {activeTab === 'keuangan' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Status Iuran SPP Madrasah:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      student.keuangan.statusSPP === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {student.keuangan.statusSPP === 'Lunas' ? 'Lunas s/d Februari 2025' : 'Menunggak'}
                    </span>
                    <span className="text-xs text-slate-600">Nominal: Rp {student.keuangan.nominalSPP.toLocaleString('id-ID')}/bln</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Terakhir Pembayaran: <span className="font-semibold text-slate-800">{student.keuangan.terakhirBayar || '-'}</span>
                </div>
              </div>

              {/* Form Input Pembayaran SPP */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  Catat Pembayaran SPP Baru
                </h4>
                {paySuccess && (
                  <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Pembayaran berhasil dicatat & disinkronkan ke seluruh sistem!
                  </div>
                )}
                <form onSubmit={handlePay} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Bulan Pembayaran</label>
                    <input
                      type="text"
                      value={payMonth}
                      onChange={(e) => setPayMonth(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Nominal (Rp)</label>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Metode Bayar</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    >
                      <option value="Tunai">Tunai / Langsung di Madrasah</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="QRIS">QRIS / Dompet Digital</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Konfirmasi Bayar SPP
                    </button>
                  </div>
                </form>
              </div>

              {/* Riwayat Pembayaran */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Riwayat Pembayaran Terbaru</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Bulan</th>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">Jumlah</th>
                        <th className="p-2.5">Metode</th>
                        <th className="p-2.5">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(student.keuangan.riwayat || []).length > 0 ? (
                        student.keuangan.riwayat.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-semibold text-slate-800">{r.bulan}</td>
                            <td className="p-2.5 text-slate-600">{r.tanggal}</td>
                            <td className="p-2.5 font-mono text-emerald-800 font-semibold">Rp {r.jumlah.toLocaleString('id-ID')}</td>
                            <td className="p-2.5">{r.metode}</td>
                            <td className="p-2.5 text-slate-500">{r.keterangan}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-400">
                            Belum ada riwayat pembayaran manual tercatat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KARTU TANDA PELAJAR (KTA) */}
          {activeTab === 'kta' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Pratinjau Kartu Tanda Pelajar (KTA)</h4>
                  <p className="text-xs text-slate-500">Standar ID Card Resmi MI Nurul Iman lengkap dengan QR Code validasi.</p>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Kartu</span>
                </button>
              </div>

              {/* CARD PREVIEW */}
              <div className="flex flex-col items-center gap-6 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                
                {/* Front Side */}
                <div className="w-[340px] sm:w-[380px] h-[230px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-3.5 relative flex flex-col justify-between border-2 border-amber-400">
                  {/* Watermark / Ornaments */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                  
                  {/* Card Header */}
                  <div className="flex items-center gap-2.5 border-b border-emerald-700/60 pb-2">
                    <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-emerald-950 font-bold text-lg shadow-sm">
                      MI
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold tracking-wider uppercase text-amber-300">
                        MADRASAH IBTIDAIYAH NURUL IMAN
                      </h4>
                      <p className="text-[9px] text-emerald-200">Kemenag Kota Depok • NSM: {profile?.nsm || '111232010045'}</p>
                    </div>
                  </div>

                  {/* Card Center: Photo & Details */}
                  <div className="flex items-center gap-3 my-auto">
                    <img
                      src={student.foto}
                      alt={student.nama}
                      className="w-20 h-24 object-cover rounded-lg border-2 border-white shadow-md shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nama)}&background=047857&color=fff`;
                      }}
                    />
                    <div className="text-xs space-y-0.5 overflow-hidden">
                      <p className="text-[10px] text-amber-300 uppercase font-semibold">KARTU TANDA PELAJAR</p>
                      <h5 className="font-bold text-white text-sm truncate">{student.nama}</h5>
                      <p className="text-[11px] text-emerald-100 font-mono">NIS: {student.nis}</p>
                      <p className="text-[11px] text-emerald-100 font-mono">NISN: {student.nisn || '-'}</p>
                      <p className="text-[11px] text-emerald-100">Kelas: <span className="font-bold text-amber-300">{student.kelas}</span></p>
                      <p className="text-[10px] text-emerald-200 truncate">{student.tempatLahir}, {student.tanggalLahir}</p>
                    </div>
                  </div>

                  {/* Card Footer: Signature & QR */}
                  <div className="flex items-end justify-between pt-1 border-t border-emerald-700/60">
                    <div className="text-[9px] text-emerald-200 leading-tight">
                      <p className="text-white font-semibold">Kepala Madrasah</p>
                      <p className="text-amber-300 font-bold mt-2">{profile?.kepalaMadrasah || 'H. Ahmad Fauzi, M.Pd.I'}</p>
                    </div>
                    {qrCodeUrl && (
                      <div className="bg-white p-1 rounded-md shadow-xs">
                        <img src={qrCodeUrl} alt="QR Code Siswa" className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Back Side */}
                <div className="w-[340px] sm:w-[380px] h-[230px] rounded-2xl overflow-hidden shadow-xl bg-white text-slate-800 p-4 relative flex flex-col justify-between border-2 border-slate-300">
                  <div className="text-center border-b border-slate-200 pb-2">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">TATA TERTIB & KETENTUAN</p>
                    <p className="text-[9px] text-slate-500">Madrasah Ibtidaiyah Nurul Iman Depok</p>
                  </div>

                  <div className="text-[10px] text-slate-600 space-y-1.5 my-auto">
                    <p>1. Kartu ini adalah bukti identitas sah murid MI Nurul Iman.</p>
                    <p>2. Wajib dibawa setiap hari dan digunakan saat presensi harian / perpustakaan.</p>
                    <p>3. Apabila kartu ini hilang atau rusak, segera melapor ke pihak tata usaha.</p>
                    <p>4. Barangsiapa menemukan kartu ini dimohon mengembalikan ke alamat madrasah.</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-200 text-[9px] text-slate-500">
                    <p className="font-bold text-slate-700">{profile?.alamat || 'Jl. H. Syarif No. 45 Sukamaju Cilodong'}</p>
                    <p>Telp: {profile?.telepon || '(021) 7788-9900'} • Email: {profile?.email || 'mi.nuruliman@kemenag.go.id'}</p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Terdaftar sejak: {new Date(student.createdAt).toLocaleDateString('id-ID')}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
