import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Camera, CheckCircle2, Droplets, Dumbbell, Gamepad2, Home as HomeIcon, LockKeyhole, ShieldCheck, Shirt, Utensils, Wifi, Zap } from 'lucide-react';
import { api } from '../api';

const campusImage = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=80';
const gallery = [
  { label: 'SIT Hostel Block', src: '/hostel/hostel-24-copy.jpg' },
  { label: 'Hostel Rooms', src: '/hostel/hostel-1w5a3801.webp' },
  { label: 'Hostel Common Area', src: '/hostel/hostel-3-copy.jpg' },
  { label: 'Hostel Dining & Recreation', src: '/hostel/hostel-1w5a3485.webp' },
  { label: 'SIT Hostel Campus', src: '/hostel/hostel-23-copy.jpg' }
];

const amenities = [
  ['Wi-Fi', Wifi],
  ['24/7 Security', ShieldCheck],
  ['CCTV', Camera],
  ['Mess & Dining', Utensils],
  ['Gym', Dumbbell],
  ['Laundry', Shirt],
  ['Power Backup', Zap],
  ['Purified Water', Droplets],
  ['Housekeeping', CheckCircle2],
  ['Indoor Games', Gamepad2],
  ['Guest House for Parents', HomeIcon]
];

const hostelDirectory = [
  { sl: '01', block: 'Ganga Hostel', capacity: '290', warden: 'Dr. K B Roopa', mobile: '+91 9448030642', phone: '0816 2282691' },
  { sl: '02', block: 'Akkamahadevi Block', capacity: '240', warden: 'T O Geetharani', mobile: '+91 9844538088', phone: '0816 2291165' },
  { sl: '03', block: 'Mahatma Gandhi Block', capacity: '355', warden: 'Dr. B Vasudev', mobile: '+91 7619178168', phone: '0816 2291121' },
  { sl: '04', block: 'Basaveshwara Block', capacity: '580', warden: 'Dr. C Somashekar', mobile: '+91 9844420529', phone: '0816 2291041' },
  { sl: '05', block: 'Lalbahadur Shastri Block', capacity: '328', warden: 'Dr. S Suresh Kumar', mobile: '+91 9449626854', phone: '0816 2283773, 2281676' },
  { sl: '06', block: 'Allamaprabhu Block', capacity: '293', warden: 'Dr. Virupaxi Auradi', mobile: '+91 9844386037', phone: '0816 2282373, 2282374' }
];

const feeTables = [
  {
    title: 'First Year (BE / M.Tech / MBA / MCA)',
    total: '₹86,550',
    rows: [
      ['Caution Deposit', '₹1,500'],
      ['Room Rent', '₹13,000'],
      ['Establishment Charges', '₹25,000'],
      ['Advance Mess Bill', '₹42,000'],
      ['Welfare Fund', '—'],
      ['Application Fee', '₹50'],
      ['Building Fund', '₹5,000']
    ]
  },
  {
    title: 'Second / Third / Fourth Year',
    total: '₹81,550',
    rows: [
      ['Caution Deposit', '₹1,500'],
      ['Room Rent', '₹13,000'],
      ['Establishment Charges', '₹25,000'],
      ['Advance Mess Bill (approx. 10 months)', '₹42,000'],
      ['Welfare Fund', '—'],
      ['Application Fee', '₹50']
    ]
  }
];

