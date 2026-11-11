import React from 'react';
import { School, Radio, Smartphone, Monitor, UserPlus, FileSpreadsheet, QrCode, BookOpen } from 'lucide-react';
import { SchoolProfile } from '../types/student.ts';

interface HeaderProps {
  profile: SchoolProfile | null;
  isConnected: boolean;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
  onOpenNewStudentModal: () => void;
  onOpenImportExport: () => void;
  onOpenMobileAccess: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isConnected,
  isMobilePreview,
  onToggleMobilePreview,
  onOpenNewStudentModal,
  onOpenImportExport,
  onOpenMobileAccess,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-30 border-b border-emerald-800">
      {/* Top Bar with School Info & Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & School Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md border-2 border-emerald-700 shrink-0">
              <School className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
                  {profile?.nama || 'MI NURUL IMAN'}
                </h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider hidden sm:inline-block">
                  Akreditasi {profile?.akreditasi?.split(' ')[0] || 'A'}
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                NSM: {profile?.nsm} • NPSN: {profile?.npsn} • TA {profile?.tahunAjaranAktif} ({profile?.semesterAktif})
              </p>
            </div>
          </div>

          {/* Controls: Live Status, Device Toggle, Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Real-Time Status Pill */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isConnected 
                ? 'bg-emerald-800/80 text-emerald-200 border-emerald-600/60' 
                : 'bg-rose-950/70 text-rose-300 border-rose-800'
            }`}>
              <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
              <span className="hidden sm:inline">{isConnected ? 'Real-Time Sync' : 'Menghubungkan...'}</span>
              <span className="sm:hidden">{isConnected ? 'Live' : 'Offline'}</span>
            </div>

            {/* Mobile View Toggle */}
            <button
              onClick={onToggleMobilePreview}
              title={isMobilePreview ? 'Kembali ke tampilan Desktop' : 'Simulasi tampilan Layar HP (Mobile View)'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isMobilePreview
                  ? 'bg-amber-500 text-emerald-950 border-amber-400 font-semibold shadow-sm'
                  : 'bg-emerald-800/70 text-emerald-100 hover:bg-emerald-700 border-emerald-700'
              }`}
            >
              {isMobilePreview ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isMobilePreview ? 'Layar Penuh' : 'Mode HP'}</span>
            </button>

            {/* Akses Mobile QR */}
            <button
              onClick={onOpenMobileAccess}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-800/70 hover:bg-emerald-700 text-emerald-100 border border-emerald-700"
              title="Buka di HP / Smartphone via QR"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Akses HP</span>
            </button>

            {/* Ekspor / Impor */}
            <button
              onClick={onOpenImportExport}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-800/70 hover:bg-emerald-700 text-emerald-100 border border-emerald-700"
              title="Ekspor ke Excel / Impor Data"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor/Impor</span>
            </button>

            {/* Tambah Murid Baru */}
            <button
              onClick={onOpenNewStudentModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-sm transition-all transform active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Murid Baru</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-emerald-950/90 border-t border-emerald-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard & Rekap' },
            { id: 'students', label: 'Buku Induk Murid' },
            { id: 'attendance', label: 'Presensi Real-Time' },
            { id: 'tahfidz', label: 'Tahfidz Al-Qur\'an' },
            { id: 'finance', label: 'SPP & Keuangan' },
            { id: 'idcard', label: 'Cetak Kartu Pelajar' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white font-semibold shadow-inner'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
