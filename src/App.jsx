import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ContactForm from './components/ContactForm.jsx';
import Login from './components/Login.jsx';
import Navigation from './components/Navigation.jsx';
import VirtualSpace from './components/VirtualSpace.jsx';
import ServicePage from './pages/ServicePage.jsx';

function MainPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto mt-16 max-w-6xl px-4">
        <h1 className="mb-6 text-5xl font-extrabold text-slate-900">Strategic Financial Guidance <br /> for Modern Businesses.</h1>
        <p className="mb-8 max-w-2xl text-lg text-slate-600">We provide expert tax compliance, statutory auditing, and virtual CFO services to help your company scale securely.</p>

        <div className="flex gap-4">
          <button className="rounded-lg bg-[#1A56DB] px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700">Book a Consultation</button>
          <button className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white">Our Services</button>
        </div>
      </main>

      <VirtualSpace />
      <ContactForm />
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <Routes>
          <Route path="/" element={isAuthenticated ? <MainPage /> : <Login onAuthenticated={() => setIsAuthenticated(true)} />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}