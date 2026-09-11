import bcrypt from 'bcryptjs';

const now = new Date();
const academicYear = '2025-26';

const wardens = [
  { warden_id: 1, name: 'Dr. H. R. Prakash', contact: '0816-2214040', email: 'chiefwarden@sit.ac.in', block_id: 1 },
  { warden_id: 2, name: 'Prof. S. R. Manjunath', contact: '0816-2214026', email: 'basaveswara1@sit.ac.in', block_id: 2 },
  { warden_id: 3, name: 'Prof. N. Kavitha', contact: '0816-2214026', email: 'akkamahadevi@sit.ac.in', block_id: 5 },
  { warden_id: 4, name: 'Prof. K. R. Shashidhar', contact: '0816-2214026', email: 'lbt@sit.ac.in', block_id: 4 }
];

const hostelBlocks = [
  { block_id: 1, block_name: 'Mahatma Gandhi Block', gender: 'male', total_rooms: 120, warden_id: 1, public_label: 'Girls Hostel' },
  { block_id: 2, block_name: 'Basaveswara Block I', gender: 'male', total_rooms: 180, warden_id: 2 },
  { block_id: 3, block_name: 'Basaveswara Block II', gender: 'male', total_rooms: 160, warden_id: 2 },
  { block_id: 4, block_name: 'Lal Bahadur Shastri Block', gender: 'male', total_rooms: 150, warden_id: 4 },
  { block_id: 5, block_name: 'Akkamahadevi Ladies Hostel', gender: 'female', total_rooms: 120, warden_id: 3 },
  { block_id: 6, block_name: 'T.N. Kempahonnaiah Ladies Hostel', gender: 'female', total_rooms: 100, warden_id: 3 }
];

const students = [
  {
    usn: '1SI21CS089',
    name: 'Ananya Rao',
    dob_hash: bcrypt.hashSync('14/08/2003', 10),
    branch: 'Computer Science and Engineering',
    year: 3,
    semester: 6,
    gender: 'female',
    photo_url: '',
    email: 'ananya.rao@example.com',
    phone: '9876543210',
    created_at: now
  },
  {
    usn: '1SI21EC045',
    name: 'Rohan Kulkarni',
    dob_hash: bcrypt.hashSync('22/01/2003', 10),
    branch: 'Electronics and Communication',
    year: 3,
    semester: 6,
    gender: 'male',
    photo_url: '',
    email: 'rohan.k@example.com',
    phone: '9845012345',
    created_at: now
  }
];

const rooms = [];
const beds = [];
let roomId = 1;
let bedId = 1;
const floorNames = ['Ground', '1st', '2nd', '3rd'];
for (const block of hostelBlocks) {
  for (let floorIndex = 0; floorIndex < 4; floorIndex += 1) {
    for (let index = 1; index <= 8; index += 1) {
      const capacity = index % 3 === 0 ? 2 : 3;
      const prefix = block.block_name.includes('Akkamahadevi') ? 'A' : block.block_name.includes('Kempahonnaiah') ? 'K' : block.block_name.split(' ')[0][0];
      const room_number = `${prefix}-${floorIndex + 1}${String(index).padStart(2, '0')}`;
      rooms.push({
        room_id: roomId,
        block_id: block.block_id,
        room_number,
        floor: floorNames[floorIndex],
        capacity,
        room_type: `${capacity}-sharing`
      });
      for (let b = 0; b < capacity; b += 1) {
        beds.push({
          bed_id: bedId,
          room_id: roomId,
          bed_label: String.fromCharCode(65 + b),
          status: index === 8 && b === 0 ? 'reserved' : 'available'
        });
        bedId += 1;
      }
      roomId += 1;
    }
  }
}

beds.find((bed) => bed.room_id === 2 && bed.bed_label === 'A').status = 'booked';
beds.find((bed) => bed.room_id === 2 && bed.bed_label === 'B').status = 'booked';
beds.find((bed) => bed.room_id === 130 && bed.bed_label === 'A').status = 'booked';

const allotments = [
  { allotment_id: 1, usn: '1SI21EC045', bed_id: beds.find((bed) => bed.room_id === 2 && bed.bed_label === 'A').bed_id, academic_year: '2024-25', allotment_date: now, status: 'active' },
  { allotment_id: 2, usn: '1SI21CS089', bed_id: beds.find((bed) => bed.room_id === 130 && bed.bed_label === 'A').bed_id, academic_year: '2024-25', allotment_date: now, status: 'active' }
];

const feeRecords = [
  { fee_id: 1, usn: '1SI21CS089', academic_year: academicYear, semester: 7, total_amount: 39000, paid_amount: 39000, due_date: '2026-06-15', status: 'PAID' },
  { fee_id: 2, usn: '1SI21EC045', academic_year: academicYear, semester: 7, total_amount: 39000, paid_amount: 18000, due_date: '2026-06-15', status: 'PARTIAL' }
];

const transactions = [
  { txn_id: 1, usn: '1SI21CS089', razorpay_payment_id: 'pay_demo_1SI21CS089', amount: 39000, timestamp: now, status: 'PAID', receipt_url: '' },
  { txn_id: 2, usn: '1SI21EC045', razorpay_payment_id: 'offline_office_0045', amount: 18000, timestamp: now, status: 'PARTIAL', receipt_url: '' }
];

const admins = [
  { admin_id: 1, username: 'admin', password_hash: bcrypt.hashSync('admin@SIT2026', 10), role: 'super_admin' }
];

const bookingControls = [
  { id: 1, academic_year: academicYear, opens_at: '2026-05-01T00:00:00.000Z', closes_at: '2026-08-01T00:00:00.000Z', is_open: true }
];

export const store = {
  students,
  hostelBlocks,
  wardens,
  rooms,
  beds,
  allotments,
  feeRecords,
  transactions,
  admins,
  bookingControls,
  counters: {
    allotment: 3,
    transaction: 3,
    fee: 3
  }
};

export function findStudentDashboard(usn) {
  const student = store.students.find((item) => item.usn === usn);
  if (!student) return null;
  const allotment = [...store.allotments].reverse().find((item) => item.usn === usn && item.status === 'active');
  const bed = allotment ? store.beds.find((item) => item.bed_id === allotment.bed_id) : null;
  const room = bed ? store.rooms.find((item) => item.room_id === bed.room_id) : null;
  const block = room ? store.hostelBlocks.find((item) => item.block_id === room.block_id) : null;
  const warden = block ? store.wardens.find((item) => item.warden_id === block.warden_id) : null;
  const fee = [...store.feeRecords].reverse().find((item) => item.usn === usn);
  return {
    student: { ...student, dob_hash: undefined },
    allotment,
    bed,
    room,
    block,
    warden,
    fee,
    transactions: store.transactions.filter((item) => item.usn === usn)
  };
}
