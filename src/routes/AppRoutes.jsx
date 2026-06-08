import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ServicePage from '../pages/ServicePage';
import App from '../App';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/login" element={<div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">Login Page Coming Soon</div>} />
        <Route path="/register" element={<div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">Register Page Coming Soon</div>} />
        <Route path="*" element={<div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
