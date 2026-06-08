import { useState } from 'react'
import ContactForm from './components/ContactForm.jsx'
import Login from './components/Login.jsx'
import Navigation from './components/Navigation.jsx'
import VirtualSpace from './components/VirtualSpace.jsx'

function MainPage() {
  return (
    <div className="min-h-screen bg-paper-gray">

      <Navigation />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto mt-16 px-4">
        <h1 className="text-5xl font-extrabold text-navy-900 mb-6">
          Strategic Financial Guidance <br /> for Modern Businesses.
        </h1>
        <p className="text-lg text-charcoal-500 mb-8 max-w-2xl">
          We provide expert tax compliance, statutory auditing, and virtual CFO services to help your company scale securely.
        </p>
        
        <div className="flex gap-4">
          <button className="bg-accent-blue hover:bg-blue-700 text-paper-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Book a Consultation
          </button>
          <button className="border-2 border-navy-900 text-navy-900 font-semibold py-3 px-6 rounded-lg hover:bg-navy-900 hover:text-paper-white transition-colors">
            Our Services
          </button>
        </div>
      </main>

      <VirtualSpace />
      <ContactForm />

    </div>
  )
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    isAuthenticated ? <MainPage /> : <Login onAuthenticated={() => setIsAuthenticated(true)} />
  )
}