import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ usn: '1SI21CS089', dob: '14/08/2003' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.studentLogin(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid USN or Date of Birth');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section flex min-h-[70vh] items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-sit-gold">Student Login</p>
        <h1 className="mt-2 text-3xl font-extrabold text-sit-navy">Hostel Portal Access</h1>
        <label className="mt-6 block text-sm font-semibold text-slate-700">USN</label>
        <input className="input mt-2 uppercase" value={form.usn} onChange={(e) => setForm({ ...form, usn: e.target.value })} placeholder="1SI21CS089" />
        <label className="mt-4 block text-sm font-semibold text-slate-700">Date of Birth</label>
        <input className="input mt-2" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} placeholder="DD/MM/YYYY" />
        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
        <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        <p className="mt-4 text-center text-sm text-slate-600">Forgot credentials? Contact hostel office</p>
      </form>
    </section>
  );
}
