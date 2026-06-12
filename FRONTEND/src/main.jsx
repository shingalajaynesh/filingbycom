/**
 * main.jsx
 * Bootstraps the FilingBy Frontend client application.
 * Configures the global providers including Clerk (auth), Toaster (notifications), 
 * Helmet (dynamic SEO), and mounts the main routing tree.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import AppRoutes from './routes/AppRoutes';

// Retrieve Clerk key from environment configurations
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// ── CONFIGURATION CHECK ──────────────────────────────────────────────────────
// Ensure the system fails safely with a custom warning UI if environmental
// keys are missing, avoiding raw blank screen console errors in development.
if (!clerkPublishableKey) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '500px',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          border: '1px solid #334155'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>🔑</div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#f1f5f9'
          }}>Configuration Required</h1>
          <p style={{
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            The Clerk Publishable Key is missing. Please add <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> to your environment variables to run this application.
          </p>
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#38bdf8',
            border: '1px solid #1e293b',
            wordBreak: 'break-all'
          }}>
            VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
          </div>
        </div>
      </div>
    </StrictMode>
  );
} else {
  // ── CUSTOM TOAST DESIGN SYSTEM ─────────────────────────────────────────────
  // Standardized configuration parameters for app-wide user alerts (hot-toast)
  const toastConfig = {
    duration: 4000,
    style: {
      background: '#1e293b',
      color: '#f8fafc',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 18px',
      boxShadow: '0 8px 32px rgba(15,23,42,0.25)',
    },
    success: {
      iconTheme: { primary: '#22c55e', secondary: '#f8fafc' },
    },
    error: {
      iconTheme: { primary: '#ef4444', secondary: '#f8fafc' },
    },
  };

  // ── APP BOOTSTRAP ──────────────────────────────────────────────────────────
  // Mount the application. The provider hierarchy is carefully configured:
  // - StrictMode: Validates React lifecycle side-effects in development
  // - HelmetProvider: Enables thread-safe head tags compilation for SEO
  // - ClerkProvider: Manages authentication sessions and identity synchronization
  // - Toaster: Visual feedback container mapped globally
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <HelmetProvider>
        <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/login">
          <Toaster position="top-center" toastOptions={toastConfig} />
          <AppRoutes />
        </ClerkProvider>
      </HelmetProvider>
    </StrictMode>
  );
}