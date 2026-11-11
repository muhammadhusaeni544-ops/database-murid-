import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './server/storage.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Real-Time Server-Sent Events (SSE) Stream
app.get('/api/realtime/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Terhubung ke server real-time MI Nurul Iman', timestamp: new Date().toISOString() })}\n\n`);

  storage.addSseClient(res);

  // Heartbeat ping every 25 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(`: heartbeat ${Date.now()}\n\n`);
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    storage.removeSseClient(res);
  });
});

// School Profile
app.get('/api/profile', (_req: Request, res: Response) => {
  res.json(storage.getProfile());
});

app.put('/api/profile', (req: Request, res: Response) => {
  const updated = storage.updateProfile(req.body);
  res.json(updated);
});

// Dashboard Statistics
app.get('/api/stats', (_req: Request, res: Response) => {
  res.json(storage.getStats());
});

// Students List & Filtering
app.get('/api/students', (req: Request, res: Response) => {
  const { search, kelas, gender, status } = req.query;
  const students = storage.getStudents({
    search: typeof search === 'string' ? search : undefined,
    kelas: typeof kelas === 'string' ? kelas : undefined,
    gender: typeof gender === 'string' ? gender : undefined,
    status: typeof status === 'string' ? status : undefined
  });
  res.json(students);
});

// Get Student by ID / NIS / NISN
app.get('/api/students/:id', (req: Request, res: Response) => {
  const student = storage.getStudentById(req.params.id);
  if (!student) {
    res.status(404).json({ error: 'Data murid tidak ditemukan' });
    return;
  }
  res.json(student);
});

// Create Student
app.post('/api/students', (req: Request, res: Response) => {
  try {
    const student = storage.createStudent(req.body);
    res.status(201).json(student);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Gagal menambahkan data murid' });
  }
});

// Update Student
app.put('/api/students/:id', (req: Request, res: Response) => {
  try {
    const updated = storage.updateStudent(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Data murid tidak ditemukan' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Gagal memperbarui data murid' });
  }
});

// Delete Student
app.delete('/api/students/:id', (req: Request, res: Response) => {
  const success = storage.deleteStudent(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Data murid tidak ditemukan' });
    return;
  }
  res.json({ success: true, message: 'Data murid berhasil dihapus' });
});

// Bulk Import
app.post('/api/students/bulk', (req: Request, res: Response) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students)) {
      res.status(400).json({ error: 'Format data tidak valid, harus berupa array murid' });
      return;
    }
    const result = storage.bulkImport(students);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Gagal mengimpor data' });
  }
});

// Attendance Endpoints
app.get('/api/attendance', (req: Request, res: Response) => {
  const tanggal = (req.query.tanggal as string) || new Date().toISOString().split('T')[0];
  const kelas = (req.query.kelas as string) || 'Semua';
  const records = storage.getAttendance(tanggal, kelas);
  res.json(records);
});

app.post('/api/attendance', (req: Request, res: Response) => {
  try {
    const record = storage.recordAttendance(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Gagal mencatat presensi' });
  }
});

// SPP Payment Recording
app.post('/api/finance/payment', (req: Request, res: Response) => {
  try {
    const { studentId, bulan, jumlah, metode, keterangan } = req.body;
    if (!studentId || !bulan || !jumlah) {
      res.status(400).json({ error: 'studentId, bulan, dan jumlah wajib diisi' });
      return;
    }
    const student = storage.recordPayment(studentId, bulan, Number(jumlah), metode || 'Tunai', keterangan);
    if (!student) {
      res.status(404).json({ error: 'Murid tidak ditemukan' });
      return;
    }
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Gagal mencatat pembayaran' });
  }
});

// Export CSV
app.get('/api/export/csv', (_req: Request, res: Response) => {
  const students = storage.getStudents();
  const headers = [
    'NIS', 'NISN', 'NIK', 'Nama Lengkap', 'Panggilan', 'Jenis Kelamin', 'Kelas',
    'Tempat Lahir', 'Tanggal Lahir', 'Wali Kelas', 'Nama Ayah', 'Nama Ibu',
    'No Telepon', 'Alamat', 'Penerima KIP/PIP', 'Hafalan Tahfidz', 'Status SPP', 'Status'
  ];

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = students.map(s => [
    escapeCsv(s.nis),
    escapeCsv(s.nisn),
    escapeCsv(s.nik),
    escapeCsv(s.nama),
    escapeCsv(s.namaPanggilan),
    escapeCsv(s.jenisKelamin),
    escapeCsv(s.kelas),
    escapeCsv(s.tempatLahir),
    escapeCsv(s.tanggalLahir),
    escapeCsv(s.waliKelas),
    escapeCsv(s.orangTua.namaAyah),
    escapeCsv(s.orangTua.namaIbu),
    escapeCsv(s.orangTua.telepon),
    escapeCsv(`${s.alamat.jalan}, RT ${s.alamat.rtRw}, ${s.alamat.desaKelurahan}, ${s.alamat.kecamatan}, ${s.alamat.kabupatenKota}`),
    escapeCsv(s.penerimaPIP ? 'Ya (KIP)' : 'Tidak'),
    escapeCsv(`${s.tahfidz.juzTerakhir} (${s.tahfidz.suratTerakhir}) - ${s.tahfidz.predikat}`),
    escapeCsv(s.keuangan.statusSPP),
    escapeCsv(s.status)
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="Data_Murid_MI_Nurul_Iman_${new Date().toISOString().split('T')[0]}.csv"`);
  res.send(csvContent);
});

// Vite integration / Static serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server MI Nurul Iman running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
