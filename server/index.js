import 'dotenv/config';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';
import { Server } from 'socket.io';
import { store, findStudentDashboard } from './data/store.js';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const jwtSecret = process.env.JWT_SECRET || 'dev-sit-hostel-secret';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const io = new Server(server, {
  cors: { origin: clientUrl, credentials: true }
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret'
});

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

const publicStudent = (student) => {
  if (!student) return null;
  const { dob_hash, ...safe } = student;
  return safe;
};

const signToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
const setAuthCookie = (res, token) => {
  res.cookie('sit_hostel_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 2 * 60 * 60 * 1000
  });
};

function requireStudent(req, res, next) {
  const token = req.cookies.sit_hostel_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.type !== 'student') return res.status(403).json({ message: 'Student access required' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired' });
  }
}

function requireAdmin(req, res, next) {
  const token = req.cookies.sit_admin_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Admin authentication required' });
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.type !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Admin session expired' });
  }
}

function roomPayload(blockId, floor) {
  return store.rooms
    .filter((room) => (!blockId || room.block_id === Number(blockId)) && (!floor || room.floor === floor))
    .map((room) => {
      const roomBeds = store.beds.filter((bed) => bed.room_id === room.room_id);
      const free = roomBeds.filter((bed) => bed.status === 'available').length;
      return {
        ...room,
        beds: roomBeds,
        availableBeds: free,
        status: free === 0 ? 'full' : free === 1 ? 'last' : 'available'
      };
    });
}

function assertBookingAllowed(usn, bedId) {
  const dashboard = findStudentDashboard(usn);
  const fee = dashboard?.fee;
  if (!fee || fee.status !== 'PAID') return 'Booking window opens only after payment is confirmed.';
  const control = store.bookingControls.find((item) => item.academic_year === '2025-26');
  if (!control?.is_open) return 'Booking window is currently closed.';
  const existing = store.allotments.find((item) => item.usn === usn && item.academic_year === '2025-26' && item.status === 'active');
  if (existing) return 'A student can only book one bed.';
  const bed = store.beds.find((item) => item.bed_id === Number(bedId));
  if (!bed || bed.status !== 'available') return 'Selected bed is no longer available.';
  const room = store.rooms.find((item) => item.room_id === bed.room_id);
  const block = store.hostelBlocks.find((item) => item.block_id === room.block_id);
  if (block.gender !== dashboard.student.gender) return 'Students can only book in the correct hostel.';
  return null;
}

async function sendBookingMail(dashboard) {
  if (!process.env.SMTP_USER || !dashboard.student.email) return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'SIT Hostel Office <hostel@sit.ac.in>',
    to: dashboard.student.email,
    subject: 'SIT Hostel Room Booking Confirmation',
    html: `<p>Dear ${dashboard.student.name},</p><p>Your room ${dashboard.room.room_number}, Bed ${dashboard.bed.bed_label} in ${dashboard.block.block_name} is confirmed for 2025-26.</p><p>Regards,<br/>SIT Hostel Office</p>`
  });
}

app.get('/api/public/hostel-info', (_req, res) => {
  res.json({
    stats: { boysHostels: 4, girlsHostels: 2, capacity: 2100, plinthAreaSqm: 30021 },
    blocks: store.hostelBlocks.map((block) => ({ ...block, warden: store.wardens.find((item) => item.warden_id === block.warden_id) })),
    contacts: {
      address: 'Dr. Sree Sree Sivakumara Swamiji Road, Tumakuru - 572 103, Karnataka',
      adminOffice: '0816-2214026',
      chiefWarden: '0816-2214040'
    }
  });
});

app.post('/api/auth/student/login', async (req, res) => {
  const { usn, dob } = req.body;
  const student = store.students.find((item) => item.usn.toUpperCase() === String(usn || '').toUpperCase());
  if (!student || !(await bcrypt.compare(dob || '', student.dob_hash))) {
    return res.status(401).json({ message: 'Invalid USN or Date of Birth' });
  }
  const token = signToken({ type: 'student', usn: student.usn });
  setAuthCookie(res, token);
  res.json({ student: publicStudent(student), token });
});

app.post('/api/auth/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = store.admins.find((item) => item.username === username);
  if (!admin || !(await bcrypt.compare(password || '', admin.password_hash))) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = signToken({ type: 'admin', username: admin.username, role: admin.role });
  res.cookie('sit_admin_token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 2 * 60 * 60 * 1000 });
  res.json({ admin: { username: admin.username, role: admin.role }, token });
});

app.get('/api/student/dashboard', requireStudent, (req, res) => {
  const dashboard = findStudentDashboard(req.user.usn);
  res.json(dashboard);
});

app.get('/api/rooms', requireStudent, (req, res) => {
  const dashboard = findStudentDashboard(req.user.usn);
  const blocks = store.hostelBlocks.filter((block) => block.gender === dashboard.student.gender);
  res.json({ blocks, rooms: roomPayload(req.query.blockId, req.query.floor), floors: ['Ground', '1st', '2nd', '3rd'] });
});

app.post('/api/payments/create-order', requireStudent, async (req, res) => {
  const amount = Number(req.body.amount || 39000);
  if (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== 'demo_secret') {
    const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: `sit_${req.user.usn}_${Date.now()}` });
    return res.json(order);
  }
  res.json({ id: `order_demo_${Date.now()}`, amount: amount * 100, currency: 'INR', demo: true });
});

