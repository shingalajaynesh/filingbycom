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
import { getInitialServicePayload, revealPrerenderShell } from '../../../shared/utils/prerender.js';
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

const SERVICE_SEO_OVERRIDES = {
  "trust-registration": {
    title: "Trust Compliance in India: Annual Filing, Audit and Legal Checklist",
    description:
      "Understand trust compliance in India, including annual filing, audit applicability, ITR-7, 12A and 80G records, due dates and common mistakes.",
    keywords:
      "trust compliance india, trust audit india, trust compliance checklist, annual trust filing, audit of trust, ngo compliance india",
    intro:
      "This page helps trustees and compliance teams understand annual trust compliance, trust audit applicability, ITR-7 discipline, 12A and 80G records, and the practical filing controls that reduce avoidable notices.",
    snapshotTitle: "Quick answer for trust compliance searches",
    snapshotBody:
      "If you are searching for trust compliance, trust audit, or whether a trust audit is compulsory, the first checks are annual records, audit readiness, ITR-7 filing discipline, and 12A or 80G support documents.",
    quickFacts: [
      { label: "Best for", value: "Annual trust filing and audit readiness" },
      { label: "Key queries", value: "Trust audit, checklist, ITR-7, 12A and 80G" },
      { label: "Ideal next step", value: "Review records, due dates, and audit applicability" }
    ],
    checkpoints: [
      "Check whether the trust's tax position makes audit support necessary.",
      "Keep ITR-7, donor records, expense proof, and governance documents aligned.",
      "Review 12A and 80G support records before year-end filing begins.",
      "Use one owner and one deadline tracker for recurring trust compliance work."
    ],
    primaryCtaLabel: "Get Trust Compliance Help",
    faqs: [
      {
        q: "What is included in a trust compliance checklist in India?",
        a: "A practical trust compliance checklist usually includes book-keeping, audit readiness, ITR-7 filing, 12A and 80G record maintenance, donor and expense documentation, and timely review of governance records."
      },
      {
        q: "Is audit of a trust compulsory or voluntary?",
        a: "Trust audit applicability depends on the trust's tax position, income level, and exemption requirements. Many charitable trusts need audit support to support exemption claims and year-end filing discipline."
      },
      {
        q: "What is the difference between trust registration and trust compliance?",
        a: "Trust registration is the formation step. Trust compliance covers the recurring legal and tax work after setup, including records, annual returns, audit readiness, and exemption-related documentation."
      }
    ]
  },
  "csr-registration": {
    title: "CSR Audit in India: Meaning, Applicability and Practical Compliance Guide",
    description:
      "Learn what CSR audit means in India, when it matters, what documents to prepare, how CSR-1 context fits in, and the practical checks companies should review.",
    keywords:
      "csr audit india, csr audit meaning, csr audit report, csr audit checklist, csr compliance guide",
    intro:
      "This page is designed for teams searching for CSR audit meaning, CSR audit reports, and practical compliance checks around CSR-1, utilisation evidence, board reporting and supporting records.",
    snapshotTitle: "Quick answer for CSR audit searches",
    snapshotBody:
      "Teams usually search CSR audit when they need a practical review of committee approvals, utilisation evidence, implementing-agency documents, project support, and board-report readiness.",
    quickFacts: [
      { label: "Best for", value: "CSR review, reporting readiness, and support files" },
      { label: "Key queries", value: "CSR audit meaning, report, checklist, CSR-1" },
      { label: "Ideal next step", value: "Validate records before board or internal review" }
    ],
    checkpoints: [
      "Confirm committee approvals, policy documents, and CSR-1 context are complete.",
      "Match project spend with utilisation records and implementation evidence.",
      "Organize board-report support before annual reporting deadlines compress.",
      "Close documentation gaps before an external or internal review begins."
    ],
    primaryCtaLabel: "Talk To A CSR Expert",
    faqs: [
      {
        q: "What is the meaning of CSR audit?",
        a: "CSR audit usually refers to a structured review of CSR spending, project records, approvals and support documents so the company can assess whether its CSR execution and reporting are properly backed."
      },
      {
        q: "Is a CSR audit report mandatory?",
        a: "The exact reporting obligation depends on the company's facts, but many teams still prepare an internal or expert-reviewed CSR audit-style file to support board reporting, utilisation checks and governance comfort."
      },
      {
        q: "What should be included in a CSR audit checklist?",
        a: "A CSR audit checklist should cover committee approvals, policy records, implementing-agency documents, project evidence, utilisation support, board report disclosures and any impact-assessment context where applicable."
      }
    ]
  },
  "moa-amendment": {
    title: "MOA Amendment for Private Limited Companies: Process, Documents and Fees",
    description:
      "Learn how MOA amendment works for private limited companies in India, including board approval, special resolution, MGT-14 filing, timelines, fees and common mistakes.",
    keywords:
      "moa amendment, moa amendment private limited company, can moa be amended, object clause amendment, mgt-14 filing",
    intro:
      "This page is tailored for searches around MOA amendment, object clause changes, whether MOA can be amended, and the board-to-ROC process that follows.",
    snapshotTitle: "Quick answer for MOA amendment searches",
    snapshotBody:
      "If you want to amend an MOA or change the object clause, the work usually flows from board review to shareholder approval, then MGT-14 filing and ROC document checks.",
    quickFacts: [
      { label: "Best for", value: "Object clause and MOA change support" },
      { label: "Key queries", value: "Can MOA be amended, MGT-14, process, fees" },
      { label: "Ideal next step", value: "Confirm the clause, approvals, and timeline" }
    ],
    checkpoints: [
      "Confirm the exact clause being changed and why the amendment is needed.",
      "Prepare the approval chain before scheduling the shareholder resolution.",
      "Keep the amended MOA copy and supporting resolutions ready for ROC filing.",
      "Track the MGT-14 submission window to avoid unnecessary filing risk."
    ],
    primaryCtaLabel: "Start MOA Amendment",
    faqs: [
      {
        q: "Can MOA be amended in a private limited company?",
        a: "Yes. A private limited company can amend its MOA through the required approval chain, usually including board action, shareholder approval and ROC filing with the right supporting documents."
      },
      {
        q: "What is the process for MOA amendment?",
        a: "The process typically includes reviewing the clause to be changed, passing the right approvals, updating the amended MOA set, and filing the ROC form within the prescribed timeline."
      },
      {
        q: "When is an object clause amendment needed?",
        a: "An object clause amendment is commonly needed when a company wants to expand into activities that are not comfortably covered by its current business objects."
      }
    ]
  },
  "pvt-winding-up": {
    title: "Private Limited Company Winding Up in India: Process, STK-2 Route and Key Checks",
    description:
      "Understand private limited company winding up in India, including STK-2 closure, eligibility, records to prepare, tax clean-up and common strike-off mistakes.",
    keywords:
      "private limited company winding up india, stk-2 company closure, close private limited company, company strike off india",
    intro:
      "This page addresses search intent around private limited company winding up, strike-off preparation, STK-2 suitability and the clean-up work businesses should complete before filing.",
    faqs: [
      {
        q: "What is the fastest route for private limited company winding up?",
        a: "For eligible inactive companies, a strike-off style route may be faster than a full winding-up process, but suitability depends on liabilities, filings, tax position and shareholder readiness."
      },
      {
        q: "What documents are needed before STK-2 filing?",
        a: "Businesses usually need updated statutory records, closure resolutions, indemnity and affidavit support, and confidence that taxes, bank matters and pending filings have been cleaned up first."
      }
    ]
  },
  "tan-registration": {
    title: "TAN Registration in India: Form 49B Process, Documents and TDS Setup Guide",
    description:
      "Understand TAN registration in India, including Form 49B, documents, who needs TAN, TAN card queries, TDS setup and common first-time filing mistakes.",
    keywords:
      "tan registration india, tan card, tancard, form 49b, tan application process, tds setup for business",
    intro:
      "This page is built for searchers looking for TAN registration, TAN card help, Form 49B steps and how TAN fits into practical TDS setup for a new business.",
    faqs: [
      {
        q: "Is TAN registration the same as applying for a TAN card?",
        a: "In practice, people often use the terms interchangeably. TAN registration is the core process, while TAN card usually refers to the confirmation or record businesses expect after the application is processed."
      },
      {
        q: "Who needs TAN in India?",
        a: "Businesses and entities that are required to deduct or collect tax at source generally need TAN so they can operate compliantly within the TDS or TCS system."
      }
    ]
  },
  "roc-annual-filing-llp": {
    title: "LLP Compliance in India: Form 8, Form 11 and Annual Filing Checklist",
    description:
      "Understand LLP compliance in India, including Form 8, Form 11, due dates, annual filing checklist, penalties and practical records management for designated partners.",
    keywords:
      "llp compliance india, llp compliance, llp annual filing, form 8 form 11, llp compliance checklist",
    intro:
      "This page is intended for searches around LLP compliance, annual filing, Form 8, Form 11 and the recurring record discipline needed after LLP registration.",
    faqs: [
      {
        q: "What does LLP compliance include each year?",
        a: "Annual LLP compliance typically includes maintaining books and partner records, tracking financial statements, and filing the required annual forms within the applicable deadlines."
      },
      {
        q: "What is an LLP compliance checklist?",
        a: "An LLP compliance checklist usually covers accounting records, partner changes, DSC validity, due-date tracking, Form 8 and Form 11 preparation, and follow-up on any pending filings or penalties."
      }
    ]
  },
  "apeda-registration": {
    title: "APEDA Registration in India: Documents, RCMC Process and Export Readiness Guide",
    description:
      "Learn how APEDA registration works in India, including documents, RCMC process, fees, validity, export-readiness checks and common exporter mistakes.",
    keywords:
      "apeda registration india, apeda registration, apeda documents, rcmc registration, apeda online registration",
    intro:
      "This page is aimed at businesses searching for APEDA registration steps, document lists, RCMC context and export-readiness checks before applying.",
    faqs: [
      {
        q: "What documents are needed for APEDA registration?",
        a: "The document set depends on the business profile, but applicants usually prepare business identity records, bank details, export-related business information and supporting registration evidence."
      },
      {
        q: "What is the role of RCMC in APEDA registration?",
        a: "RCMC is part of the export-recognition context many businesses need to understand before they start selling covered products in relevant markets."
      }
    ]
  }
};

