import { Student, SchoolProfile, AttendanceRecord } from '../src/types/student.ts';

export const initialSchoolProfile: SchoolProfile = {
  nama: 'Madrasah Ibtidaiyah Nurul Iman',
  nsm: '111232010045',
  npsn: '60728912',
  akreditasi: 'A (Unggul - BAN S/M)',
  kepalaMadrasah: 'H. Ahmad Fauzi, M.Pd.I',
  nipKepala: '197805142005011003',
  alamat: 'Jl. H. Syarif No. 45, RT 03/RW 05, Kel. Sukamaju, Kec. Cilodong',
  kota: 'Kota Depok, Jawa Barat 16415',
  telepon: '(021) 7788-9900 / 0812-8822-1928',
  email: 'mi.nuruliman@kemenag.go.id',
  tahunAjaranAktif: '2024/2025',
  semesterAktif: 'Genap'
};

export const initialStudents: Student[] = [
  {
    id: 'std-001',
    nis: '232401001',
    nisn: '0158923411',
    nik: '3276021503150001',
    nama: 'Muhammad Al-Fatih Pratama',
    namaPanggilan: 'Fatih',
    jenisKelamin: 'L',
    tempatLahir: 'Depok',
    tanggalLahir: '2017-03-15',
    agama: 'Islam',
    anakKe: 1,
    jumlahSaudara: 2,
    golonganDarah: 'O',
    kelas: '1A',
    tingkat: 1,
    tahunMasuk: '2023',
    tahunAjaran: '2024/2025',
    status: 'Aktif',
    waliKelas: 'Ustadzah Siti Maryam, S.Pd.I',
    alamat: {
      jalan: 'Jl. Melati No. 12',
      rtRw: '02/04',
      desaKelurahan: 'Sukamaju',
      kecamatan: 'Cilodong',
      kabupatenKota: 'Kota Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16415'
    },
    orangTua: {
      namaAyah: 'Bambang Pratama, S.T.',
      nikAyah: '3276021008820003',
      pekerjaanAyah: 'Karyawan Swasta',
      pendidikanAyah: 'S1 Teknik',
      namaIbu: 'Dewi Anggraini, S.E.',
      nikIbu: '3276025204850002',
      pekerjaanIbu: 'Ibu Rumah Tangga',
      pendidikanIbu: 'S1 Ekonomi',
      telepon: '081287654321',
      email: 'bambang.pratama@gmail.com'
    },
    penerimaPIP: false,
    tahfidz: {
      juzTerakhir: 'Juz 30',
      suratTerakhir: 'An-Naba',
      totalSurat: 37,
      predikat: 'Mumtaz',
      terakhirSetor: '2025-02-10',
      catatanUstadz: 'Makharijul huruf sangat fasih, tartil sangat baik.'
    },
    keuangan: {
      statusSPP: 'Lunas',
      nominalSPP: 250000,
      bulanTerbayar: ['Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024', 'Januari 2025', 'Februari 2025'],
      terakhirBayar: '2025-02-05',
      riwayat: [
        {
          id: 'pay-001',
          bulan: 'Februari 2025',
          tanggal: '2025-02-05',
          jumlah: 250000,
          metode: 'Transfer Bank',
          keterangan: 'SPP Bulan Februari 2025'
        }
      ]
    },
    foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    catatanKhusus: 'Juara 1 Lomba Tahfidz Tingkat Kecamatan Cilodong',
    createdAt: '2023-07-10T08:00:00Z',
    updatedAt: '2025-02-10T09:30:00Z'
  },
  {
    id: 'std-002',
    nis: '232401002',
    nisn: '0157819202',
    nik: '3276025608160002',
    nama: 'Aisyah Nur Ramadhani',
    namaPanggilan: 'Aisyah',
    jenisKelamin: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2017-06-22',
    agama: 'Islam',
    anakKe: 2,
    jumlahSaudara: 2,
    golonganDarah: 'A',
    kelas: '1A',
    tingkat: 1,
    tahunMasuk: '2023',
    tahunAjaran: '2024/2025',
    status: 'Aktif',
    waliKelas: 'Ustadzah Siti Maryam, S.Pd.I',
    alamat: {
      jalan: 'Jl. H. Dimun Raya Blok C No. 5',
      rtRw: '03/06',
      desaKelurahan: 'Kalibaru',
      kecamatan: 'Cilodong',
      kabupatenKota: 'Kota Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16414'
    },
    orangTua: {
      namaAyah: 'Hendra Gunawan',
      nikAyah: '3276021203800004',
      pekerjaanAyah: 'Wiraswasta',
      pendidikanAyah: 'SMA/Sederajat',
      namaIbu: 'Siti Rohmah',
      nikIbu: '3276024905830001',
      pekerjaanIbu: 'Pedagang',
      pendidikanIbu: 'SMA/Sederajat',
      telepon: '085712349876'
    },
    penerimaPIP: true,
    nomorKIP: 'KIP-2023-99812',
    tahfidz: {
      juzTerakhir: 'Juz 30',
      suratTerakhir: 'At-Takwir',
      totalSurat: 32,
      predikat: 'Jayyid Jiddan',
      terakhirSetor: '2025-02-08',
      catatanUstadz: 'Hafalan lancar, perlu peningkatan dengung ghunnah.'
    },
    keuangan: {
      statusSPP: 'Lunas',
      nominalSPP: 250000,
      bulanTerbayar: ['Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024', 'Januari 2025', 'Februari 2025'],
      terakhirBayar: '2025-02-02',
      riwayat: [
        {
          id: 'pay-002',
          bulan: 'Februari 2025',
          tanggal: '2025-02-02',
          jumlah: 250000,
          metode: 'Tunai',
          keterangan: 'Subsidi PIP - SPP Februari 2025'
        }
      ]
    },
    foto: 'https://images.unsplash.com/photo-1595454223600-91fbdd77e231?w=400&auto=format&fit=crop&q=80',
    catatanKhusus: 'Aktif di ekstra kurikuler Rebana/Hadrah',
    createdAt: '2023-07-10T08:15:00Z',
    updatedAt: '2025-02-08T10:00:00Z'
  },
  {
    id: 'std-003',
    nis: '232401003',
    nisn: '0156728193',
    nik: '3276021901170003',
    nama: 'Ahmad Zaki Mubarak',
    namaPanggilan: 'Zaki',
    jenisKelamin: 'L',
    tempatLahir: 'Bogor',
    tanggalLahir: '2017-01-19',
    agama: 'Islam',
    anakKe: 3,
    jumlahSaudara: 3,
    golonganDarah: 'B',
    kelas: '1B',
    tingkat: 1,
    tahunMasuk: '2023',
    tahunAjaran: '2024/2025',
    status: 'Aktif',
    waliKelas: 'Ustadz Ridwan Hakim, S.Pd',
    alamat: {
      jalan: 'Kp. Sawah RT 01/RW 02 No. 8',
      rtRw: '01/02',
      desaKelurahan: 'Jatimulya',
      kecamatan: 'Cilodong',
      kabupatenKota: 'Kota Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16413'
    },
    orangTua: {
      namaAyah: 'Mubarak Sulaeman',
      nikAyah: '3276021102780005',
      pekerjaanAyah: 'Guru',
      pendidikanAyah: 'S1 Tarbiyah',
      namaIbu: 'Khadijah Al-Kubro',
      nikIbu: '3276026507810006',
      pekerjaanIbu: 'Guru Honorer',
      pendidikanIbu: 'S1 Agama',
      telepon: '081399887766'
    },
    penerimaPIP: false,
    tahfidz: {
      juzTerakhir: 'Juz 30',
      suratTerakhir: 'Al-A’la',
      totalSurat: 28,
      predikat: 'Jayyid',
      terakhirSetor: '2025-02-07',
      catatanUstadz: 'Semangat murajaah cukup baik, sering aktif di kelas.'
    },
    keuangan: {
      statusSPP: 'Menunggak',
      nominalSPP: 250000,
      bulanTerbayar: ['Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024'],
      terakhirBayar: '2024-12-10',
      riwayat: [
        {
          id: 'pay-003',
          bulan: 'Desember 2024',
          tanggal: '2024-12-10',
          jumlah: 250000,
          metode: 'Tunai',
          keterangan: 'SPP Bulan Desember 2024'
        }
      ]
    },
    foto: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=80',
    createdAt: '2023-07-11T09:00:00Z',
    updatedAt: '2025-02-07T11:20:00Z'
  },
  {
    id: 'std-004',
    nis: '222302015',
    nisn: '0148819204',
    nik: '3276026011160004',
    nama: 'Fatimah Az-Zahra Husna',
    namaPanggilan: 'Zahra',
    jenisKelamin: 'P',
    tempatLahir: 'Depok',
    tanggalLahir: '2016-11-20',
    agama: 'Islam',
    anakKe: 1,
    jumlahSaudara: 1,
    golonganDarah: 'AB',
    kelas: '2A',
    tingkat: 2,
    tahunMasuk: '2022',
    tahunAjaran: '2024/2025',
    status: 'Aktif',
    waliKelas: 'Ustadzah Nurul Hidayati, S.Ag',
    alamat: {
      jalan: 'Perumahan Grand Depok City Cluster Anggrek No. 18',
      rtRw: '05/08',
      desaKelurahan: 'Kalimulya',
      kecamatan: 'Cilodong',
      kabupatenKota: 'Kota Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16413'
    },
    orangTua: {
      namaAyah: 'dr. H. Luqman Hakim',
      nikAyah: '3276020509790002',
      pekerjaanAyah: 'Dokter',
      pendidikanAyah: 'S2 Kedokteran',
      namaIbu: 'drg. Hj. Rina Safitri',
      nikIbu: '3276025110820003',
      pekerjaanIbu: 'Dokter Gigi',
      pendidikanIbu: 'Profesi Dokter',
      telepon: '08119876543'
    },
    penerimaPIP: false,
    tahfidz: {
      juzTerakhir: 'Juz 29',
      suratTerakhir: 'Al-Mulk',
      totalSurat: 48,
      predikat: 'Mumtaz',
      terakhirSetor: '2025-02-11',
      catatanUstadz: 'Sangat istiqomah, sudah mulai setoran Surat Al-Mulk ayat 1-30.'
    },
    keuangan: {
      statusSPP: 'Lunas',
      nominalSPP: 250000,
      bulanTerbayar: ['Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024', 'Januari 2025', 'Februari 2025', 'Maret 2025'],
      terakhirBayar: '2025-01-15',
      riwayat: [
        {
          id: 'pay-004',
          bulan: 'Februari - Maret 2025',
          tanggal: '2025-01-15',
          jumlah: 500000,
          metode: 'QRIS',
          keterangan: 'Bayar 2 bulan di muka'
        }
      ]
    },
    foto: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80',
    catatanKhusus: 'Duta Madrasah Sehat 2024',
    createdAt: '2022-07-12T07:45:00Z',
    updatedAt: '2025-02-11T08:15:00Z'
  },
  {
    id: 'std-005',
    nis: '212203022',
    nisn: '0139921045',
    nik: '3276022204150005',
    nama: 'Rizky Ramadhan Al-Farizi',
    namaPanggilan: 'Rizky',
    jenisKelamin: 'L',
    tempatLahir: 'Depok',
    tanggalLahir: '2015-07-04',
    agama: 'Islam',
    anakKe: 2,
    jumlahSaudara: 3,
    golonganDarah: 'B',
    kelas: '3A',
    tingkat: 3,
    tahunMasuk: '2021',
    tahunAjaran: '2024/2025',
    status: 'Aktif',
    waliKelas: 'Ustadz Ahmad Syauqi, M.Pd',
    alamat: {
      jalan: 'Jl. Raden Saleh RT 04/RW 03 No. 40',
      rtRw: '04/03',
      desaKelurahan: 'Sukamaju Baru',
      kecamatan: 'Tapos',
      kabupatenKota: 'Kota Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16455'
    },
    orangTua: {
      namaAyah: 'Farid Ramadhan',
      nikAyah: '3276021406770001',
      pekerjaanAyah: 'PNS Kemenag',
      pendidikanAyah: 'S1',
      namaIbu: 'Laila Munawaroh',
      nikIbu: '3276026009800002',
      pekerjaanIbu: 'Guru Madrasah',
      pendidikanIbu: 'S1',
      telepon: '081312345678'
    },
    penerimaPIP: false,
    tahfidz: {
      juzTerakhir: 'Juz 30',
      suratTerakhir: 'An-Nazi’at',
      totalSurat: 36,
      predikat: 'Mumtaz',
      terakhirSetor: '2025-02-09',
      catatanUstadz: 'Bacaan bersuara merdu, vokal tegas dan makhraj tepat.'
    },
    keuangan: {
      statusSPP: 'Lunas',
      nominalSPP: 250000,
      bulanTerbayar: ['Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024', 'Januari 2025', 'Februari 2025'],
      terakhirBayar: '2025-02-01',
      riwayat: []
    },
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    createdAt: '2021-07-15T08:00:00Z',
    updatedAt: '2025-02-09T10:15:00Z'
  },
  {
    id: 'std-006',
    nis: '202104008',
    nisn: '0128765432',
    nik: '3276024809140006',
    nama: 'Nabila Khairunnisa Azzah',
    namaPanggilan: 'Nabila',
    jenisKelamin: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2014-09-08',
    agama: 'Islam',
    anakKe: 1,
    jumlahSaudara: 2,
    golonganDarah: 'O',
    kelas: '4A',
    tingkat: 4,
    tahunMasuk: '2020',
    tahunAjaran: '2024/2025',
    status: 'Aktif',
    waliKelas: 'Ustadzah Halimah, S.Pd',
    alamat: {
      jalan: 'Jl. Raya Cilodong No. 99',
      rtRw: '01/01',
      desaKelurahan: 'Cilodong',
      kecamatan: 'Cilodong',
      kabupatenKota: 'Kota Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16414'
    },
    orangTua: {
      namaAyah: 'Drs. H. Mulyono',
      nikAyah: '3276021908700001',
      pekerjaanAyah: 'Pensiunan BUMN',
      pendidikanAyah: 'S1',
      namaIbu: 'Hj. Endang Suryani',
      nikIbu: '3276025112750003',
      pekerjaanIbu: 'Wiraswasta',
      pendidikanIbu: 'D3',
      telepon: '081234567890'
    },
    penerimaPIP: false,
    tahfidz: {
      juzTerakhir: 'Juz 29',
      suratTerakhir: 'Al-Qalam',
      totalSurat: 50,
      predikat: 'Jayyid Jiddan',
      terakhirSetor: '2025-02-10',
      catatanUstadz: 'Hafalan Juz 30 telah dimunaqasyah 100% lancar.'
    },
    keuangan: {
      statusSPP: 'Lunas',
      nominalSPP: 250000,
      bulanTerbayar: ['Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024', 'Januari 2025', 'Februari 2025'],
      terakhirBayar: '2025-02-04',
      riwayat: []
    },
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    catatanKhusus: 'Juara 1 Pidato Bahasa Arab Porseni Madrasah 2024',
    createdAt: '2020-07-14T09:00:00Z',
    updatedAt: '2025-02-10T11:00:00Z'
  },
  {
    id: 'std-007',
    nis: '192005011',
    nisn: '0117654321',
    nik: '3276021208130007',
    nama: 'Habibie Ilham Maulana',
    namaPanggilan: 'Habib',
    jenisKelamin: 'L',
    tempatLahir: 'Depok',
    tanggalLahir: '2013-08-12',
    agama: 'Islam',
    anakKe: 2,
    jumlahSaudara: 2,
    golonganDarah: 'A',
    kelas: '5A',
    tingkat: 5,
    tahunMasuk: '2019',
    tahunAjaran: '2024/2025',
    status: 'Aktif',
    waliKelas: 'Ustadz Hasan Basri, S.Pd.I',
    alamat: {
      jalan: 'Jl. Masjid Nurul Huda RT 02/05',
      rtRw: '02/05',
      desaKelurahan: 'Kalibaru',
      kecamatan: 'Cilodong',
      kabupatenKota: 'Kota Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16414'
    },
    orangTua: {
      namaAyah: 'Maulana Yusuf',
      nikAyah: '3276020807750002',
      pekerjaanAyah: 'Driver Online',
      pendidikanAyah: 'SMA',
      namaIbu: 'Maryam Jamilah',
      nikIbu: '3276025004780001',
      pekerjaanIbu: 'Buruh Harian Lepas',
      pendidikanIbu: 'SMP',
      telepon: '087812983746'
    },
    penerimaPIP: true,
    nomorKIP: 'KIP-2021-11298',
    tahfidz: {
      juzTerakhir: 'Juz 30',
      suratTerakhir: 'An-Naba',
      totalSurat: 37,
      predikat: 'Jayyid',
      terakhirSetor: '2025-02-06',
      catatanUstadz: 'Perlu pengulangan secara rutin di rumah.'
    },
    keuangan: {
      statusSPP: 'Menunggak',
      nominalSPP: 250000,
      bulanTerbayar: ['Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024'],
      terakhirBayar: '2024-11-20',
      riwayat: []
    },
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    createdAt: '2019-07-16T08:30:00Z',
    updatedAt: '2025-02-06T10:45:00Z'
  },
  {
    id: 'std-008',
    nis: '181906005',
    nisn: '0106543210',
    nik: '3276025802120008',
    nama: 'Syifa Nur Fadillah',
    namaPanggilan: 'Syifa',
    jenisKelamin: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2012-02-18',
    agama: 'Islam',
    anakKe: 1,
    jumlahSaudara: 3,
    golonganDarah: 'O',
    kelas: '6A',
    tingkat: 6,
    tahunMasuk: '2018',
    tahunAjaran: '2024/2025',
    status: 'Aktif',
    waliKelas: 'Ustadzah Dra. Hj. Siti Zubaidah',
    alamat: {
      jalan: 'Jl. Raya Bogor KM 38 No. 15',
      rtRw: '03/01',
      desaKelurahan: 'Sukamaju',
      kecamatan: 'Cilodong',
      kabupatenKota: 'Kota Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16415'
    },
    orangTua: {
      namaAyah: 'Fadillah Akbar, S.E.',
      nikAyah: '3276021804720003',
      pekerjaanAyah: 'Manajer Operasional',
      pendidikanAyah: 'S1',
      namaIbu: 'Nur Hasanah',
      nikIbu: '3276026209740002',
      pekerjaanIbu: 'Ibu Rumah Tangga',
      pendidikanIbu: 'D3',
      telepon: '081299118822'
    },
    penerimaPIP: false,
    tahfidz: {
      juzTerakhir: 'Juz 28',
      suratTerakhir: 'At-Tahrim',
      totalSurat: 60,
      predikat: 'Mumtaz',
      terakhirSetor: '2025-02-11',
      catatanUstadz: 'Target 3 Juz (28, 29, 30) tercapai dengan sangat istimewa.'
    },
    keuangan: {
      statusSPP: 'Lunas',
      nominalSPP: 250000,
      bulanTerbayar: ['Juli 2024', 'Agustus 2024', 'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024', 'Januari 2025', 'Februari 2025'],
      terakhirBayar: '2025-02-03',
      riwayat: []
    },
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    catatanKhusus: 'Calon Wisudawan Tahfidz 3 Juz Angkatan 2025',
    createdAt: '2018-07-15T08:00:00Z',
    updatedAt: '2025-02-11T13:00:00Z'
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-001',
    studentId: 'std-001',
    nis: '232401001',
    studentName: 'Muhammad Al-Fatih Pratama',
    kelas: '1A',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    waktu: '06:45:12'
  },
  {
    id: 'att-002',
    studentId: 'std-002',
    nis: '232401002',
    studentName: 'Aisyah Nur Ramadhani',
    kelas: '1A',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    waktu: '06:50:30'
  },
  {
    id: 'att-003',
    studentId: 'std-003',
    nis: '232401003',
    studentName: 'Ahmad Zaki Mubarak',
    kelas: '1B',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Sakit',
    waktu: '07:10:00',
    keterangan: 'Demam batuk flu, surat dokter terlampir'
  },
  {
    id: 'att-004',
    studentId: 'std-004',
    nis: '222302015',
    studentName: 'Fatimah Az-Zahra Husna',
    kelas: '2A',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    waktu: '06:40:05'
  },
  {
    id: 'att-005',
    studentId: 'std-005',
    nis: '212203022',
    studentName: 'Rizky Ramadhan Al-Farizi',
    kelas: '3A',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    waktu: '06:48:22'
  },
  {
    id: 'att-006',
    studentId: 'std-006',
    nis: '202104008',
    studentName: 'Nabila Khairunnisa Azzah',
    kelas: '4A',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    waktu: '06:42:15'
  },
  {
    id: 'att-007',
    studentId: 'std-007',
    nis: '192005011',
    studentName: 'Habibie Ilham Maulana',
    kelas: '5A',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Izin',
    waktu: '07:05:00',
    keterangan: 'Ada acara keluarga di Jawa Tengah'
  },
  {
    id: 'att-008',
    studentId: 'std-008',
    nis: '181906005',
    studentName: 'Syifa Nur Fadillah',
    kelas: '6A',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    waktu: '06:38:50'
  }
];
