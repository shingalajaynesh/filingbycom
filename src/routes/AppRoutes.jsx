import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Home from '../pages/Home';
import ServicePage from '../pages/ServicePage';
import Login from "../components/Login";
import ClientDashboard from '../pages/ClientDashboard';

function FloatingActions() {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A56DB] text-white shadow-lg transition-all hover:bg-blue-700 lg:right-6 lg:hidden"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </>
  );
}

function AppRoutesContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navigation />}
      <FloatingActions />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">Register Page Coming Soon</div>} />
        <Route path="*" element={<div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  );
}
