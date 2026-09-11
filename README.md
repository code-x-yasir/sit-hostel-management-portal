# SIT Hostel Management Portal

Production-oriented full-stack hostel portal for Siddaganga Institute of Technology, Tumakuru.

## Stack

- React + Vite + Tailwind CSS + React Router
- Node.js + Express + Socket.io
- PostgreSQL schema in `server/schema.sql`
- Razorpay order/confirmation hooks
- QR generation with `qrcode`
- ID PDF export with `html2canvas` + `jsPDF`
- Nodemailer confirmation hook

The local demo runs with seeded in-memory data so reviewers can use the app immediately. Configure `DATABASE_URL` and migrate `server/schema.sql` for Supabase/Railway production storage.

## Run Locally

```bash
npm install
npm run dev
```

Open the app at:

```text
http://127.0.0.1:5173/
```

## Run From WebStorm

1. Open this folder in WebStorm:

```text
/Users/yasirarafat/Desktop/hostel management
```

2. Wait for WebStorm to index the project.
3. Open the built-in Terminal and run this once:

```bash
npm install
```

4. Use the Run dropdown and select `SIT Hostel Portal`, then press Run.
5. Open:

```text
http://127.0.0.1:5173/
```

If the Run dropdown does not show `SIT Hostel Portal`, run this from the WebStorm terminal:

```bash
npm run dev
```

The `dev` command starts both the backend API and frontend website. If you prefer separate terminals:

```bash
node server/index.js
npm run client:dev
```

## Demo Logins

Student:

- USN: `1SI21CS089`
- DOB: `14/08/2003`

Admin:

- Username: `admin`
- Password: `admin@SIT2026`

## Important Routes

- `/` public hostel info landing page
- `/login` student login
- `/dashboard` student dashboard, digital ID card, fee status, room booking
- `/pay-fees` payment entry screen
- `/admin` admin dashboard
- `/verify?usn=1SI21CS089` guard QR verification

## Production Notes

- Store JWT refresh/access tokens in secure HTTP-only cookies behind HTTPS.
- Replace demo Razorpay keys with production/test dashboard keys.
- Configure Gmail SMTP or a transactional email provider for Nodemailer.
- Run the PostgreSQL schema in Supabase and swap the in-memory store for SQL repositories.
- Deploy frontend on Vercel and backend on Railway with `CLIENT_URL`, `JWT_SECRET`, `DATABASE_URL`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET`.
