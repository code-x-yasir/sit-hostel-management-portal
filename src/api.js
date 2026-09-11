const base = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  hostelInfo: () => request('/public/hostel-info'),
  studentLogin: (payload) => request('/auth/student/login', { method: 'POST', body: JSON.stringify(payload) }),
  adminLogin: (payload) => request('/auth/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  dashboard: () => request('/student/dashboard'),
  rooms: (blockId, floor) => request(`/rooms?blockId=${blockId || ''}&floor=${encodeURIComponent(floor || '')}`),
  createOrder: (amount) => request('/payments/create-order', { method: 'POST', body: JSON.stringify({ amount }) }),
  confirmPayment: (payload) => request('/payments/confirm', { method: 'POST', body: JSON.stringify(payload) }),
  bookBed: (bedId) => request('/bookings', { method: 'POST', body: JSON.stringify({ bedId }) }),
  retainRoom: () => request('/bookings/retain', { method: 'POST' }),
  verify: (usn) => request(`/verify?usn=${encodeURIComponent(usn || '')}`),
  adminDashboard: () => request('/admin/dashboard'),
  adminStudents: () => request('/admin/students')
};
