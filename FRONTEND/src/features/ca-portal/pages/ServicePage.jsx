import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { m } from 'framer-motion';
import axios from 'axios';
import CheckoutModal from '../../checkout/components/CheckoutModal';
import SEO from '../../../shared/components/SEO.jsx';
import ReviewSubmissionModal from '../../../shared/components/ReviewSubmissionModal.jsx';
import { buildServiceSchema, buildBreadcrumbSchema, buildFaqSchema } from '../../../shared/seo/schemas.js';
import { useSharedData } from '../../../shared/context/SharedDataContext';

export default function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  
  const [openFaq, setOpenFaq] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const { services, loading: cacheLoading, refresh, settings } = useSharedData();
  const [serviceData, setServiceData] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [serviceReviews, setServiceReviews] = useState([]);

  useEffect(() => {
    if (services && services.length > 0) {
      const currentService = services.find(s => s.slug === slug);
      if (currentService) {
        setServiceData(currentService);
        
        // Find related services in same category
        const related = services
          .filter(s => s.category === currentService.category && s.slug !== slug && s.isActive !== false)
          .slice(0, 4);
        setRelatedServices(related);
      } else {
        setServiceData(null);
      }
      setPageLoading(false);
    } else if (!cacheLoading) {
      setServiceData(null);
      setPageLoading(false);
    }
  }, [slug, services, cacheLoading]);

  useEffect(() => {
    if (serviceData?._id) {
      const fetchServiceReviews = async () => {
        try {
          const API_BASE = (
            import.meta.env.VITE_API_URL || 
            import.meta.env.VITE_BACKEND_URL || 
            "http://localhost:3000"
          ).replace(/\/$/, "");
          const res = await axios.get(`${API_BASE}/reviews?pageType=service&service=${serviceData._id}`);
          if (res.data.success) {
            setServiceReviews(res.data.reviews || []);
          }
        } catch (err) {
          console.error("Failed to fetch service reviews:", err);
        }
      };
      fetchServiceReviews();
    } else {
      setServiceReviews([]);
    }
  }, [serviceData]);

  // Perform background caching refresh only once when slug changes
  useEffect(() => {
    refresh().catch(err => console.error("Silently failed to refresh services cache:", err));
  }, [slug, refresh]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading service details...</p>
      </div>
    );
  }

  if (!serviceData) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600">Service not found.</div>;
  }

  const handleGetStarted = () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    setShowCheckoutModal(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckoutModal(false);
    window.location.href = '/dashboard'; 
  };

  const faqs = serviceData.faqs || [];
  const processSteps = serviceData.processSteps || [];
  const documentsRequired = serviceData.documentsRequired || [];

  return (
    <m.main 
      key={slug}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 text-gray-900"
    >
      <SEO
        title={`${serviceData.name} Online India — Fast & Affordable | FilingBy`}
        description={serviceData.description || `Get expert-assisted ${serviceData.name} services online in India.`}
        keywords={`${serviceData.name.toLowerCase()} online, ${serviceData.name.toLowerCase()} registration, online CA services India`}
        canonical={`/services/${slug}`}
        schema={buildServiceSchema({ name: serviceData.name, description: serviceData.description, price: serviceData.basePrice?.toString(), url: `/services/${slug}` })}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: serviceData.category || "Services", url: '/' },
            { name: serviceData.name, url: `/services/${slug}` }
          ]),
          buildFaqSchema(faqs)
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span>{serviceData.category || "Services"}</span>
          <span>/</span>
          <span className="font-medium text-gray-900">{serviceData.name}</span>
        </nav>
 
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-6">
            <m.article 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-1 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1A56DB]">Service detail</p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{serviceData.name}</h1>
              <p className="mt-4 max-w-2xl text-gray-600">{serviceData.description}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">✓ Expert CA/CS Support</span>
                <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">✓ Fast Processing</span>
              </div>
            </m.article>
 
            {documentsRequired.length > 0 && (
              <m.article 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="order-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-xl font-semibold text-gray-900">Documents Required</h2>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  {documentsRequired.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3"><span className="mt-1 h-2 w-2 rounded-full bg-[#1A56DB]" /> <span>{item}</span></li>
                  ))}
                </ul>
              </m.article>
            )}
 
            {processSteps.length > 0 && (
              <m.article 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="order-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-xl font-semibold text-gray-900">Our Process</h2>
                <div className="mt-5 space-y-4">
                  {processSteps.map((step, index) => (
                    <div key={index} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A56DB] text-sm font-bold text-white">{index + 1}</span>
                      <p className="text-sm text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </m.article>
            )}
 
            {faqs.length > 0 && (
              <m.article 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="order-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-xl font-semibold text-gray-900">FAQs</h2>
                <div className="mt-5 space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                      <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-800">
                        {faq.q}
                        <span className="text-[#1A56DB]">{openFaq === index ? '−' : '+'}</span>
                      </button>
                      {openFaq === index && <p className="mt-3 text-sm text-gray-600">{faq.a}</p>}
                    </div>
                  ))}
                </div>
              </m.article>
            )}
          </div>
 
          <m.aside 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="order-2 lg:order-none lg:sticky lg:top-24 lg:self-start"
          >
            <div className="rounded-3xl border border-[#1A56DB] bg-white p-6 shadow-lg">
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="mt-2 text-4xl font-bold text-[#1A56DB]">₹{serviceData.basePrice?.toLocaleString('en-IN')}/-</p>
              <p className="mt-1 text-xs text-gray-400">+ Govt. fees as applicable</p>
              <button
                onClick={handleGetStarted}
                className="mt-5 w-full rounded-full bg-[#1A56DB] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Get Started
              </button>
              <a href={settings?.ca_whatsapp_url || "https://wa.me/917567126945"} target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center rounded-full border border-green-500 px-4 py-3 text-sm font-semibold text-green-600 hover:bg-green-50">WhatsApp Now</a>
              <a href={`tel:${settings?.ca_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`} className="mt-3 flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Call Us</a>
              <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">{['100% Online Process', 'Expert CA & CS Team', '50,000+ Happy Clients'].map((item) => <div key={item} className="flex items-center gap-2"><span>✓</span> {item}</div>)}</div>
            </div>
          </m.aside>
        </div>
 
        <m.section 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          {(() => {
            const reviewCount = serviceReviews.length;
            const averageRating = reviewCount
              ? (serviceReviews.reduce((sum, review) => sum + (Number(review.rating) || 5), 0) / reviewCount).toFixed(1)
              : "0.0";

            return (
              <>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">What Our Clients Say About This Service</h2>
                    <p className="text-sm text-gray-500">Verified feedback from business owners and founders</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full bg-gray-50 px-4 py-2 font-semibold text-gray-700 ring-1 ring-gray-200">
                        {reviewCount} reviews
                      </span>
                      <span className="rounded-full bg-blue-50 px-4 py-2 font-semibold text-[#1A56DB] ring-1 ring-blue-100">
                        {averageRating} / 5 average
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A56DB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-bold">★</span>
                    Write a review
                  </button>
                </div>

                <div className="mt-6">
                  {reviewCount > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {serviceReviews.map((rev, idx) => (
                        <article
                          key={idx}
                          className="rounded-2xl border border-gray-100 bg-slate-50 p-5 text-left"
                        >
                          <div className="flex items-center text-yellow-400 mb-3">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                            {Array.from({ length: 5 - (rev.rating || 5) }).map((_, i) => (
                              <span key={i} className="text-gray-300">★</span>
                            ))}
                          </div>
                          <p className="mb-4 text-sm leading-relaxed text-gray-605 italic">
                            "{rev.comment}"
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#1A56DB]">
                              {rev.authorName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "C"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-905 font-semibold">
                                {rev.authorName}
                              </p>
                              <p className="text-[10px] text-gray-500">{rev.businessName}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
                      <p className="text-sm font-semibold text-gray-700">No reviews yet for this service.</p>
                      <p className="mt-1 text-sm text-gray-500">Be the first to leave feedback for this page.</p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </m.section>

        <ReviewSubmissionModal
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          pageType="service"
          portal="ca-portal"
          serviceSlug={slug}
          title="Write a review for this service"
          description="Your feedback will be tied to this service page and reviewed before it is published."
        />

        {relatedServices.length > 0 && (
          <m.section 
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
                  <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                  <p className="mt-2 text-sm text-blue-600">View Details →</p>
                </button>
              ))}
            </div>
          </m.section>
        )}
      </section>
 
 
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        service={serviceData}
        onSuccess={handleCheckoutSuccess}
      />
    </m.main>
  );
}
