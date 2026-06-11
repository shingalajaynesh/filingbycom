import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import './index.css';
import AppRoutes from './routes/AppRoutes';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// 1. Fail Fast on Missing Keys
if (!clerkPublishableKey) {
  throw new Error(
    "Missing Publishable Key: VITE_CLERK_PUBLISHABLE_KEY was not found in the environment variables."
  );
}

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
    <ClerkProvider 
      publishableKey={clerkPublishableKey} 
      signInUrl="/login"          
      signUpUrl="/register"      
      afterSignOutUrl="/login"
    >      
      <Toaster position="top-center" toastOptions={toastConfig} />
      <AppRoutes />
    </ClerkProvider>
  </StrictMode>
);