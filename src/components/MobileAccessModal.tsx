import React, { useState, useEffect } from 'react';
import { X, Smartphone, QrCode, CheckCircle, Wifi, Share2, Download } from 'lucide-react';
import { generateStudentQR } from '../utils/qr.ts';

interface MobileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAccessModal: React.FC<MobileAccessModalProps> = ({
  isOpen,
  onClose
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [appUrl, setAppUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setAppUrl(url);
      generateStudentQR(url).then(data => setQrUrl(data));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Akses Real-Time di Smartphone (HP)</h3>
              <p className="text-xs text-slate-500">Buka langsung di Android atau iOS tanpa instalasi ribet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
            {qrUrl ? (
              <div className="bg-white p-2 rounded-xl shadow-xs border border-emerald-200 shrink-0">
                <img src={qrUrl} alt="QR Akses Mobile" className="w-32 h-32" />
              </div>
            ) : (
              <div className="w-32 h-32 bg-slate-200 rounded-xl animate-pulse" />
            )}

            <div className="text-xs space-y-1.5 text-center sm:text-left">
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-700 text-white font-bold text-[10px]">
                Scan Kamera HP
              </span>
              <p className="text-slate-700 leading-relaxed">
                Arahkan kamera smartphone Anda ke QR code ini untuk membuka aplikasi Database MI Nurul Iman secara langsung.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-emerald-800 font-semibold pt-1">
                <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Real-Time Sync Aktif Antar Perangkat</span>
              </div>
            </div>
          </div>

          {/* URL Copy Box */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="text-xs bg-transparent border-0 font-mono text-slate-600 flex-1 truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shrink-0"
            >
              {copied ? 'Tersalin!' : 'Salin Link'}
            </button>
          </div>

          {/* PWA / Add to Home Screen Instructions */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-white text-xs space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-700" />
              Pasang sebagai Aplikasi HP (PWA - Add to Home Screen):
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
              <li>Buka link di browser <strong>Chrome</strong> (Android) atau <strong>Safari</strong> (iPhone).</li>
              <li>Pilih menu <strong>Titik Tiga</strong> atau tombol <strong>Bagikan (Share)</strong>.</li>
              <li>Pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.</li>
              <li>Ikon MI Nurul Iman akan muncul di beranda HP Anda layaknya aplikasi asli!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
