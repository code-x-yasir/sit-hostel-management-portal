import { Outlet, Link, NavLink } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/#hostel-info', label: 'Hostel Info' },
  { to: '/login', label: 'Login' },
  { to: '/pay-fees', label: 'Pay Fees' },
  { to: '/#contact', label: 'Contact' }
];

function SitLogo() {
  return (
    <img
      src="/sit-logo.jpg"
      alt="Siddaganga Institute of Technology logo"
      className="h-16 w-16 shrink-0 rounded-full bg-white object-contain shadow-sm"
    />
  );
}

export default function AppShell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <SitLogo />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-sit-gold">Autonomous Institute | VTU Affiliated | NAAC A++</p>
              <p className="text-lg font-extrabold text-sit-navy">Siddaganga Institute of Technology, Tumakuru</p>
            </div>
          </Link>
          <div className="min-w-0 flex-1 text-center sm:hidden">
            <p className="truncate text-sm font-extrabold text-sit-navy">Siddaganga Institute of Technology</p>
            <p className="truncate text-[10px] font-semibold uppercase text-sit-gold">Autonomous | VTU | NAAC A++</p>
          </div>
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-sit-mist hover:text-sit-navy">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button className="rounded-md p-2 text-sit-navy lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-sit-mist">
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer id="contact" className="bg-sit-navy text-white">
        <div className="section grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <SitLogo />
              <div>
                <p className="font-extrabold">Siddaganga Institute of Technology</p>
                <p className="text-sm text-white/75">Hostel Management Office</p>
              </div>
            </div>
            <p className="flex gap-2 text-sm text-white/80"><MapPin size={18} className="mt-0.5 shrink-0 text-sit-gold" />Dr. Sree Sree Sivakumara Swamiji Road, Tumakuru - 572 103, Karnataka</p>
            <p className="mt-3 flex gap-2 text-sm text-white/80"><Phone size={18} className="text-sit-gold" />Admin Office: 0816-2214026 | Chief Warden: 0816-2214040</p>
          </div>
          <div>
            <p className="mb-3 font-bold text-sit-gold">Quick Links</p>
            <div className="grid gap-2 text-sm text-white/80">
              <Link to="/">Hostel Info</Link>
              <Link to="/login">Student Login</Link>
              <Link to="/admin">Admin Panel</Link>
              <Link to="/verify">QR Verification</Link>
            </div>
          </div>
          <div>
            <p className="mb-3 font-bold text-sit-gold">Connect</p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin, Mail].map((Icon, index) => (
                <span key={index} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-sit-gold">
                  <Icon size={18} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
