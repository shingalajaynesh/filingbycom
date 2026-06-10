import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Home from '../pages/Home';
import ServicePage from '../pages/ServicePage';
import Login from "../components/Login";
import Register from '../components/Register';
import ClientDashboard from '../pages/ClientDashboard';
import DigitalCard from '../pages/DigitalCard';
import { supabase } from '../lib/supabaseClient';

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
  const isCardPage = location.pathname === '/card';

  return (
    <>
      {!isAuthPage && !isCardPage && <Navigation />}
      <FloatingActions />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  // Sync Google OAuth users to MongoDB after they land back from Google redirect
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const provider = session.user.app_metadata?.provider;
          if (provider === 'google') {
            const { user } = session;
            const fullName = user.user_metadata?.full_name || '';
            const nameParts = fullName.trim().split(' ');
            const firstName = user.user_metadata?.given_name || nameParts[0] || 'Google';
            const lastName = user.user_metadata?.family_name || nameParts.slice(1).join(' ') || 'User';
            const email = user.email;

            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            try {
              await fetch(`${backendUrl.replace(/\/$/, '')}/register`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ firstName, lastName, email }),
              });
            } catch (err) {
              console.error('Failed to sync Google user to MongoDB:', err);
            }
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  );
}
