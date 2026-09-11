import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BedDouble, CheckCircle2, CreditCard, Download, IndianRupee, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import { api } from '../api';

const feeItems = [
  ['Room Rent (Shared)', 22000],
  ['Mess Charges', 14000],
  ['Maintenance & Security', 2000],
  ['Security Deposit', 5000]
];

function StatusChip({ status }) {
  const styles = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-red-100 text-red-800',
    PARTIAL: 'bg-orange-100 text-orange-800'
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${styles[status] || styles.PENDING}`}>{status}</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [roomsData, setRoomsData] = useState({ blocks: [], rooms: [], floors: [] });
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('Ground');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState('');
  const [qr, setQr] = useState('');
  const [message, setMessage] = useState('');
  const idCardRef = useRef(null);

  const totalFee = useMemo(() => feeItems.reduce((sum, item) => sum + item[1], 0), []);

  async function loadDashboard() {
    try {
      const dashboard = await api.dashboard();
      setData(dashboard);
    } catch {
      navigate('/login');
    }
  }

  async function loadRooms(block = selectedBlock, floor = selectedFloor) {
    const result = await api.rooms(block, floor);
    setRoomsData(result);
    if (!block && result.blocks[0]) setSelectedBlock(result.blocks[0].block_id);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (data?.student) loadRooms(selectedBlock, selectedFloor);
  }, [data?.student?.usn, selectedBlock, selectedFloor]);

  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });
    socket.on('rooms:update', () => {
      if (data?.student) loadRooms();
    });
    const poll = setInterval(() => data?.student && loadRooms(), 10000);
    return () => {
      socket.disconnect();
      clearInterval(poll);
    };
  }, [data?.student, selectedBlock, selectedFloor]);

  useEffect(() => {
    if (!data?.student) return;
    const value = `${data.student.usn}|${data.block?.block_name || 'Not allotted'}|${data.room?.room_number || 'NA'}|${data.bed?.bed_label || 'NA'}|2025-26`;
    QRCode.toDataURL(value).then(setQr);
  }, [data]);

  async function payNow() {
    setMessage('');
    await api.createOrder(totalFee);
    const paymentId = `pay_demo_${data.student.usn}_${Date.now()}`;
    const result = await api.confirmPayment({ razorpay_payment_id: paymentId, amount: totalFee });
    setMessage(result.message);
    await loadDashboard();
  }

  async function bookBed() {
    const result = await api.bookBed(selectedBed);
    setMessage(result.message);
    setSelectedRoom(null);
    setSelectedBed('');
    setData(result.dashboard);
    await loadRooms();
  }

  async function retainRoom() {
    const result = await api.retainRoom();
    setMessage(result.message);
    setData(result.dashboard);
    await loadRooms();
  }

  async function downloadCard() {
    const canvas = await html2canvas(idCardRef.current, { scale: 2, backgroundColor: '#ffffff' });
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${data.student.usn}-hostel-id-card.pdf`);
  }

  if (!data) return <section className="section min-h-[60vh]"><p className="font-semibold text-sit-navy">Loading dashboard...</p></section>;

  const resident = Boolean(data.allotment);
  const hasCurrentYearRoom = data.allotment?.academic_year === '2025-26';
  const balance = Number(data.fee?.total_amount || totalFee) - Number(data.fee?.paid_amount || 0);

  return (
    <section className="section space-y-8">
      {message && <div className="rounded-md border border-green-200 bg-green-50 p-4 font-semibold text-green-800">{message}</div>}

      <div className="rounded-md bg-sit-navy p-6 text-white shadow-soft">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-white text-2xl font-extrabold text-sit-navy">{data.student.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
            <div>
              <h1 className="text-2xl font-extrabold">{data.student.name}</h1>
              <p className="text-white/80">{data.student.usn} | {data.student.branch}</p>
              <p className="text-sm text-white/75">Year {data.student.year} | Semester {data.student.semester}</p>
            </div>
          </div>
          <span className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-extrabold ${resident ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {resident ? '✅ Hostel Resident' : '❌ Not Enrolled in Hostel'}
          </span>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div ref={idCardRef} className="overflow-hidden rounded-md border-2 border-sit-navy bg-white shadow-soft">
            <div className="flex items-center justify-between bg-sit-navy px-5 py-4 text-white">
              <div className="flex items-center gap-3"><img src="/sit-logo.jpg" alt="SIT logo" className="h-12 w-12 rounded-full bg-white object-contain" /><span className="font-bold">Siddaganga Institute of Technology</span></div>
              <p className="text-sm font-bold text-sit-gold">Hostel Identity Card 2024-25</p>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[120px_1fr_120px]">
              <div className="flex h-32 w-28 items-center justify-center rounded-md bg-sit-mist text-3xl font-extrabold text-sit-navy">{data.student.name[0]}</div>
              <div className="grid gap-2 text-sm">
                <p><b>Name:</b> {data.student.name}</p>
                <p><b>USN:</b> {data.student.usn}</p>
                <p><b>Branch/Year:</b> {data.student.branch} / Year {data.student.year}</p>
                <p><b>Block:</b> {data.block?.block_name || 'Pending allotment'}</p>
                <p><b>Room/Bed:</b> {data.room?.room_number || 'NA'} / {data.bed?.bed_label || 'NA'}</p>
                <p><b>Mess Type:</b> Veg</p>
                <p><b>Warden:</b> {data.warden?.name || 'Hostel Office'} | {data.warden?.contact || '0816-2214040'}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                {qr && <img src={qr} alt="Student QR code" className="h-28 w-28" />}
                <span className="text-center text-xs font-bold text-sit-navy">Scan at Gate</span>
              </div>
            </div>
            <div className="bg-sit-mist px-5 py-3 text-center text-xs font-bold text-sit-navy">Valid for Academic Year 2025-26 | Guard verification: /verify?usn={data.student.usn}</div>
          </div>
          <button className="btn-primary mt-4" onClick={downloadCard}><Download size={17} /> Download ID Card as PDF</button>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold text-sit-navy">Fee Status</h2><StatusChip status={data.fee?.status || 'PENDING'} /></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric label="Current semester" value={`Sem ${data.fee?.semester || 7}`} icon={Users} />
            <Metric label="Total due" value={`₹${Number(data.fee?.total_amount || totalFee).toLocaleString('en-IN')}`} icon={IndianRupee} />
            <Metric label="Amount paid" value={`₹${Number(data.fee?.paid_amount || 0).toLocaleString('en-IN')}`} icon={CheckCircle2} />
            <Metric label="Balance" value={`₹${balance.toLocaleString('en-IN')}`} icon={CreditCard} />
          </div>
          <button className="btn-primary mt-5 w-full" onClick={payNow}>{resident ? 'Pay Now' : 'Pay Hostel Fee for 2025-26'}</button>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">Date</th><th>Amount</th><th>Razorpay Ref</th><th>Status</th></tr></thead>
              <tbody>
                {data.transactions.map((txn) => (
                  <tr key={txn.txn_id} className="border-t border-slate-100"><td className="py-2">{new Date(txn.timestamp).toLocaleDateString()}</td><td>₹{Number(txn.amount).toLocaleString('en-IN')}</td><td>{txn.razorpay_payment_id}</td><td>{txn.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-sit-navy">Room Details</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p><b>Block:</b> {data.block?.block_name || 'Not allotted'}</p>
            <p><b>Floor:</b> {data.room?.floor || 'NA'}</p>
            <p><b>Room:</b> {data.room?.room_number || 'NA'} | <b>Bed:</b> {data.bed?.bed_label || 'NA'}</p>
            <p><b>Roommates:</b> Priya, Kavya</p>
            <p><b>Warden:</b> {data.warden?.contact || '0816-2214040'}</p>
            <p><b>Mess:</b> Breakfast 7-9am, Lunch 12-2pm, Snacks 5-6pm, Dinner 7-9pm</p>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-extrabold text-sit-navy">Room Selection 2025-26</h2>
            <button className="btn-secondary" onClick={() => loadRooms()}><RefreshCw size={16} /> Refresh</button>
          </div>
          {data.fee?.status !== 'PAID' ? (
            <p className="mt-4 rounded-md bg-orange-50 p-4 text-sm font-semibold text-orange-800">Complete hostel fee payment to unlock first-come-first-served room selection.</p>
          ) : (
            <>
              {resident && !hasCurrentYearRoom && (
                <div className="mt-4 rounded-md border border-sit-gold bg-[#fff8e8] p-4">
                  <p className="font-bold text-sit-navy">Do you want to retain room {data.room?.room_number} or select a new one?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="btn-primary" onClick={retainRoom}>Retain Current Room</button>
                    <span className="inline-flex items-center text-sm font-semibold text-slate-600">Select below for a new room</span>
                  </div>
                </div>
              )}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <select className="input" value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)}>
                  {roomsData.blocks.map((block) => <option key={block.block_id} value={block.block_id}>{block.block_name}</option>)}
                </select>
                <select className="input" value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
                  {roomsData.floors.map((floor) => <option key={floor}>{floor}</option>)}
                </select>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {roomsData.rooms.map((room) => <RoomCard key={room.room_id} room={room} onSelect={() => setSelectedRoom(room)} />)}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-soft">
            <h3 className="text-xl font-extrabold text-sit-navy">Select Bed: {selectedRoom.room_number}</h3>
            <div className="mt-5 grid gap-3">
              {selectedRoom.beds.map((bed) => (
                <label key={bed.bed_id} className={`flex items-center justify-between rounded-md border p-3 ${bed.status === 'available' ? 'border-slate-200' : 'border-slate-200 bg-slate-100 text-slate-400'}`}>
                  <span className="font-semibold">Bed {bed.bed_label}</span>
                  <input type="radio" disabled={bed.status !== 'available'} checked={selectedBed === String(bed.bed_id)} onChange={() => setSelectedBed(String(bed.bed_id))} />
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="btn-primary flex-1" disabled={!selectedBed} onClick={bookBed}>Book This Room & Bed</button>
              <button className="btn-secondary" onClick={() => setSelectedRoom(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-md bg-sit-mist p-4">
      <Icon size={18} className="text-sit-gold" />
      <p className="mt-2 text-xs font-semibold text-slate-500">{label}</p>
      <p className="font-extrabold text-sit-navy">{value}</p>
    </div>
  );
}

function RoomCard({ room, onSelect }) {
  const color = room.status === 'available' ? 'border-green-200 bg-green-50' : room.status === 'last' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50';
  return (
    <button disabled={room.availableBeds === 0} onClick={onSelect} className={`rounded-md border p-4 text-left transition hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${color}`}>
      <div className="flex items-center justify-between"><p className="font-extrabold text-sit-navy">{room.room_number}</p><BedDouble size={18} /></div>
      <p className="mt-2 text-sm text-slate-700">{room.room_type}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{room.availableBeds} of {room.capacity} beds free</p>
      <p className="mt-2 text-xs font-extrabold uppercase">{room.availableBeds === 0 ? 'Full' : room.availableBeds === 1 ? '1 bed left' : 'Available'}</p>
    </button>
  );
}
