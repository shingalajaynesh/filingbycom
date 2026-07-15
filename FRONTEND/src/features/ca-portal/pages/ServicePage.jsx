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
import {
  ServiceOverview,
  ServiceBenefits,
  ServiceDocuments,
  ServiceTimeline,
  ServiceFees,
  ServiceFAQ,
  RelatedServices,
  RelatedBlogs,
  ComparisonTable,
  CTASection,
  ExpertReview
} from '../components/SEOContentComponents.jsx';

export default function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  
  const [openFaq, setOpenFaq] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const { services, loading: cacheLoading, refresh, settings } = useSharedData();
  const [serviceData, setServiceData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [serviceReviews, setServiceReviews] = useState([]);

  useEffect(() => {
    if (services && services.length > 0) {
      const currentService = services.find(s => s.slug === slug);
      if (currentService) {
        setServiceData(currentService);
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
            <ExpertReview updatedDate={serviceData.updatedAt} />
            <ServiceOverview name={serviceData.name} description={serviceData.description} />
            <ComparisonTable slug={slug} />
            <ServiceBenefits name={serviceData.name} benefits={serviceData.benefits} />
            <ServiceDocuments documents={documentsRequired} />
            <ServiceTimeline steps={processSteps} />
            <ServiceFees basePrice={serviceData.basePrice || 999} name={serviceData.name} />
            <ServiceFAQ faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
            <RelatedServices services={services} currentCategory={serviceData.category} currentSlug={slug} />
            <RelatedBlogs currentCategory={serviceData.category} />
          </div>
 
          <m.aside 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="order-2 lg:order-none lg:sticky lg:top-24 lg:self-start lg:flex lg:flex-col lg:gap-6"
          >
            <div className="rounded-3xl border border-[#1A56DB] bg-white p-6 shadow-lg">
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="mt-2 text-4xl font-bold text-[#1A56DB]">₹{serviceData.basePrice?.toLocaleString('en-IN')}/-</p>
              <p className="mt-1 text-xs text-slate-400">+ Govt. fees as applicable</p>
              <button
                onClick={handleGetStarted}
                className="mt-5 w-full rounded-full bg-[#1A56DB] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
              >
                Get Started
              </button>
            </div>
            
            <CTASection 
              name={serviceData.name} 
              whatsappUrl={settings?.ca_whatsapp_url} 
              phone={settings?.ca_contact_phone} 
            />
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
      </section>

      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 lg:hidden flex gap-3 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
        <button
          onClick={handleGetStarted}
          className="flex-1 bg-[#1A56DB] text-white py-3 rounded-full text-xs font-black text-center cursor-pointer border-0"
        >
          Get Started
        </button>
        <a
          href={settings?.ca_whatsapp_url || "https://wa.me/917567126945"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center bg-green-50 border border-green-400 text-green-600 px-5 py-3 rounded-full text-xs font-bold"
        >
          WhatsApp
        </a>
      </div>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        service={serviceData}
        onSuccess={handleCheckoutSuccess}
      />
    </m.main>
  );
}