function mergeFaqs(primaryFaqs = [], overrideFaqs = []) {
  const normalized = new Map();

  [...overrideFaqs, ...primaryFaqs].forEach((faq) => {
    if (!faq?.q || !faq?.a) {
      return;
    }

    const key = faq.q.trim().toLowerCase();
    if (!normalized.has(key)) {
      normalized.set(key, faq);
    }
  });

  return Array.from(normalized.values());
}

function IntentSnapshot({ title, body, facts = [], checkpoints = [], onPrimaryAction, primaryLabel, whatsappUrl }) {
  if (!title && !body && facts.length === 0 && checkpoints.length === 0) {
    return null;
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-[#1A56DB]/10 bg-[linear-gradient(135deg,rgba(26,86,219,0.07),rgba(56,189,248,0.04))] p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#1A56DB]">Search intent snapshot</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h2>
          {body ? <p className="mt-4 text-sm leading-7 text-slate-600">{body}</p> : null}
          {facts.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border border-white/80 bg-white/80 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{fact.label}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{fact.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="w-full max-w-xs rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Next step</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">
            Move from search research to a clear document and filing plan.
          </p>
          <button
            type="button"
            onClick={onPrimaryAction}
            className="mt-5 w-full rounded-full bg-[#1A56DB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
          >
            {primaryLabel || "Get Started"}
          </button>
          <a
            href={whatsappUrl || "https://wa.me/917567126945"}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#1A56DB] hover:text-[#1A56DB]"
          >
            WhatsApp An Expert
          </a>
        </div>
      </div>

      {checkpoints.length > 0 ? (
        <div className="mt-6 rounded-[1.75rem] border border-white/80 bg-white/70 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">What to check first</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {checkpoints.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/90 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A56DB]/10 text-[11px] font-black text-[#1A56DB]">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const initialPayload = getInitialServicePayload(slug);
  
  const [openFaq, setOpenFaq] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const { services, loading: cacheLoading, refresh, settings } = useSharedData();
  const [serviceData, setServiceData] = useState(initialPayload?.service || null);
  const [pageLoading, setPageLoading] = useState(!initialPayload?.service);
  const [serviceReviews, setServiceReviews] = useState([]);

  useEffect(() => {
    if (services && services.length > 0) {
      const currentService = services.find(s => s.slug === slug);
      if (currentService) {
        setServiceData(currentService);
      } else if (!initialPayload?.service) {
        setServiceData(null);
      }
      setPageLoading(false);
    } else if (!cacheLoading && !initialPayload?.service) {
      setServiceData(null);
      setPageLoading(false);
    }
  }, [cacheLoading, initialPayload?.service, services, slug]);

  useEffect(() => {
    if (serviceData?.slug === slug) {
      revealPrerenderShell();
    }
  }, [serviceData, slug]);

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

  const seoOverride = SERVICE_SEO_OVERRIDES[slug] || null;
  const faqs = mergeFaqs(serviceData.faqs || [], seoOverride?.faqs || []);
  const processSteps = serviceData.processSteps || [];
  const documentsRequired = serviceData.documentsRequired || [];
  const seoTitle =
    serviceData.seoTitle || seoOverride?.title || `${serviceData.name} Online India - Fast and Affordable | FilingBy`;
  let seoDescription =
    serviceData.seoDescription || seoOverride?.description || serviceData.description || "";
  if (!seoDescription) {
    seoDescription = `Get expert-assisted ${serviceData.name} services online in India. Flat-rate pricing, secure document upload, and 100% compliance guaranteed.`;
  } else if (seoDescription.length < 120) {
    seoDescription = `${seoDescription.trim()} Secure online filing, transparent flat-rate pricing, and dedicated expert support for businesses across India.`;
  }
  if (seoDescription.length > 160) {
    seoDescription = seoDescription.substring(0, 157) + "...";
  }
  const seoKeywords =
    serviceData.seoKeywords ||
    seoOverride?.keywords ||
    `${serviceData.name.toLowerCase()} online, ${serviceData.name.toLowerCase()} registration, online CA services India`;
  const pageDescription = seoOverride?.intro || serviceData.description;
  const snapshotFacts = seoOverride?.quickFacts || [];
  const snapshotCheckpoints = seoOverride?.checkpoints || [];
  const primaryCtaLabel = seoOverride?.primaryCtaLabel || "Get Started";

  return (
    <m.main 
      key={slug}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 text-gray-900"
    >
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={`/services/${slug}`}
        schema={buildServiceSchema({ name: serviceData.name, description: seoDescription, price: serviceData.basePrice?.toString(), url: `/services/${slug}` })}
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

        <h1 className="text-3xl font-black text-slate-950 sm:text-4xl mb-6">
          {seoOverride?.title || `${serviceData.name} Online India`}
        </h1>
 
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-6">
            <ExpertReview updatedDate={serviceData.updatedAt} />
            <IntentSnapshot
              title={seoOverride?.snapshotTitle}
              body={seoOverride?.snapshotBody}
              facts={snapshotFacts}
              checkpoints={snapshotCheckpoints}
              onPrimaryAction={handleGetStarted}
              primaryLabel={primaryCtaLabel}
              whatsappUrl={settings?.ca_whatsapp_url}
            />
            <ServiceOverview name={serviceData.name} description={pageDescription} />
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
                {primaryCtaLabel}
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
