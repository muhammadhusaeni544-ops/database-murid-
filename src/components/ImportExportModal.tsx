import React, { useState } from 'react';
import { X, Download, Upload, FileSpreadsheet, FileJson, CheckCircle, AlertCircle } from 'lucide-react';
import { Student } from '../types/student.ts';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onBulkImport: (studentsList: Partial<Student>[]) => Promise<{ added: number; updated: number }>;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  students,
  onBulkImport
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  // Export JSON Backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Database_Murid_MI_Nurul_Iman_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const handleExportCsv = () => {
    window.open('/api/export/csv', '_blank');
  };

  // Import JSON / CSV file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          const list = Array.isArray(parsed) ? parsed : (parsed.students || []);
          const res = await onBulkImport(list);
          setImportStatus(`✓ Berhasil: ${res.added} murid baru ditambahkan, ${res.updated} diperbarui!`);
        } else if (file.name.endsWith('.csv')) {
          // Parse simple CSV lines
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          if (lines.length <= 1) {
            throw new Error('File CSV kosong atau hanya berisi baris judul');
          }

          const parsedList: Partial<Student>[] = [];
          for (let i = 1; i < lines.length; i++) {
            // Split CSV respecting quotes
            const row = lines[i].split(',').map(val => val.replace(/^"|"$/g, '').trim());
            if (row.length >= 4 && row[3]) {
              parsedList.push({
                nis: row[0] || `2425${Math.floor(1000 + Math.random() * 9000)}`,
                nisn: row[1] || '',
                nik: row[2] || '',
                nama: row[3],
                namaPanggilan: row[4] || row[3].split(' ')[0],
                jenisKelamin: (row[5] === 'P' ? 'P' : 'L') as any,
                kelas: row[6] || '1A',
                tempatLahir: row[7] || 'Depok',
                tanggalLahir: row[8] || '2017-01-01',
                waliKelas: row[9] || 'Ustadzah Siti Maryam, S.Pd.I'
              });
            }
          }

          const res = await onBulkImport(parsedList);
          setImportStatus(`✓ Berhasil mengimpor CSV: ${res.added} murid ditambahkan, ${res.updated} diperbarui!`);
        }
      } catch (err: any) {
        setImportStatus(`❌ Gagal membaca file: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Ekspor & Impor Database Murid</h3>
              <p className="text-xs text-slate-500">Kompatibel dengan Microsoft Excel & EMIS Kemenag</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          
          {/* Section Ekspor */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Unduh / Ekspor Data
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportCsv}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center gap-3 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Ekspor Excel / CSV</p>
                  <p className="text-[10px] text-slate-500">Format EMIS & Dapodik</p>
                </div>
              </button>

              <button
                onClick={handleExportJson}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center gap-3 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileJson className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Backup JSON Penuh</p>
                  <p className="text-[10px] text-slate-500">Cadangan seluruh data</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section Impor */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Unggah / Impor Data Siswa
            </h4>
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-5 text-center transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Pilih file CSV atau JSON untuk diimpor
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 mb-3">
                File akan disinkronkan otomatis ke database murid MI Nurul Iman
              </p>

              <label className="inline-flex items-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                <span>{isProcessing ? 'Memproses...' : 'Pilih Berkas Komputer'}</span>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border text-xs font-medium">
                {importStatus}
              </div>
            )}
          </div>

        </div>

        <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
