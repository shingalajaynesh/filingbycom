// filingbycom frontend entry point - handles Clerk Provider initialization and fallback configuration check
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import './index.css';
import AppRoutes from './routes/AppRoutes';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  // Render a clean, descriptive configuration warning page instead of throwing a raw JS error
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
  // 2. Extract configuration outside the component tree
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

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/login">      
        <Toaster position="top-center" toastOptions={toastConfig} />
        <AppRoutes />
      </ClerkProvider>
    </StrictMode>
  );
}