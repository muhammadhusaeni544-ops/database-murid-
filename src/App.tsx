import React, { useState } from 'react';
import { 
  Users, CalendarCheck, BookOpen, CreditCard, IdCard, 
  LayoutDashboard, Bell, X, Wifi, Smartphone, Radio, 
  Plus, CheckCircle2, ChevronRight, School
} from 'lucide-react';
import { useRealtimeData } from './hooks/useRealtimeData.ts';
import { Student } from './types/student.ts';

// Components
import { Header } from './components/Header.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { StudentListView } from './components/StudentListView.tsx';
import { AttendanceView } from './components/AttendanceView.tsx';
import { TahfidzView } from './components/TahfidzView.tsx';
import { FinanceView } from './components/FinanceView.tsx';
import { StudentIdCardView } from './components/StudentIdCardView.tsx';
import { StudentDetailModal } from './components/StudentDetailModal.tsx';
import { StudentFormModal } from './components/StudentFormModal.tsx';
import { MobileAccessModal } from './components/MobileAccessModal.tsx';
import { ImportExportModal } from './components/ImportExportModal.tsx';

export default function App() {
  const {
    students,
    profile,
    stats,
    attendance,
    isConnected,
    isLoading,
    error,
    latestToast,
    clearToast,
    createStudent,
    updateStudent,
    deleteStudent,
    recordAttendance,
    recordPayment,
    bulkImport
  } = useRealtimeData();

  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isMobileAccessOpen, setIsMobileAccessOpen] = useState<boolean>(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);

  // Actions
  const handleOpenNewStudent = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data murid "${name}" dari Buku Induk?`)) {
      try {
        await deleteStudent(id);
      } catch (err: any) {
        alert(`Gagal menghapus: ${err.message}`);
      }
    }
  };

  const handleQuickAttend = async (student: Student) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    try {
      await recordAttendance({
        studentId: student.id,
        nis: student.nis,
        studentName: student.nama,
        kelas: student.kelas,
        tanggal: today,
        status: 'Hadir',
        waktu: timeStr
      });
    } catch (err: any) {
      alert(`Gagal mencatat kehadiran: ${err.message}`);
    }
  };

  const handleSaveStudent = async (studentData: any) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, studentData);
    } else {
      await createStudent(studentData);
    }
  };

  const handleUpdateTahfidz = async (studentId: string, tahfidzData: any) => {
    await updateStudent(studentId, { tahfidz: tahfidzData });
  };

  // Main application contents based on active tab
  const renderMainContent = () => {
    if (isLoading && students.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-emerald-900">Memuat Database Murid MI Nurul Iman...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            stats={stats}
            students={students}
            profile={profile}
            onNavigate={setActiveTab}
            onNewStudent={handleOpenNewStudent}
            onSelectStudent={setSelectedStudent}
          />
        );
      case 'students':
        return (
          <StudentListView
            students={students}
            onViewStudent={setSelectedStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onPrintCard={(st) => {
              setSelectedStudent(st);
            }}
            onQuickAttend={handleQuickAttend}
            onNewStudent={handleOpenNewStudent}
          />
        );
      case 'attendance':
        return (
          <AttendanceView
            students={students}
            attendance={attendance}
            onRecordAttendance={recordAttendance}
          />
        );
      case 'tahfidz':
        return (
          <TahfidzView
            students={students}
            onUpdateTahfidz={handleUpdateTahfidz}
          />
        );
      case 'finance':
        return (
          <FinanceView
            students={students}
            onRecordPayment={recordPayment}
          />
        );
      case 'idcard':
        return (
          <StudentIdCardView
            students={students}
            profile={profile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100/90 text-slate-800 ${isMobilePreview ? 'py-6 px-2 flex justify-center bg-slate-800' : ''}`}>
      
      {/* Live Toast Notification Banner */}
      {latestToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-emerald-900 text-white rounded-xl p-3.5 shadow-2xl border border-emerald-700/80 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300">Update Real-Time Terdeteksi</p>
              <p className="text-xs text-emerald-100 mt-0.5 leading-snug">{latestToast.message}</p>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">{latestToast.time}</span>
            </div>
          </div>
          <button
            onClick={clearToast}
            className="text-emerald-300 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container or Smartphone Bezel Frame */}
      <div className={`transition-all duration-300 ${
        isMobilePreview 
          ? 'w-[410px] max-w-full bg-slate-900 rounded-[48px] p-3 shadow-2xl border-[10px] border-slate-700 relative overflow-hidden'
          : 'w-full'
      }`}>
        
        {/* Smartphone Notch / Dynamic Island Simulator */}
        {isMobilePreview && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-4 bg-slate-800 rounded-full z-40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2" />
            <div className="w-2 h-2 rounded-full bg-blue-950" />
          </div>
        )}

        <div className={`bg-slate-50 flex flex-col min-h-screen ${
          isMobilePreview ? 'rounded-[36px] overflow-hidden max-h-[860px] overflow-y-auto' : ''
        }`}>
          
          {/* Header */}
          <Header
            profile={profile}
            isConnected={isConnected}
            isMobilePreview={isMobilePreview}
            onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
            onOpenNewStudentModal={handleOpenNewStudent}
            onOpenImportExport={() => setIsImportExportOpen(true)}
            onOpenMobileAccess={() => setIsMobileAccessOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main Workspace Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-20 sm:pb-8">
            {renderMainContent()}
          </main>

          {/* Bottom Navigation Bar for Mobile (Always visible on mobile or mobile simulator) */}
          <nav className="fixed sm:hidden bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-2 py-1 shadow-lg flex items-center justify-around">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'students', label: 'Murid', icon: Users },
              { id: 'attendance', label: 'Presensi', icon: CalendarCheck },
              { id: 'tahfidz', label: 'Tahfidz', icon: BookOpen },
              { id: 'finance', label: 'SPP', icon: CreditCard }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
                    isActive ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer (Desktop) */}
          <footer className="no-print bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 mt-auto hidden sm:block">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                © {new Date().getFullYear()} <strong>{profile?.nama || 'MI Nurul Iman'}</strong> • Sistem Database Induk Siswa & EMIS Kemenag
              </p>
              <div className="flex items-center gap-3 text-emerald-800 font-semibold">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  Real-Time Database Sync
                </span>
                <span>•</span>
                <button onClick={() => setIsMobileAccessOpen(true)} className="hover:underline flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  Akses Mobile
                </button>
              </div>
            </div>
          </footer>

        </div>

      </div>

      {/* MODALS */}
      <StudentDetailModal
        student={selectedStudent}
        profile={profile}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEdit={(st) => {
          setSelectedStudent(null);
          handleEditStudent(st);
        }}
        onRecordPayment={async (studentId, bulan, jumlah, metode, keterangan) => {
          const updated = await recordPayment(studentId, bulan, jumlah, metode, keterangan);
          setSelectedStudent(updated);
        }}
        onUpdateTahfidz={async (studentId, tahfidzData) => {
          const updated = await updateStudent(studentId, { tahfidz: tahfidzData });
          setSelectedStudent(updated);
        }}
      />

      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        editStudent={editingStudent}
      />

      <MobileAccessModal
        isOpen={isMobileAccessOpen}
        onClose={() => setIsMobileAccessOpen(false)}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        students={students}
        onBulkImport={bulkImport}
      />

    </div>
  );
}
