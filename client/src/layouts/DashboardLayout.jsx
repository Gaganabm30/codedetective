import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard-layout.css';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout-wrapper">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

