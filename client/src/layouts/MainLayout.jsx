import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/main-layout.css';

export default function MainLayout() {
  return (
    <div className="main-layout-wrapper">
      <Navbar />
      <main className="main-layout-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