app.post('/api/payments/confirm', requireStudent, (req, res) => {
  const amount = Number(req.body.amount || 39000);
  const txn = {
    txn_id: store.counters.transaction++,
    usn: req.user.usn,
    razorpay_payment_id: req.body.razorpay_payment_id || `pay_demo_${Date.now()}`,
    amount,
    timestamp: new Date(),
    status: 'PAID',
    receipt_url: ''
  };
  store.transactions.push(txn);
  const fee = store.feeRecords.find((item) => item.usn === req.user.usn && item.academic_year === '2025-26');
  if (fee) {
    fee.paid_amount = amount;
    fee.status = 'PAID';
  } else {
    store.feeRecords.push({ fee_id: store.counters.fee++, usn: req.user.usn, academic_year: '2025-26', semester: 7, total_amount: amount, paid_amount: amount, due_date: '2026-06-15', status: 'PAID' });
  }
  res.json({ message: 'Payment Successful! You can now select your room.', transaction: txn });
});

app.post('/api/bookings', requireStudent, async (req, res) => {
  const error = assertBookingAllowed(req.user.usn, req.body.bedId);
  if (error) return res.status(409).json({ message: error });
  const bed = store.beds.find((item) => item.bed_id === Number(req.body.bedId));
  bed.status = 'booked';
  store.allotments.push({
    allotment_id: store.counters.allotment++,
    usn: req.user.usn,
    bed_id: bed.bed_id,
    academic_year: '2025-26',
    allotment_date: new Date(),
    status: 'active'
  });
  const dashboard = findStudentDashboard(req.user.usn);
  io.emit('rooms:update', { blockId: dashboard.block.block_id, floor: dashboard.room.floor });
  sendBookingMail(dashboard).catch((err) => console.warn('Email skipped:', err.message));
  res.json({ message: `Room ${dashboard.room.room_number}, Bed ${dashboard.bed.bed_label} confirmed for 2025-26. Your digital ID card has been updated.`, dashboard });
});

app.post('/api/bookings/retain', requireStudent, async (req, res) => {
  const dashboard = findStudentDashboard(req.user.usn);
  const fee = dashboard?.fee;
  if (!fee || fee.status !== 'PAID') return res.status(409).json({ message: 'Booking window opens only after payment is confirmed.' });
  const existing2025 = store.allotments.find((item) => item.usn === req.user.usn && item.academic_year === '2025-26' && item.status === 'active');
  if (existing2025) return res.status(409).json({ message: 'A student can only book one bed.' });
  if (!dashboard?.bed) return res.status(409).json({ message: 'No previous room is available to retain.' });
  const currentBed = store.beds.find((item) => item.bed_id === dashboard.bed.bed_id);
  currentBed.status = 'booked';
  store.allotments.push({
    allotment_id: store.counters.allotment++,
    usn: req.user.usn,
    bed_id: currentBed.bed_id,
    academic_year: '2025-26',
    allotment_date: new Date(),
    status: 'active'
  });
  const updated = findStudentDashboard(req.user.usn);
  io.emit('rooms:update', { blockId: updated.block.block_id, floor: updated.room.floor });
  sendBookingMail(updated).catch((err) => console.warn('Email skipped:', err.message));
  res.json({ message: `Room ${updated.room.room_number}, Bed ${updated.bed.bed_label} retained for 2025-26. Your digital ID card has been updated.`, dashboard: updated });
});

app.get('/api/verify', (req, res) => {
  const dashboard = findStudentDashboard(req.query.usn);
  if (!dashboard?.allotment) return res.json({ valid: false, message: 'NOT A RESIDENT', usn: req.query.usn });
  res.json({ valid: true, message: 'VALID RESIDENT', dashboard });
});

app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
  const totalBeds = store.beds.length;
  const booked = store.beds.filter((bed) => bed.status === 'booked').length;
  const paid = store.transactions.filter((txn) => txn.status === 'PAID').reduce((sum, txn) => sum + Number(txn.amount), 0);
  res.json({
    totalResidents: store.allotments.filter((item) => item.status === 'active').length,
    beds: { total: totalBeds, filled: booked, empty: totalBeds - booked },
    feeCollection: paid,
    blockOccupancy: store.hostelBlocks.map((block) => {
      const blockRooms = store.rooms.filter((room) => room.block_id === block.block_id);
      const blockBeds = store.beds.filter((bed) => blockRooms.some((room) => room.room_id === bed.room_id));
      return { block: block.block_name, filled: blockBeds.filter((bed) => bed.status === 'booked').length, total: blockBeds.length };
    }),
    payments: store.transactions,
    bookingLog: store.allotments
  });
});

app.get('/api/admin/students', requireAdmin, (_req, res) => res.json(store.students.map(publicStudent)));

app.post('/api/admin/students', requireAdmin, async (req, res) => {
  const student = { ...req.body, dob_hash: await bcrypt.hash(req.body.dob || '01/01/2005', 10), created_at: new Date() };
  delete student.dob;
  store.students.push(student);
  res.status(201).json(publicStudent(student));
});

app.patch('/api/admin/rooms/:roomId', requireAdmin, (req, res) => {
  const beds = store.beds.filter((bed) => bed.room_id === Number(req.params.roomId));
  beds.forEach((bed) => {
    if (bed.status !== 'booked') bed.status = req.body.status || 'reserved';
  });
  io.emit('rooms:update', {});
  res.json({ message: 'Room status updated', beds });
});

app.patch('/api/admin/booking-control', requireAdmin, (req, res) => {
  const control = store.bookingControls.find((item) => item.academic_year === (req.body.academic_year || '2025-26'));
  Object.assign(control, req.body);
  res.json(control);
});

app.use(express.static(distPath));

app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

io.on('connection', (socket) => {
  socket.emit('rooms:update', {});
});

server.listen(port, '127.0.0.1', () => {
  console.log(`SIT Hostel API running on http://127.0.0.1:${port}`);
});
