import React, { useState, useEffect } from 'react';
import { X, Save, User, Camera, Check } from 'lucide-react';
import { Student } from '../types/student.ts';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: any) => Promise<void>;
  editStudent: Student | null;
}

const PRESET_AVATARS = [
  { label: 'Siswa 1 (Laki-laki)', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80', gender: 'L' },
  { label: 'Siswa 2 (Laki-laki)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', gender: 'L' },
  { label: 'Siswa 3 (Laki-laki)', url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=80', gender: 'L' },
  { label: 'Siswa 4 (Laki-laki)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', gender: 'L' },
  { label: 'Siswi 1 (Perempuan)', url: 'https://images.unsplash.com/photo-1595454223600-91fbdd77e231?w=400&auto=format&fit=crop&q=80', gender: 'P' },
  { label: 'Siswi 2 (Perempuan)', url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80', gender: 'P' },
  { label: 'Siswi 3 (Perempuan)', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', gender: 'P' },
  { label: 'Siswi 4 (Perempuan)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', gender: 'P' }
];

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editStudent
}) => {
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    nik: '',
    nama: '',
    namaPanggilan: '',
    jenisKelamin: 'L' as 'L' | 'P',
    tempatLahir: 'Depok',
    tanggalLahir: '2017-05-10',
    agama: 'Islam',
    anakKe: 1,
    jumlahSaudara: 2,
    golonganDarah: '-',
    kelas: '1A',
    tingkat: 1,
    tahunMasuk: '2024',
    tahunAjaran: '2024/2025',
    status: 'Aktif' as any,
    waliKelas: 'Ustadzah Siti Maryam, S.Pd.I',
    jalan: 'Jl. H. Syarif No. ',
    rtRw: '02/04',
    desaKelurahan: 'Sukamaju',
    kecamatan: 'Cilodong',
    kabupatenKota: 'Kota Depok',
    provinsi: 'Jawa Barat',
    kodePos: '16415',
    namaAyah: '',
    nikAyah: '',
    pekerjaanAyah: 'Wiraswasta',
    pendidikanAyah: 'SMA',
    namaIbu: '',
    nikIbu: '',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    pendidikanIbu: 'SMA',
    telepon: '',
    penerimaPIP: false,
    nomorKIP: '',
    juzTerakhir: 'Juz 30',
    suratTerakhir: 'An-Naba',
    predikatTahfidz: 'Mumtaz' as any,
    foto: PRESET_AVATARS[0].url,
    catatanKhusus: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editStudent) {
      setFormData({
        nis: editStudent.nis,
        nisn: editStudent.nisn || '',
        nik: editStudent.nik || '',
        nama: editStudent.nama,
        namaPanggilan: editStudent.namaPanggilan || '',
        jenisKelamin: editStudent.jenisKelamin,
        tempatLahir: editStudent.tempatLahir,
        tanggalLahir: editStudent.tanggalLahir,
        agama: editStudent.agama || 'Islam',
        anakKe: editStudent.anakKe || 1,
        jumlahSaudara: editStudent.jumlahSaudara || 1,
        golonganDarah: editStudent.golonganDarah || '-',
        kelas: editStudent.kelas,
        tingkat: editStudent.tingkat || 1,
        tahunMasuk: editStudent.tahunMasuk || '2024',
        tahunAjaran: editStudent.tahunAjaran || '2024/2025',
        status: editStudent.status,
        waliKelas: editStudent.waliKelas || '',
        jalan: editStudent.alamat?.jalan || '',
        rtRw: editStudent.alamat?.rtRw || '',
        desaKelurahan: editStudent.alamat?.desaKelurahan || '',
        kecamatan: editStudent.alamat?.kecamatan || '',
        kabupatenKota: editStudent.alamat?.kabupatenKota || '',
        provinsi: editStudent.alamat?.provinsi || 'Jawa Barat',
        kodePos: editStudent.alamat?.kodePos || '',
        namaAyah: editStudent.orangTua?.namaAyah || '',
        nikAyah: editStudent.orangTua?.nikAyah || '',
        pekerjaanAyah: editStudent.orangTua?.pekerjaanAyah || '',
        pendidikanAyah: editStudent.orangTua?.pendidikanAyah || '',
        namaIbu: editStudent.orangTua?.namaIbu || '',
        nikIbu: editStudent.orangTua?.nikIbu || '',
        pekerjaanIbu: editStudent.orangTua?.pekerjaanIbu || '',
        pendidikanIbu: editStudent.orangTua?.pendidikanIbu || '',
        telepon: editStudent.orangTua?.telepon || '',
        penerimaPIP: !!editStudent.penerimaPIP,
        nomorKIP: editStudent.nomorKIP || '',
        juzTerakhir: editStudent.tahfidz?.juzTerakhir || 'Juz 30',
        suratTerakhir: editStudent.tahfidz?.suratTerakhir || 'An-Naba',
        predikatTahfidz: editStudent.tahfidz?.predikat || 'Mumtaz',
        foto: editStudent.foto || PRESET_AVATARS[0].url,
        catatanKhusus: editStudent.catatanKhusus || ''
      });
    } else {
      // Auto-generate fresh NIS
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setFormData(prev => ({
        ...prev,
        nis: `242501${randomSuffix}`,
        nisn: `016${Math.floor(1000000 + Math.random() * 9000000)}`
      }));
    }
  }, [editStudent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const studentPayload = {
        nis: formData.nis,
        nisn: formData.nisn,
        nik: formData.nik,
        nama: formData.nama,
        namaPanggilan: formData.namaPanggilan || formData.nama.split(' ')[0],
        jenisKelamin: formData.jenisKelamin,
        tempatLahir: formData.tempatLahir,
        tanggalLahir: formData.tanggalLahir,
        agama: formData.agama,
        anakKe: Number(formData.anakKe),
        jumlahSaudara: Number(formData.jumlahSaudara),
        golonganDarah: formData.golonganDarah,
        kelas: formData.kelas,
        tingkat: Number(formData.kelas[0]) || 1,
        tahunMasuk: formData.tahunMasuk,
        tahunAjaran: formData.tahunAjaran,
        status: formData.status,
        waliKelas: formData.waliKelas,
        alamat: {
          jalan: formData.jalan,
          rtRw: formData.rtRw,
          desaKelurahan: formData.desaKelurahan,
          kecamatan: formData.kecamatan,
          kabupatenKota: formData.kabupatenKota,
          provinsi: formData.provinsi,
          kodePos: formData.kodePos
        },
        orangTua: {
          namaAyah: formData.namaAyah,
          nikAyah: formData.nikAyah,
          pekerjaanAyah: formData.pekerjaanAyah,
          pendidikanAyah: formData.pendidikanAyah,
          namaIbu: formData.namaIbu,
          nikIbu: formData.nikIbu,
          pekerjaanIbu: formData.pekerjaanIbu,
          pendidikanIbu: formData.pendidikanIbu,
          telepon: formData.telepon
        },
        penerimaPIP: formData.penerimaPIP,
        nomorKIP: formData.nomorKIP,
        tahfidz: {
          juzTerakhir: formData.juzTerakhir,
          suratTerakhir: formData.suratTerakhir,
          totalSurat: 30,
          predikat: formData.predikatTahfidz,
          terakhirSetor: new Date().toISOString().split('T')[0]
        },
        keuangan: editStudent ? editStudent.keuangan : {
          statusSPP: 'Lunas',
          nominalSPP: 250000,
          bulanTerbayar: ['Juli 2024'],
          terakhirBayar: new Date().toISOString().split('T')[0],
          riwayat: []
        },
        foto: formData.foto,
        catatanKhusus: formData.catatanKhusus
      };

      await onSave(studentPayload);
      onClose();
    } catch (err: any) {
      alert(`Gagal menyimpan data: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              {editStudent ? 'Edit Data Murid' : 'Pendaftaran Murid Baru MI Nurul Iman'}
            </h3>
            <p className="text-xs text-emerald-200">
              Standar Buku Induk Siswa & Sinkronisasi EMIS Kemenag
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Section 1: Foto Profil */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Foto Murid (Pilih Foto Profil)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
              {PRESET_AVATARS.map((av, idx) => (
                <div
                  key={idx}
                  onClick={() => setFormData(prev => ({ ...prev, foto: av.url, jenisKelamin: av.gender as any }))}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 p-0.5 transition-all ${
                    formData.foto === av.url ? 'border-amber-500 scale-105 shadow-md' : 'border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <img src={av.url} alt={av.label} className="w-full h-14 object-cover rounded-lg" />
                  {formData.foto === av.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Data Induk & Identitas */}
          <div>
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-emerald-100 flex items-center gap-1.5">
              <span>1. Data Pribadi Siswa</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIS (Nomor Induk) *</label>
                <input
                  type="text"
                  required
                  value={formData.nis}
                  onChange={e => setFormData({ ...formData, nis: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  placeholder="242501001"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NISN (10 Digit Kemenag)</label>
                <input
                  type="text"
                  value={formData.nisn}
                  onChange={e => setFormData({ ...formData, nisn: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  placeholder="0168923412"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIK Siswa (16 Digit)</label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={e => setFormData({ ...formData, nik: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  placeholder="327602..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Murid *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  placeholder="Nama sesuai akta kelahiran / KK"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={formData.namaPanggilan}
                  onChange={e => setFormData({ ...formData, namaPanggilan: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  placeholder="Nama panggilan sehari-hari"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                <select
                  value={formData.jenisKelamin}
                  onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas & Rombel *</label>
                <select
                  value={formData.kelas}
                  onChange={e => {
                    const k = e.target.value;
                    let wali = 'Ustadzah Siti Maryam, S.Pd.I';
                    if (k === '1B') wali = 'Ustadz Ridwan Hakim, S.Pd';
                    else if (k.startsWith('2')) wali = 'Ustadzah Nurul Hidayati, S.Ag';
                    else if (k.startsWith('3')) wali = 'Ustadz Ahmad Syauqi, M.Pd';
                    else if (k.startsWith('4')) wali = 'Ustadzah Halimah, S.Pd';
                    else if (k.startsWith('5')) wali = 'Ustadz Hasan Basri, S.Pd.I';
                    else if (k.startsWith('6')) wali = 'Ustadzah Dra. Hj. Siti Zubaidah';
                    setFormData({ ...formData, kelas: k, waliKelas: wali });
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-bold text-emerald-800"
                >
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Wali Kelas</label>
                <input
                  type="text"
                  value={formData.waliKelas}
                  onChange={e => setFormData({ ...formData, waliKelas: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Murid</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold text-green-700"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Mutasi">Mutasi Keluar</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Cuti">Cuti</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Data Orang Tua / Wali */}
          <div>
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-emerald-100">
              2. Data Orang Tua / Wali Murid
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ayah Kandung</label>
                <input
                  type="text"
                  value={formData.namaAyah}
                  onChange={e => setFormData({ ...formData, namaAyah: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  placeholder="Nama Ayah"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ayah</label>
                <input
                  type="text"
                  value={formData.pekerjaanAyah}
                  onChange={e => setFormData({ ...formData, pekerjaanAyah: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ibu Kandung</label>
                <input
                  type="text"
                  value={formData.namaIbu}
                  onChange={e => setFormData({ ...formData, namaIbu: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  placeholder="Nama Ibu"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ibu</label>
                <input
                  type="text"
                  value={formData.pekerjaanIbu}
                  onChange={e => setFormData({ ...formData, pekerjaanIbu: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP Orang Tua *</label>
                <input
                  type="text"
                  required
                  value={formData.telepon}
                  onChange={e => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  placeholder="0812xxxxxxxx (Untuk notifikasi presensi & SPP)"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Alamat Lengkap */}
          <div>
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-emerald-100">
              3. Alamat Domisili
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Jalan / Gang / Komplek</label>
                <input
                  type="text"
                  value={formData.jalan}
                  onChange={e => setFormData({ ...formData, jalan: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">RT / RW</label>
                <input
                  type="text"
                  value={formData.rtRw}
                  onChange={e => setFormData({ ...formData, rtRw: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kelurahan / Desa</label>
                <input
                  type="text"
                  value={formData.desaKelurahan}
                  onChange={e => setFormData({ ...formData, desaKelurahan: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={formData.kecamatan}
                  onChange={e => setFormData({ ...formData, kecamatan: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={formData.kabupatenKota}
                  onChange={e => setFormData({ ...formData, kabupatenKota: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Bantuan & Tahfidz */}
          <div>
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-emerald-100">
              4. Data KIP/PIP & Tahfidz
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={formData.penerimaPIP}
                    onChange={e => setFormData({ ...formData, penerimaPIP: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Penerima Bantuan KIP / PIP</span>
                </label>
                {formData.penerimaPIP && (
                  <input
                    type="text"
                    placeholder="Nomor KIP (Kartu Indonesia Pintar)"
                    value={formData.nomorKIP}
                    onChange={e => setFormData({ ...formData, nomorKIP: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  />
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">Target / Hafalan Awal Tahfidz</label>
                <div className="flex gap-2">
                  <select
                    value={formData.juzTerakhir}
                    onChange={e => setFormData({ ...formData, juzTerakhir: e.target.value })}
                    className="w-1/2 text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Juz 30">Juz 30</option>
                    <option value="Juz 29">Juz 29</option>
                    <option value="Juz 28">Juz 28</option>
                  </select>
                  <select
                    value={formData.predikatTahfidz}
                    onChange={e => setFormData({ ...formData, predikatTahfidz: e.target.value as any })}
                    className="w-1/2 text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Mumtaz">Mumtaz</option>
                    <option value="Jayyid Jiddan">Jayyid Jiddan</option>
                    <option value="Jayyid">Jayyid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : editStudent ? 'Simpan Perubahan' : 'Daftarkan Murid'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
