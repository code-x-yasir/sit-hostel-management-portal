import { useEffect, useState } from 'react';
import { api } from '../api';
import { BarChart3, BedDouble, FileDown, IndianRupee, ShieldCheck, Upload, Users } from 'lucide-react';

export default function Admin() {
  const [login, setLogin] = useState({ username: 'admin', password: 'admin@SIT2026' });
  const [authed, setAuthed] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await api.adminLogin(login);
      setAuthed(true);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (!authed) return;
    api.adminDashboard().then(setDashboard);
    api.adminStudents().then(setStudents);
  }, [authed]);

  if (!authed) {
    return (
      <section className="section flex min-h-[70vh] items-center justify-center">
        <form onSubmit={submit} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wide text-sit-gold">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-extrabold text-sit-navy">Secure Login</h1>
          <label className="mt-6 block text-sm font-semibold">Username</label>
          <input className="input mt-2" value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} />
          <label className="mt-4 block text-sm font-semibold">Password</label>
          <input type="password" className="input mt-2" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button className="btn-primary mt-6 w-full">Login</button>
        </form>
      </section>
    );
  }

  if (!dashboard) return <section className="section"><p className="font-semibold text-sit-navy">Loading admin dashboard...</p></section>;

  return (
    <section className="section space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-sit-gold">Hostel Administration</p>
          <h1 className="mt-2 text-3xl font-extrabold text-sit-navy">Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary"><Upload size={16} /> Upload CSV</button>
          <button className="btn-primary"><FileDown size={16} /> Export Reports</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <AdminMetric label="Total residents" value={dashboard.totalResidents} icon={Users} />
        <AdminMetric label="Beds filled" value={dashboard.beds.filled} icon={BedDouble} />
        <AdminMetric label="Beds empty" value={dashboard.beds.empty} icon={ShieldCheck} />
        <AdminMetric label="Fee collection" value={`₹${Number(dashboard.feeCollection).toLocaleString('en-IN')}`} icon={IndianRupee} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-sit-navy"><BarChart3 size={20} /> Beds Filled/Empty Per Block</h2>
          <div className="mt-5 space-y-4">
            {dashboard.blockOccupancy.map((item) => {
              const pct = Math.round((item.filled / item.total) * 100);
              return (
                <div key={item.block}>
                  <div className="flex justify-between text-sm"><span className="font-semibold">{item.block}</span><span>{item.filled}/{item.total}</span></div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-sit-gold" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-sit-navy">Student Management</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">USN</th><th>Name</th><th>Branch</th><th>Gender</th></tr></thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.usn} className="border-t border-slate-100"><td className="py-2 font-bold text-sit-navy">{student.usn}</td><td>{student.name}</td><td>{student.branch}</td><td className="capitalize">{student.gender}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Booking Control">
          <p className="text-sm text-slate-700">Academic year 2025-26 booking window is open. Admins can set open/close dates, watch the real-time selection log, and reserve maintenance rooms from the room management API.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">USN</th><th>Bed ID</th><th>Academic Year</th><th>Status</th></tr></thead>
              <tbody>{dashboard.bookingLog.map((row) => <tr key={row.allotment_id} className="border-t border-slate-100"><td className="py-2">{row.usn}</td><td>{row.bed_id}</td><td>{row.academic_year}</td><td>{row.status}</td></tr>)}</tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Fee Management">
          <p className="text-sm text-slate-700">View Razorpay and offline payments, manually mark office payments as paid through the API, and generate receipts for student records.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">USN</th><th>Amount</th><th>Transaction</th><th>Status</th></tr></thead>
              <tbody>{dashboard.payments.map((row) => <tr key={row.txn_id} className="border-t border-slate-100"><td className="py-2">{row.usn}</td><td>₹{Number(row.amount).toLocaleString('en-IN')}</td><td>{row.razorpay_payment_id}</td><td>{row.status}</td></tr>)}</tbody>
            </table>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function AdminMetric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-md bg-sit-navy p-5 text-white shadow-sm">
      <Icon className="text-sit-gold" size={22} />
      <p className="mt-4 text-sm text-white/70">{label}</p>
      <p className="text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-extrabold text-sit-navy">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
