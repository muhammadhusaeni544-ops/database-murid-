import React, { useState, useEffect } from 'react';
import { Printer, IdCard, Users, Filter, Download } from 'lucide-react';
import { Student, SchoolProfile } from '../types/student.ts';
import { generateStudentQR } from '../utils/qr.ts';

interface StudentIdCardViewProps {
  students: Student[];
  profile: SchoolProfile | null;
}

export const StudentIdCardView: React.FC<StudentIdCardViewProps> = ({
  students,
  profile
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  const filteredStudents = students.filter(s => {
    if (selectedClass !== 'Semua' && s.kelas !== selectedClass) return false;
    if (selectedStudentId !== 'all' && s.id !== selectedStudentId) return false;
    return true;
  });

  useEffect(() => {
    // Generate QR codes for all filtered students
    const generateAllQrs = async () => {
      const map: Record<string, string> = {};
      for (const student of filteredStudents) {
        const qrContent = JSON.stringify({
          school: 'MI NURUL IMAN DEPOK',
          nis: student.nis,
          nisn: student.nisn,
          nama: student.nama,
          kelas: student.kelas,
          valid: true
        });
        map[student.id] = await generateStudentQR(qrContent);
      }
      setQrMap(map);
    };

    generateAllQrs();
  }, [selectedClass, selectedStudentId, students]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Control Bar (Hidden when printing) */}
      <div className="no-print bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <IdCard className="w-5 h-5 text-emerald-700" />
              Cetak Kartu Tanda Pelajar (KTA) Digital
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Desain kartu resmi MI Nurul Iman berstandar nasional lengkap dengan QR Code validasi dan barcode.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors self-end sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Sekarang ({filteredStudents.length} Kartu)</span>
          </button>
        </div>

        {/* Filter Selection */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Pilih Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudentId('all');
              }}
              className="p-1.5 rounded-lg border border-slate-300 font-bold text-emerald-800 bg-slate-50"
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

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Pilih Murid Spesifik:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-300 max-w-xs bg-slate-50 font-medium"
            >
              <option value="all">Semua Siswa Terfilter</option>
              {students
                .filter(s => selectedClass === 'Semua' ? true : s.kelas === selectedClass)
                .map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.kelas} - {s.nis})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards Printable Sheet Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 printable-card-area">
        {filteredStudents.map(student => (
          <div 
            key={student.id}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm break-inside-avoid"
          >
            {/* FRONT OF CARD */}
            <div className="w-[330px] h-[210px] rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-900 text-white p-3 relative flex flex-col justify-between border-2 border-amber-400 shrink-0">
              
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-emerald-700/60 pb-1.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-emerald-950 font-extrabold text-sm shadow-xs">
                  MI
                </div>
                <div>
                  <h4 className="text-[11px] font-extrabold uppercase text-amber-300 leading-tight">
                    MADRASAH IBTIDAIYAH NURUL IMAN
                  </h4>
                  <p className="text-[8px] text-emerald-200">
                    NSM: {profile?.nsm || '111232010045'} • NPSN: {profile?.npsn || '60728912'} • Depok
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="flex items-center gap-2.5 my-auto">
                <img
                  src={student.foto}
                  alt={student.nama}
                  className="w-16 h-20 object-cover rounded-md border border-white shadow shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nama)}&background=047857&color=fff`;
                  }}
                />
                <div className="text-[10px] space-y-0.5 overflow-hidden">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-amber-300 block">
                    KARTU TANDA PELAJAR
                  </span>
                  <p className="font-bold text-white text-xs truncate">{student.nama}</p>
                  <p className="text-emerald-100 font-mono text-[10px]">NIS: {student.nis}</p>
                  <p className="text-emerald-100 font-mono text-[10px]">NISN: {student.nisn || '-'}</p>
                  <p className="text-emerald-100">
                    Kelas: <span className="font-bold text-amber-300">{student.kelas}</span> • {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                  <p className="text-[9px] text-emerald-200 truncate">{student.tempatLahir}, {student.tanggalLahir}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between pt-1 border-t border-emerald-700/60">
                <div className="text-[8px] text-emerald-200 leading-tight">
                  <p className="text-white">Kepala Madrasah</p>
                  <p className="text-amber-300 font-bold mt-1.5">{profile?.kepalaMadrasah || 'H. Ahmad Fauzi, M.Pd.I'}</p>
                </div>
                {qrMap[student.id] && (
                  <div className="bg-white p-0.5 rounded shadow-xs">
                    <img src={qrMap[student.id]} alt="QR Siswa" className="w-10 h-10" />
                  </div>
                )}
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="w-[330px] h-[210px] rounded-xl overflow-hidden shadow-md bg-white text-slate-800 p-3 relative flex flex-col justify-between border-2 border-slate-300 shrink-0">
              <div className="text-center border-b border-slate-200 pb-1.5">
                <p className="text-[9px] font-extrabold text-emerald-900 uppercase tracking-wider">TATA TERTIB MURID</p>
                <p className="text-[8px] text-slate-500">Madrasah Ibtidaiyah Nurul Iman</p>
              </div>

              <div className="text-[8.5px] text-slate-600 space-y-1 my-auto">
                <p>1. Kartu ini adalah identitas resmi siswa MI Nurul Iman.</p>
                <p>2. Wajib dibawa setiap hari masuk madrasah untuk presensi.</p>
                <p>3. Dilarang mencoret, merusak, atau meminjamkan kartu ini.</p>
                <p>4. Jika kartu hilang, segera laporkan ke TU Madrasah.</p>
              </div>

              <div className="bg-slate-50 p-1.5 rounded text-center border border-slate-200 text-[8px] text-slate-500 leading-tight">
                <p className="font-semibold text-slate-700">{profile?.alamat || 'Jl. H. Syarif No. 45 Sukamaju, Cilodong, Kota Depok'}</p>
                <p>Telp: {profile?.telepon || '(021) 7788-9900'}</p>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
