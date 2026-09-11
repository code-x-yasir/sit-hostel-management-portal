import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles.css';
import AppShell from './ui/AppShell.jsx';
import Home from './views/Home.jsx';
import Login from './views/Login.jsx';
import Dashboard from './views/Dashboard.jsx';
import Admin from './views/Admin.jsx';
import Verify from './views/Verify.jsx';
import PayFees from './views/PayFees.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pay-fees" element={<PayFees />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
