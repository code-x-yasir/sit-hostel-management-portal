create table if not exists students (
  usn varchar(20) primary key,
  name varchar(120) not null,
  dob_hash text not null,
  branch varchar(80) not null,
  year int not null,
  semester int not null default 6,
  gender varchar(10) not null check (gender in ('male', 'female')),
  photo_url text,
  email varchar(160),
  phone varchar(20),
  created_at timestamptz default now()
);

create table if not exists wardens (
  warden_id serial primary key,
  name varchar(120) not null,
  contact varchar(30) not null,
  email varchar(160),
  block_id int
);

create table if not exists hostel_blocks (
  block_id serial primary key,
  block_name varchar(140) not null,
  gender varchar(10) not null check (gender in ('male', 'female')),
  total_rooms int not null,
  warden_id int references wardens(warden_id)
);

alter table wardens
  add constraint wardens_block_id_fkey foreign key (block_id) references hostel_blocks(block_id) deferrable initially deferred;

create table if not exists rooms (
  room_id serial primary key,
  block_id int not null references hostel_blocks(block_id),
  room_number varchar(20) not null,
  floor varchar(20) not null,
  capacity int not null check (capacity in (2, 3)),
  room_type varchar(30) not null
);

create table if not exists beds (
  bed_id serial primary key,
  room_id int not null references rooms(room_id),
  bed_label varchar(10) not null,
  status varchar(20) not null default 'available' check (status in ('available', 'booked', 'reserved'))
);

create table if not exists allotments (
  allotment_id serial primary key,
  usn varchar(20) not null references students(usn),
  bed_id int not null references beds(bed_id),
  academic_year varchar(12) not null,
  allotment_date timestamptz default now(),
  status varchar(20) not null default 'active' check (status in ('active', 'vacated'))
);

create table if not exists fee_records (
  fee_id serial primary key,
  usn varchar(20) not null references students(usn),
  academic_year varchar(12) not null,
  semester int not null,
  total_amount numeric(10,2) not null,
  paid_amount numeric(10,2) not null default 0,
  due_date date not null,
  status varchar(20) not null default 'PENDING' check (status in ('PAID', 'PENDING', 'PARTIAL'))
);

create table if not exists transactions (
  txn_id serial primary key,
  usn varchar(20) not null references students(usn),
  razorpay_payment_id varchar(100),
  amount numeric(10,2) not null,
  timestamp timestamptz default now(),
  status varchar(20) not null,
  receipt_url text
);

create table if not exists admins (
  admin_id serial primary key,
  username varchar(80) unique not null,
  password_hash text not null,
  role varchar(40) not null default 'super_admin'
);

create table if not exists booking_controls (
  id serial primary key,
  academic_year varchar(12) not null unique,
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  is_open boolean not null default false
);
