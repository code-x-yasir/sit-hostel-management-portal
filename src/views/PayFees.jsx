import { Link } from 'react-router-dom';

export default function PayFees() {
  return (
    <section className="section min-h-[60vh]">
      <div className="rounded-md border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-sit-gold">Pay Fees</p>
        <h1 className="mt-2 text-3xl font-extrabold text-sit-navy">Student login required</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-700">Hostel fee payment is available inside the student dashboard so the portal can link the Razorpay transaction to the correct USN and unlock room selection.</p>
        <Link to="/login" className="btn-primary mt-6">Login to Pay</Link>
      </div>
    </section>
  );
}