export default function Home() {
  const [info, setInfo] = useState(null);
  const [feeAudience, setFeeAudience] = useState('For Male');

  useEffect(() => {
    api.hostelInfo().then(setInfo).catch(() => {});
  }, []);

  return (
    <>
      <section className="relative min-h-[620px] overflow-hidden bg-sit-navy text-white">
        <img src={campusImage} alt="SIT campus" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-sit-navy via-sit-navy/85 to-sit-navy/25" />
        <div className="section relative flex min-h-[620px] items-center">
          <div className="max-w-3xl pt-10">
            <p className="mb-4 inline-flex rounded-md bg-sit-gold px-3 py-1 text-sm font-bold text-sit-navy">SIT Hostel Management Portal</p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">SIT Group of Hostels — A Home Away From Home</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">Secure digital hostel IDs, fee payment, live room booking, and guard verification for Siddaganga Institute of Technology students.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="btn-primary bg-sit-gold text-sit-navy hover:bg-[#dca837]">Student Login</Link>
              <Link to="/pay-fees" className="btn-secondary btn-hero-fee">Pay Hostel Fee</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="hostel-info" className="bg-white">
        <div className="section">
          <div className="rounded-md border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-200 bg-sit-navy px-5 py-6 text-white sm:px-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <img src="/sit-logo.jpg" alt="SIT logo" className="h-16 w-16 rounded-full bg-white object-contain" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-sit-gold">Hostel Admissions 2025-26</p>
                    <h2 className="display-font mt-1 text-3xl text-white sm:text-4xl">Hostel Information</h2>
                  </div>
                </div>
                <p className="max-w-xl text-sm leading-6 text-white/80">Authoritative hostel block contacts and fee details for SIT Tumakuru students and parents.</p>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-sit-gold">Section 1</p>
                  <h3 className="display-font mt-1 text-3xl text-sit-navy">Hostel Blocks Directory</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-sit-mist px-4 py-3">
                    <p className="text-xl font-extrabold text-sit-navy">06</p>
                    <p className="text-xs font-bold text-slate-600">Blocks</p>
                  </div>
                  <div className="rounded-md bg-sit-mist px-4 py-3">
                    <p className="text-xl font-extrabold text-sit-navy">2,086</p>
                    <p className="text-xs font-bold text-slate-600">Capacity</p>
                  </div>
                  <div className="rounded-md bg-sit-mist px-4 py-3">
                    <p className="text-xl font-extrabold text-sit-navy">24x7</p>
                    <p className="text-xs font-bold text-slate-600">Support</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 hidden overflow-hidden rounded-md border border-slate-200 md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sit-navy text-white">
                    <tr>
                      {['Sl. No', 'Hostel Block', 'Capacity', 'Deputy Warden', 'Mobile No', 'Hostel Phone No'].map((head) => (
                        <th key={head} className="px-4 py-3 font-bold">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hostelDirectory.map((hostel) => (
                      <tr key={hostel.sl} className="border-t border-slate-100 transition hover:bg-[#fff8e8]">
                        <td className="px-4 py-4 font-extrabold text-sit-gold">{hostel.sl}</td>
                        <td className="px-4 py-4 font-bold text-sit-navy">{hostel.block}</td>
                        <td className="px-4 py-4 font-semibold">{hostel.capacity}</td>
                        <td className="px-4 py-4">{hostel.warden}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{hostel.mobile}</td>
                        <td className="px-4 py-4">{hostel.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid gap-3 md:hidden">
                {hostelDirectory.map((hostel) => (
                  <article key={hostel.sl} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sit-gold">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-wide text-sit-gold">Sl. No {hostel.sl}</p>
                        <h4 className="mt-1 text-lg font-extrabold text-sit-navy">{hostel.block}</h4>
                      </div>
                      <span className="rounded-md bg-sit-mist px-3 py-1 text-sm font-bold text-sit-navy">{hostel.capacity}</span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-700">
                      <p><span className="font-bold text-slate-900">Deputy Warden:</span> {hostel.warden}</p>
                      <p><span className="font-bold text-slate-900">Mobile:</span> {hostel.mobile}</p>
                      <p><span className="font-bold text-slate-900">Hostel Phone:</span> {hostel.phone}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sit-mist">
        <div className="section">
          <h2 className="text-3xl font-extrabold text-sit-navy">Amenities</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {amenities.map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-3 rounded-md bg-white p-4 shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-sit-navy text-sit-gold"><Icon size={19} /></span>
                <span className="font-semibold text-slate-800">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="text-3xl font-extrabold text-sit-navy">Hostel Gallery</h2>
        <div className="masonry mt-6">
          {gallery.map((item) => (
            <figure key={item.label} className="masonry-item overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <img src={item.src} alt={item.label} className="h-auto w-full object-cover" />
              <figcaption className="border-t border-slate-200 px-4 py-3 text-sm font-bold text-sit-navy">{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-sit-mist">
        <div className="section">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-sit-gold">Section 2</p>
              <h2 className="display-font mt-1 text-3xl text-sit-navy sm:text-4xl">Hostel Fee Structure (AY 2025-2026)</h2>
            </div>
            <div className="flex rounded-md border border-slate-200 bg-white p-1 shadow-sm">
              {['For Male', 'For Female'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFeeAudience(tab)}
                  className={`rounded-md px-4 py-2 text-sm font-extrabold transition ${feeAudience === tab ? 'bg-sit-navy text-white shadow-sm' : 'text-sit-navy hover:bg-sit-mist'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-md border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-sit-gold">{feeAudience}</p>
                <h3 className="text-xl font-extrabold text-sit-navy">Applicable hostel fee panels</h3>
              </div>
              <p className="rounded-md bg-[#fff8e8] px-4 py-2 text-sm font-extrabold text-sit-navy">Single Room: ₹5,000 extra</p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {feeTables.map((table) => (
                <div key={`${feeAudience}-${table.title}`} className="overflow-hidden rounded-md border border-slate-200">
                  <div className="bg-sit-navy px-4 py-4">
                    <h4 className="font-extrabold text-white">{table.title}</h4>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-sit-mist text-sit-navy">
                      <tr><th className="px-4 py-3">Fee Head</th><th className="px-4 py-3 text-right">Amount</th></tr>
                    </thead>
                    <tbody>
                      {table.rows.map(([head, amount]) => (
                        <tr key={head} className="border-t border-slate-100 transition hover:bg-[#fff8e8]">
                          <td className="px-4 py-3 text-slate-700">{head}</td>
                          <td className="px-4 py-3 text-right font-bold text-sit-navy">{amount}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-sit-gold bg-[#fff2cf]">
                        <td className="px-4 py-4 text-base font-extrabold text-sit-navy">Total</td>
                        <td className="px-4 py-4 text-right text-base font-extrabold text-sit-navy">{table.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>

          <div id="hostel-feedback" className="mt-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <AlertCircle className="mt-1 shrink-0 text-sit-gold" />
                <div>
                  <h3 className="font-extrabold text-sit-navy">Report Error</h3>
                  <p className="mt-1 text-sm text-slate-700">Found a correction in hostel contacts or fees? Send it to the hostel office for review.</p>
                </div>
              </div>
              <a className="btn-primary" href="mailto:hostel@sit.ac.in?subject=Hostel%20Information%20Correction">Open Feedback Form</a>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-white p-6 shadow-sm">
            <LockKeyhole className="text-sit-gold" />
            <h3 className="mt-4 text-xl font-extrabold text-sit-navy">Hostel Office Contacts</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">Admin Office: 0816-2214026<br />Chief Warden: 0816-2214040</p>
            <p className="mt-4 text-sm leading-6 text-slate-700">{info?.contacts?.address}</p>
          </div>
        </div>
      </section>

      <a href="#hostel-feedback" className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-md bg-sit-gold px-4 py-3 text-sm font-extrabold text-sit-navy shadow-soft transition hover:bg-[#dca837]">
        <AlertCircle size={18} /> Report Error
      </a>
    </>
  );
}
