import { useState, useEffect, useCallback, useRef } from 'react';
import { Student, SchoolProfile, AttendanceRecord, RealtimeEvent } from '../types/student.ts';

export function useRealtimeData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latestToast, setLatestToast] = useState<{ message: string; type?: string; time: string } | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resStudents, resProfile, resStats, resAttendance] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/profile'),
        fetch('/api/stats'),
        fetch('/api/attendance')
      ]);

      if (resStudents.ok) {
        const data = await resStudents.json();
        setStudents(data);
      }
      if (resProfile.ok) {
        const data = await resProfile.json();
        setProfile(data);
      }
      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data);
      }
      if (resAttendance.ok) {
        const data = await resAttendance.json();
        setAttendance(data);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data dari server. Pastikan koneksi server aktif.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    fetchData();

    let retryTimeout: NodeJS.Timeout;

    const connectSSE = () => {
      try {
        const es = new EventSource('/api/realtime/stream');
        eventSourceRef.current = es;

        es.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        es.onmessage = (event) => {
          try {
            const parsed: RealtimeEvent = JSON.parse(event.data);
            if (parsed.message) {
              setLatestToast({
                message: parsed.message,
                type: parsed.type,
                time: new Date().toLocaleTimeString('id-ID')
              });
            }

            if (parsed.type === 'student_created' && parsed.data) {
              setStudents(prev => [parsed.data, ...prev.filter(s => s.id !== parsed.data.id)]);
              fetchStats();
            } else if (parsed.type === 'student_updated' && parsed.data) {
              setStudents(prev => prev.map(s => s.id === parsed.data.id ? parsed.data : s));
              fetchStats();
            } else if (parsed.type === 'student_deleted' && parsed.studentId) {
              setStudents(prev => prev.filter(s => s.id !== parsed.studentId));
              fetchStats();
            } else if (parsed.type === 'attendance_recorded' && parsed.data) {
              setAttendance(prev => {
                const idx = prev.findIndex(a => a.studentId === parsed.data.studentId && a.tanggal === parsed.data.tanggal);
                if (idx !== -1) {
                  const updated = [...prev];
                  updated[idx] = parsed.data;
                  return updated;
                }
                return [parsed.data, ...prev];
              });
              fetchStats();
            } else if (parsed.type === 'payment_added' && parsed.data) {
              setStudents(prev => prev.map(s => s.id === parsed.data.id ? parsed.data : s));
              fetchStats();
            } else if (parsed.type === 'bulk_imported') {
              fetchData();
            }
          } catch (e) {
            // Heartbeat or malformed
          }
        };

        es.onerror = () => {
          setIsConnected(false);
          es.close();
          retryTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (err) {
        setIsConnected(false);
        retryTimeout = setTimeout(connectSSE, 4000);
      }
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      clearTimeout(retryTimeout);
    };
  }, [fetchData]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) setStats(await res.json());
    } catch (e) {
      // Ignore background refresh error
    }
  };

  const createStudent = async (studentData: any): Promise<Student> => {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menyimpan data');
    }
    const created = await res.json();
    return created;
  };

  const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal memperbarui data');
    }
    const updated = await res.json();
    return updated;
  };

  const deleteStudent = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menghapus data');
    }
    return true;
  };

  const recordAttendance = async (data: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> => {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menyimpan presensi');
    }
    return await res.json();
  };

  const recordPayment = async (studentId: string, bulan: string, jumlah: number, metode: any, keterangan: string): Promise<Student> => {
    const res = await fetch('/api/finance/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, bulan, jumlah, metode, keterangan })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal mencatat pembayaran');
    }
    return await res.json();
  };

  const bulkImport = async (studentsList: Partial<Student>[]): Promise<{ added: number; updated: number }> => {
    const res = await fetch('/api/students/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students: studentsList })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal mengimpor data');
    }
    return await res.json();
  };

  return {
    students,
    profile,
    stats,
    attendance,
    isConnected,
    isLoading,
    error,
    latestToast,
    clearToast: () => setLatestToast(null),
    refresh: fetchData,
    createStudent,
    updateStudent,
    deleteStudent,
    recordAttendance,
    recordPayment,
    bulkImport
  };
}
