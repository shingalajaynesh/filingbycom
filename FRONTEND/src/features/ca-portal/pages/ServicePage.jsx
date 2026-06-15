import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser, useClerk } from "@clerk/clerk-react";
import { motion } from 'framer-motion';
import { navData } from '../data/navigation.js';
import PhoneVerificationModal from '../../auth/components/PhoneVerificationModal';
import CheckoutModal from '../../checkout/components/CheckoutModal';
import SEO from '../../../shared/components/SEO.jsx';
import { buildServiceSchema, buildBreadcrumbSchema, buildFaqSchema } from '../../../shared/seo/schemas.js';

export default function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const [openFaq, setOpenFaq] = useState(0);

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [serviceData, setServiceData] = useState(null);

  let found = null;
  for (const category of navData) {
    for (const section of category.sections) {
      const item = section.items.find((entry) => entry.slug === slug);
      if (item) {
        found = { category, section, item };
        break;
      }
    }
    if (found) break;
  }

  if (!found) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600">Service not found.</div>;
  }

  const serviceFaqs = [
    {
      q: `How long does ${found.item.label} take?`,
      a: 'Typically 3–7 working days depending on government processing time.'
    },
    {
      q: 'What is the government fee?',
      a: 'Government fee varies by state and business type. Our team will inform you before proceeding.'
    },
    {
      q: 'Is this 100% online?',
      a: 'Yes, the entire process is done online. No physical visits are required.'
    }
  ];

  const relatedServices = found.category.sections.flatMap((section) => section.items).filter((item) => item.slug !== slug).slice(0, 4);

  const handleGetStarted = async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      clerk.openSignIn({ redirectUrl: window.location.href });
      return;
    }

    // Check if phone number exists on the Clerk user or in unsafeMetadata
    const hasPhone = (user.phoneNumbers && user.phoneNumbers.length > 0) || !!user.unsafeMetadata?.phoneNumber;

    // We need to fetch the actual service from backend to get its ID and basePrice
    try {
      const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${API_BASE}/services`);
      const data = await res.json();

      if (data.success) {
        // Find the matching service from the database by slug
        const dbService = data.services.find(s => s.slug === slug);
        if (dbService) {
          setServiceData(dbService);
          if (!hasPhone) {
            setShowPhoneModal(true);
          } else {
            setShowCheckoutModal(true);
          }
        } else {
          alert("Service is currently unavailable for checkout. Please contact support.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate checkout. Please try again later.");
    }
  };

  const handlePhoneVerificationSuccess = () => {
    setShowPhoneModal(false);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckoutModal(false);
    navigate('/dashboard'); // redirect to client dashboard
  };

  return (
    <motion.main 
      key={slug}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 text-gray-900"
    >
      <SEO
        title={`${found.item.label} Online India — Fast & Affordable | FilingBy`}
        description={`Get expert-assisted ${found.item.label} services online in India. Safe & secure document collection, 100% transparency, starting from ₹999/month.`}
        keywords={`${found.item.label.toLowerCase()} online, ${found.item.label.toLowerCase()} registration, online CA services India, company compliance`}
        canonical={`/services/${slug}`}
        schema={buildServiceSchema({ name: found.item.label, description: `Get expert-assisted ${found.item.label} services online in India.`, price: "999.00", url: `/services/${slug}` })}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: found.category.label, url: '/' },
            { name: found.item.label, url: `/services/${slug}` }
          ]),
          buildFaqSchema(serviceFaqs)
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span>{found.category.label}</span>
          <span>/</span>
          <span className="font-medium text-gray-900">{found.item.label}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <motion.article 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1A56DB]">Service detail</p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{found.item.label}</h1>
              <p className="mt-4 max-w-2xl text-gray-600">Get expert assistance with {found.item.label} — 100% online, affordable, and fast.</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">✓ Expert CA/CS Support</span>
                <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">✓ Fast Processing</span>
              </div>
            </motion.article>

            <motion.article 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900">Documents Required</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                {['PAN Card of all directors/partners', 'Aadhaar Card (self-attested)', 'Passport size photographs', 'Address proof (electricity bill / bank statement)', 'Digital Signature Certificate (DSC)'].map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3"><span className="mt-1 h-2 w-2 rounded-full bg-[#1A56DB]" /> <span>{item}</span></li>
                ))}
              </ul>
            </motion.article>

            <motion.article 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900">Our Process</h2>
              <div className="mt-5 space-y-4">
                {['Fill the Form — Share your basic details online.', 'Document Collection — Upload required documents securely.', 'Expert Review — Our CA/CS team verifies everything.', 'Certificate Delivery — Get your certificate via email.'].map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A56DB] text-sm font-bold text-white">{index + 1}</span>
                    <p className="text-sm text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </motion.article>

            <motion.article 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900">FAQs</h2>
              <div className="mt-5 space-y-3">
                {serviceFaqs.map((faq, index) => (
                  <div key={faq.q} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                    <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-800">
                      {faq.q}
                      <span className="text-[#1A56DB]">{openFaq === index ? '−' : '+'}</span>
                    </button>
                    {openFaq === index && <p className="mt-3 text-sm text-gray-600">{faq.a}</p>}
                  </div>
                ))}
              </div>
            </motion.article>
          </div>

          <motion.aside 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="rounded-3xl border border-[#1A56DB] bg-white p-6 shadow-lg">
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="mt-2 text-4xl font-bold text-[#1A56DB]">₹999/-</p>
              <p className="mt-1 text-xs text-gray-400">+ Govt. fees as applicable</p>
              <button
                onClick={handleGetStarted}
                className="mt-5 w-full rounded-full bg-[#1A56DB] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Get Started
              </button>
              <a href="https://wa.me/917567126945" target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center rounded-full border border-green-500 px-4 py-3 text-sm font-semibold text-green-600 hover:bg-green-50">WhatsApp Now</a>
              <a href="tel:+917567126945" className="mt-3 flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Call Us</a>
              <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">{['100% Online Process', 'Expert CA & CS Team', '50,000+ Happy Clients'].map((item) => <div key={item} className="flex items-center gap-2"><span>✓</span> {item}</div>)}</div>
            </div>
          </motion.aside>
        </div>

        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-xl font-semibold text-gray-900">Related Services</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedServices.map((item) => (
              <button key={item.slug} onClick={() => navigate(`/services/${item.slug}`)} className="rounded-2xl border border-gray-100 p-4 text-left transition hover:border-blue-200 hover:shadow-md">
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="mt-2 text-sm text-blue-600">View Details →</p>
              </button>
            ))}
          </div>
        </motion.section>
      </section>

      <PhoneVerificationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={handlePhoneVerificationSuccess}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        service={serviceData}
        onSuccess={handleCheckoutSuccess}
      />
    </motion.main>
  );
}
