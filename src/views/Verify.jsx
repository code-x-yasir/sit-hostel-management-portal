import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Verify() {
  const [params] = useSearchParams();
  const initialUsn = params.get('usn') || '';
  const [usn, setUsn] = useState(initialUsn);
  const [result, setResult] = useState(null);

  async function verify(value = usn) {
    const data = await api.verify(value);
    setResult(data);
  }

  useEffect(() => {
    if (initialUsn) verify(initialUsn);
  }, [initialUsn]);

  return (
    <section className="section flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-md border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-sit-gold">Gate Verification</p>
        <h1 className="mt-2 text-3xl font-extrabold text-sit-navy">QR Resident Check</h1>
        <div className="mt-6 flex gap-3">
          <input className="input uppercase" value={usn} onChange={(e) => setUsn(e.target.value)} placeholder="1SI21CS089" />
          <button className="btn-primary" onClick={() => verify()}>Verify</button>
        </div>
        {result && (
          <div className={`mt-6 rounded-md p-5 ${result.valid ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
            <div className="flex items-center gap-3">
              {result.valid ? <ShieldCheck size={34} /> : <ShieldAlert size={34} />}
              <div>
                <p className="text-2xl font-extrabold">{result.valid ? 'VALID RESIDENT ✅' : 'NOT A RESIDENT ❌'}</p>
                <p className="text-sm font-semibold">{result.usn || result.dashboard?.student?.usn}</p>
              </div>
            </div>
            {result.valid && (
              <div className="mt-5 grid gap-2 text-sm">
                <p><b>Name:</b> {result.dashboard.student.name}</p>
                <p><b>Room:</b> {result.dashboard.block.block_name}, {result.dashboard.room.room_number}, Bed {result.dashboard.bed.bed_label}</p>
                <p><b>Warden:</b> {result.dashboard.warden.name} | {result.dashboard.warden.contact}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
