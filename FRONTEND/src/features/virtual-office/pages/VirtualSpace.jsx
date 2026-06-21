import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import SEO from "../../../shared/components/SEO.jsx";
import { virtualOfficeSchema, buildFaqSchema, buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext";
import { optimizeCloudinaryUrl } from "../../../shared/utils/cloudinary.js";

// ─── SVG Icon Library ──────────────────────────────────────────────────────
const Icons = {
  Building: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10M3 9h18M9 3v6M15 3v6"/>
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
    </svg>
  ),
  ShieldCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/>
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  StarOutline: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
  ),
  Lightning: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
    </svg>
  ),
  Trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polyline points="8,21 12,21 16,21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4a2 2 0 00-2 2v3c0 1.5.6 2.8 1.5 3.8"/><path d="M17 4h3a2 2 0 012 2v3c0 1.5-.6 2.8-1.5 3.8"/><path d="M7 4c0 7 2.33 10 5 10s5-3 5-10H7z"/>
    </svg>
  ),
  CreditCard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Clipboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 9.09 19.79 19.79 0 01.88 .4 2 2 0 012.86.02h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  ),
  ArrowUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5,12 12,5 19,12"/>
    </svg>
  ),
  Whatsapp: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.75 3.047 9.383L1.05 30.91l5.7-1.824A15.93 15.93 0 0016.004 32C24.828 32 32 24.822 32 16S24.828 0 16.004 0zm9.28 22.617c-.385 1.086-1.91 1.988-3.13 2.25-.834.178-1.922.32-5.586-1.2-4.688-1.963-7.71-6.72-7.945-7.027-.223-.308-1.883-2.508-1.883-4.781 0-2.273 1.19-3.383 1.61-3.816.386-.4.84-.5 1.12-.5l.808.016c.26.01.613-.098.96.73.386.89 1.313 3.164 1.43 3.393.115.23.19.5.038.808-.15.307-.225.497-.446.766-.224.27-.47.603-.672.81-.224.228-.457.476-.196.932.26.457 1.157 1.908 2.484 3.09 1.707 1.524 3.145 1.996 3.6 2.22.457.222.724.186.99-.112.27-.298 1.154-1.348 1.462-1.81.307-.46.614-.385 1.034-.23.42.154 2.677 1.263 3.134 1.492.457.228.762.342.873.53.11.185.11 1.073-.275 2.16z"/>
    </svg>
  ),
  Package: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  ShoppingCart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
    </svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/><line x1="2" y1="11" x2="22" y2="11"/>
    </svg>
  ),
  IndianRupee: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M6 3h12M6 8h12M6 13l8.5 8L19 13"/><path d="M6 8c0 2.8 2.2 5 5 5h3"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
    </svg>
  ),
};

// ─── Brand Logo Renderer ───────────────────────────────────────────────────
function BrandLogo({ name, imageUrl }) {
  if (imageUrl) {
    return (
      <div className="flex items-center select-none h-6">
        <img src={optimizeCloudinaryUrl(imageUrl)} alt={name} className="h-full object-contain max-w-[120px]" />
      </div>
    );
  }
  const configs = {
    Swiggy:    { bg: "from-orange-500 to-red-500",   letter: "S", color: "text-white", text: "swiggy" },
    Amazon:    { bg: "from-yellow-400 to-orange-400", letter: "a", color: "text-gray-900", text: "amazon" },
    Flipkart:  { bg: "from-blue-500 to-blue-700",    letter: "F", color: "text-yellow-400", text: "Flipkart" },
    Myntra:    { bg: "from-pink-500 to-purple-500",   letter: "M", color: "text-white", text: "Myntra" },
    Meesho:    { bg: "from-pink-400 to-rose-500",     letter: "m", color: "text-white", text: "meesho" },
    JioMart:   { bg: "from-blue-600 to-blue-800",     letter: "J", color: "text-white", text: "JioMart" },
    Blinkit:   { bg: "from-yellow-400 to-yellow-500", letter: "b", color: "text-black", text: "blinkit" },
    Zepto:     { bg: "from-purple-500 to-purple-700", letter: "Z", color: "text-white", text: "zepto" },
    Saregama:  { bg: "from-teal-500 to-teal-700",     letter: "S", color: "text-white", text: "Saregama" },
    Relaxo:    { bg: "from-blue-400 to-blue-600",     letter: "R", color: "text-white", text: "RELAXO" },
    Aramex:    { bg: "from-red-500 to-red-700",       letter: "A", color: "text-white", text: "aramex" },
    HTC:       { bg: "from-green-500 to-green-700",   letter: "H", color: "text-white", text: "HTC" },
  };
  const cfg = configs[name];
  if (!cfg) return <span className="text-gray-700 font-bold text-sm">{name}</span>;
  return (
    <div className="flex items-center gap-2 select-none">
      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${cfg.bg} flex items-center justify-center ${cfg.color} font-black text-xs flex-shrink-0`}>
        {cfg.letter}
      </div>
      <span className="text-gray-800 font-bold text-sm">{cfg.text}</span>
    </div>
  );
}



export default function VirtualSpace() {
  const formRef  = useRef(null);
  const docsRef  = useRef(null);
  const whyUsRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", purpose: "", city: "", message: "" });
  const [submitted,    setSubmitted]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [openFaq,      setOpenFaq]      = useState(null);
  const [showBackTop,  setShowBackTop]  = useState(false);
  const [activeTab,    setActiveTab]    = useState("gst");

  const { submitInquiry, settings } = useSharedData();
  const [dynamicReviews, setDynamicReviews] = useState([]);

  useEffect(() => {
    const fetchHomeReviews = async () => {
      try {
        const API_BASE = (
          import.meta.env.VITE_API_URL || 
          import.meta.env.VITE_BACKEND_URL || 
          "http://localhost:3000"
        ).replace(/\/$/, "");
        const res = await axios.get(`${API_BASE}/reviews?pageType=home&portal=virtual-space`);
        if (res.data.success && res.data.reviews?.length > 0) {
          setDynamicReviews(res.data.reviews);
        }
      } catch (err) {
        console.error("Failed to load dynamic reviews:", err);
      }
    };
    fetchHomeReviews();
  }, []);

  useEffect(() => {
    const fn = () => setShowBackTop(window.scrollY > 300);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await submitInquiry(formData);
      if (data.success) {
        setSubmitted(true);
        toast.success("Inquiry submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit inquiry");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleInput  = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  // ── Data ────────────────────────────────────────────────────────────────
  const clientLogos = settings?.vs_client_logos && settings.vs_client_logos.length > 0
    ? settings.vs_client_logos
    : [
        { name: "Swiggy" }, { name: "Saregama" }, { name: "Relaxo" }, { name: "Aramex" }, { name: "HTC" }, { name: "Flipkart" },
        { name: "Amazon" }, { name: "Myntra" }, { name: "Meesho" }, { name: "JioMart" }, { name: "Blinkit" }, { name: "Zepto" }
      ];

  const officePhotos = settings?.vs_office_photos && settings.vs_office_photos.length > 0
    ? settings.vs_office_photos
    : [
        { name: "Executive Suite Lobby", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
        { name: "Premium Hot Desks", imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80" },
        { name: "Corporate Meeting Boardroom", imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" },
        { name: "Sleek Private Cabins", imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80" },
        { name: "Modern Co-Working Lounge", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80" }
      ];

  const stats = [
    { icon: Icons.Users,     value: "22,000+", label: "Happy Clients",    color: "text-blue-400",   bgColor: "bg-white/10" },
    { icon: Icons.Star,      value: "4.7★",    label: "Google Rating",    color: "text-yellow-400", bgColor: "bg-white/10" },
    { icon: Icons.Globe,     value: "2",        label: "States Covered",   color: "text-emerald-400",  bgColor: "bg-white/10" },
    { icon: Icons.Lightning, value: "7 Days",   label: "Setup Time",       color: "text-blue-300", bgColor: "bg-white/10" },
  ];

  const tabs = [
    {
      id: "gst",
      label: "GST Registration",
      icon: Icons.FileText,
      title: "Virtual Office for GST Registration",
      desc: "Get a legally valid business address accepted by all GST authorities across India. Our virtual office includes all required documents — NOC, utility bills, and rental agreement — to ensure a hassle-free GST registration.",
      features: ["NOC from property owner", "Utility bills included", "Rental agreement provided", "State GST accepted", "Expert filing support"],
      color: "from-[#1A56DB] to-[#1e40af]",
      badge: "Most Popular",
    },
    {
      id: "company",
      label: "Company Registration",
      icon: Icons.Briefcase,
      title: "Virtual Office for Company Registration",
      desc: "Use our premium address as your registered office for Pvt Ltd, LLP, OPC, or any business entity. We provide a prestigious business address that meets all MCA compliance requirements.",
      features: ["MCA-compliant address", "Registered office address", "Director address proof", "Certificate of occupancy", "Supports all business types"],
      color: "from-blue-600 to-indigo-800",
      badge: "Trusted",
    },
    {
      id: "ecommerce",
      label: "E-Commerce Seller",
      icon: Icons.ShoppingCart,
      title: "Virtual Office for E-Commerce Sellers",
      desc: "Register as a seller on Flipkart, Amazon, Meesho, JioMart, and all major platforms. Our address is accepted for VPOB (Virtual Place of Business) and PPOB (Principal Place of Business) registration.",
      features: ["Amazon seller verified", "Flipkart VPOB & PPOB", "All platforms accepted", "GST-ready documents", "Quick 7-day setup"],
      color: "from-indigo-650 to-blue-800",
      badge: "New",
    },
    {
      id: "mailing",
      label: "Mail Handling",
      icon: Icons.Mail,
      title: "Professional Mail Management",
      desc: "Receive all your business correspondence at our prestigious address. Official mail, legal notices, bank letters, and courier deliveries are all handled professionally by our team.",
      features: ["Dedicated mail handling", "Legal notice reception", "Courier acceptance", "Digital scan & forward", "Monthly reporting"],
      color: "from-blue-500 to-indigo-700",
      badge: "Popular",
    },
  ];

  const documents = [
    { icon: Icons.FileText,    title: "No Objection Certificate (NOC)", desc: "Official NOC from property owner validating your business address", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Icons.Lightning,   title: "Utility Bills",                  desc: "Electricity/water bills proving address authenticity for GST",     color: "text-blue-600", bg: "bg-blue-500/10" },
    { icon: Icons.Clipboard,   title: "Rental Agreement",               desc: "Legally stamped agreement between you and the address provider",   color: "text-emerald-500",  bg: "bg-emerald-500/10" },
    { icon: Icons.ShieldCheck, title: "Additional State Documents",     desc: "Any extra paperwork required by specific state GST authorities",   color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  const whyChooseUs = [
    { icon: Icons.Users,       title: "Dedicated Account Manager",     desc: "Personalized support from experts who understand your business",              color: "text-blue-500",   bg: "bg-blue-500/10" },
    { icon: Icons.IndianRupee, title: "Transparent Pricing",           desc: "Clear, honest pricing with absolutely no hidden fees — ever",                  color: "text-emerald-500",  bg: "bg-emerald-500/10" },
    { icon: Icons.Refresh,     title: "Easy Stress-Free Refunds",      desc: "Full no-questions-asked refunds if your GST application has issues",           color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Icons.CheckCircle, title: "Complete Registration Help",    desc: "Expert handling of GST and company registration — swiftly and accurately",     color: "text-blue-500",   bg: "bg-blue-500/10" },
    { icon: Icons.ShieldCheck, title: "Fully Compliant Addresses",     desc: "Government-accepted virtual addresses ensuring seamless business operations",   color: "text-blue-600", bg: "bg-blue-500/10" },
    { icon: Icons.Trophy,      title: "Trusted by 22,000+ Businesses", desc: "Rated 4.7 stars by thousands of businesses, from startups to enterprise brands", color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  const steps = [
    { icon: Icons.Clipboard,   num: "01", title: "Choose Your Plan",         desc: "Browse plans, pick the one that fits your virtual office needs.",          color: "from-blue-500 to-indigo-650"   },
    { icon: Icons.FileText,    num: "02", title: "Submit Documents",          desc: "Our experts guide you through a simple document submission process.",       color: "from-blue-650 to-indigo-800" },
    { icon: Icons.CreditCard,  num: "03", title: "Secure Payment",            desc: "Pay securely online — then leave everything else to us.",                  color: "from-indigo-600 to-blue-800"   },
    { icon: Icons.CheckCircle, num: "04", title: "Virtual Office is Ready",   desc: "Receive your professional address in just 7–10 working days.",             color: "from-emerald-500 to-teal-650"    },
  ];

  const platforms = [
    { name: "Flipkart", icon: Icons.ShoppingCart, color: "from-blue-500 to-blue-700",     bg: "bg-blue-50" },
    { name: "Amazon",   icon: Icons.Package,       color: "from-orange-400 to-orange-600", bg: "bg-orange-50" },
    { name: "Myntra",   icon: Icons.ShoppingCart,  color: "from-pink-500 to-rose-600",     bg: "bg-pink-50" },
    { name: "Meesho",   icon: Icons.Users,         color: "from-purple-500 to-purple-700", bg: "bg-purple-50" },
    { name: "JioMart",  icon: Icons.Globe,         color: "from-blue-600 to-blue-800",     bg: "bg-blue-50" },
    { name: "Blinkit",  icon: Icons.Lightning,     color: "from-yellow-400 to-green-500",  bg: "bg-yellow-50" },
    { name: "Zepto",    icon: Icons.Clock,         color: "from-purple-600 to-pink-600",   bg: "bg-purple-50" },
  ];

  const states = [
    { name: "Gujarat",        city: "Surat",        icon: Icons.Building },
    { name: "Maharashtra",    city: "Mumbai",       icon: Icons.Building },
  ];

  const DEFAULT_REVIEWS = [
    { initials: "AB", color: "bg-blue-600",   name: "Abhishek Tewari", text: "Many thanks to the team for making the whole process so smooth. Fantastic coordination and actively responding to queries. Great team!" },
    { initials: "AA", color: "bg-emerald-600",  name: "Anson Antony",    text: "I had a great experience getting a virtual address. Very helpful throughout the process and made everything smooth and hassle-free. Highly recommended!" },
    { initials: "JP", color: "bg-blue-700", name: "Jaimin Patel",    text: "Highly recommended to anyone wanting a virtual office space. Staff is also very helpful. I got very good responses with all my work." },
    { initials: "AM", color: "bg-indigo-650", name: "Aman",            text: "Great experience with the virtual office space. Reliable and professional service. 5/5. Excellent work and fantastic support really makes them stand out." },
    { initials: "AF", color: "bg-[#0E1528]",   name: "Ashfaq",          text: "Absolutely professional and supportive at every step. Pricing was clear and fair. Felt well taken care of from start to finish. The best!" },
    { initials: "KD", color: "bg-emerald-700",   name: "Kunal Debnath",   text: "Enjoyed the experience and grateful for the streamlined process without any hassles. Price is reasonable. The team is patient and kind." },
  ];

  const faqs = [
    { q: "Who can use a virtual office?",                     a: "Any business, startup, freelancer, or brand looking for a cost-effective, credible address without the expense of a physical office." },
    { q: "Do I get a dedicated phone number?",                a: "Not by default, but you can easily set one up separately through IVR providers. Our team can guide you through the best options." },
    { q: "Will my customers know I'm using a virtual office?",a: "Not at all — your address looks exactly like a professional business center with meeting rooms and reception services." },
    { q: "Do banks accept virtual offices?",                  a: "Yes, most banks in India accept virtual addresses for opening business or individual current accounts." },
    { q: "Can I use it for Amazon, Flipkart, Meesho etc.?",  a: "Absolutely. You can use a virtual address to set up a seller account on any e-commerce platform of your choice." },
    { q: "Can I use it for Google My Business and websites?", a: "Yes, Google accepts virtual addresses for service-area businesses. Perfect for websites, cards, and official communications." },
    { q: "How long does it take to set up?",                  a: "Your virtual office address is ready within 7–10 working days after completing documentation and payment." },
    { q: "Is it valid for GST registration?",                 a: "Yes, our virtual office includes NOC, utility bills, and rental agreement — all documents required for GST registration." },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      <SEO
        title="Virtual Office India — GST Registration Address in Surat & Mumbai | FilingBy"
        description="Get a premium virtual office address in Surat or Mumbai for GST registration, company mailing address, or ecommerce seller registration (VPOB/PPOB). Starting at ₹999/month. NOC & utility bills included."
        keywords="virtual office India, virtual office GST registration, virtual office address India, VPOB registration, virtual office Mumbai, virtual office Surat, virtual office for Amazon seller"
        canonical="/virtual-space"
        schema={virtualOfficeSchema}
        extraSchemas={[
          buildFaqSchema(faqs),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Virtual Office", url: "/virtual-space" }
          ])
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] min-h-[640px] flex items-center relative overflow-hidden py-20 lg:py-28 text-white">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        {/* Glow orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-blue-400/10 blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        {/* Floating icon shapes */}
        <div className="absolute top-16 right-[8%] w-14 h-14 text-blue-400/30 animate-float hidden lg:block"><Icons.Building /></div>
        <div className="absolute top-1/3 right-[3%] w-10 h-10 text-indigo-400/25 animate-float hidden lg:block" style={{animationDelay:"1.2s"}}><Icons.FileText /></div>
        <div className="absolute bottom-16 right-[15%] w-12 h-12 text-blue-300/20 animate-float hidden lg:block" style={{animationDelay:"2.4s"}}><Icons.ShieldCheck /></div>
        <div className="absolute top-24 left-[5%] w-10 h-10 text-indigo-300/20 animate-float hidden lg:block" style={{animationDelay:"0.8s"}}><Icons.Globe /></div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

            {/* LEFT */}
            <div className="lg:col-span-2 text-left animate-fadeInUp">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-6 shadow-md">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-white text-xs font-semibold">🇮🇳 22,000+ Businesses Across India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
                Premium Virtual Offices{" "}
                <span className="text-[#F97316] block mt-1">Across All 28 States</span>
              </h1>

              <p className="text-blue-100 text-base lg:text-lg mb-8 max-w-xl leading-relaxed">
                Stop paying hefty rent just for a business address. Get a prestigious virtual office with all GST-compliant documents — starting under ₹1,000/month.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white/5 backdrop-blur-md rounded-2xl px-3 py-3 text-center hover:bg-white/[0.08] shadow-md transition-all">
                    <div className={`w-6 h-6 mx-auto mb-1 ${s.color}`}><s.icon /></div>
                    <div className="text-white font-black text-lg leading-none">{s.value}</div>
                    <div className="text-blue-200 text-[10px] font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Google Rating */}
              <div className="flex items-center gap-3 w-fit bg-white/5 backdrop-blur-md rounded-2xl px-4 py-3 mb-8 shadow-md">
                <div className="flex gap-0.5">
                  {[1,2,3,4].map(i => <div key={i} className="w-4 h-4 text-yellow-400"><Icons.Star /></div>)}
                  <div className="w-4 h-4 text-yellow-400/50"><Icons.Star /></div>
                </div>
                <span className="text-white font-bold text-sm">4.7</span>
                <span className="text-blue-200 text-xs">· 928 verified reviews</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button id="hero-cta-primary" onClick={scrollToForm}
                  className="bg-[#F97316] text-white px-8 py-3.5 rounded-full font-bold hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer text-sm min-h-[48px]">
                  Get Free Consultation →
                </button>
                <a href={`tel:${settings?.vs_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`}
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/15 transition-all active:scale-95 shadow-md cursor-pointer text-sm min-h-[48px]">
                  <div className="w-4 h-4"><Icons.Phone /></div>
                  Talk to Expert
                </a>
              </div>
            </div>

            {/* RIGHT — Consultation Form */}
            <div ref={formRef} className="lg:col-span-1 bg-white rounded-3xl shadow-2xl shadow-black/40 p-7 text-gray-900">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                    <div className="w-8 h-8"><Icons.CheckCircle /></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-sm text-gray-500 mb-6">Our virtual office expert will call you shortly.</p>
                  <button id="submit-another-btn" onClick={() => { setSubmitted(false); setFormData({ name:"",email:"",mobile:"",purpose:"",city:"",message:"" }); }}
                    className="text-[#1A56DB] hover:text-blue-700 text-sm font-bold hover:underline cursor-pointer">
                    Submit another request
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-xl bg-[#1A56DB] flex items-center justify-center text-white p-1.5"><Icons.Building /></div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">Free Consultation</h3>
                        <p className="text-xs text-gray-400">With our Virtual Office Expert</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {[
                      { name: "name",   type: "text",  placeholder: "Your Name*",    icon: Icons.Users },
                      { name: "email",  type: "email", placeholder: "Email Address*", icon: Icons.Mail },
                      { name: "mobile", type: "tel",   placeholder: "Mobile Number*", icon: Icons.Phone },
                    ].map(f => (
                      <div key={f.name} className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"><f.icon /></div>
                        <input type={f.type} name={f.name} placeholder={f.placeholder} required
                          value={formData[f.name]} onChange={handleInput}
                          className="w-full text-xs font-semibold pl-9 pr-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none" />
                      </div>
                    ))}
                    <select name="purpose" required value={formData.purpose} onChange={handleInput}
                      className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none cursor-pointer">
                      <option value="">Purpose*</option>
                      <option value="Mailing Address">Mailing Address</option>
                      <option value="GST Registration">GST Registration</option>
                      <option value="Company + GST Registration">Company + GST Registration</option>
                      <option value="Ecommerce (VPOB & PPOB)">Ecommerce (VPOB &amp; PPOB)</option>
                    </select>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"><Icons.MapPin /></div>
                      <input type="text" name="city" placeholder="Preferred City*" required
                        value={formData.city} onChange={handleInput}
                        className="w-full text-xs font-semibold pl-9 pr-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none" />
                    </div>
                    <textarea name="message" placeholder="Message (optional)" rows={2}
                      value={formData.message} onChange={handleInput}
                      className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none resize-none" />
                    <button type="submit" id="form-submit-btn" disabled={submitting}
                      className="bg-[#1A56DB] text-white w-full py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 cursor-pointer min-h-[48px] shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                      {submitting ? "Submitting..." : "Get Free Consultation →"}
                    </button>
                  </form>

                  <div className="flex justify-between mt-4 pt-4 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.05)]">
                    {[
                      { icon: Icons.Lock,         label: "100% Secure" },
                      { icon: Icons.Lightning,     label: "Quick Response" },
                      { icon: Icons.CheckCircle,   label: "Free" },
                    ].map(t => (
                      <div key={t.label} className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                        <div className="w-3 h-3 text-green-500"><t.icon /></div>
                        {t.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          LOGO TICKER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-10 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Trusted by India's leading brands</p>
          <h2 className="text-xl font-bold text-gray-900 mt-1">22,000+ Virtual Office Clients Served &amp; Counting</h2>
        </div>
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-20 before:bg-gradient-to-r before:from-white before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-20 after:bg-gradient-to-l after:from-white after:to-transparent after:z-10">
          <div className="flex animate-ticker whitespace-nowrap">
            {[...clientLogos,...clientLogos].map((logo, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl px-5 py-3 flex-shrink-0 mx-2 hover:bg-[#1A56DB]/5 transition-all duration-200 cursor-default shadow-sm">
                <BrandLogo name={logo.name} imageUrl={logo.imageUrl} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TABS — USE CASES
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-[#1A56DB]">Use Cases</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">What Can You Use a Virtual Office For?</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">One address, infinite possibilities — pick your use case below</p>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#1A56DB] text-white shadow-lg shadow-blue-500/25"
                    : "bg-white text-gray-650 hover:bg-[#1A56DB]/5 hover:text-[#1A56DB] shadow-sm"
                }`}>
                <div className="w-4 h-4"><tab.icon /></div>
                {tab.label}
                {tab.badge && activeTab !== tab.id && (
                  <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTabData && (
            <div className="bg-white rounded-3xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left */}
                <div className={`bg-gradient-to-br ${activeTabData.color} p-10 text-white flex flex-col justify-center`}>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl p-3 mb-6">
                    <activeTabData.icon />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{activeTabData.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{activeTabData.desc}</p>
                  <button onClick={scrollToForm}
                    className="mt-8 self-start bg-white text-gray-900 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50 transition-all active:scale-95 cursor-pointer shadow-lg">
                    Get Started →
                  </button>
                </div>
                {/* Right */}
                <div className="p-10 flex flex-col justify-center">
                  <h4 className="font-bold text-gray-900 text-lg mb-6">What's Included</h4>
                  <div className="space-y-4">
                    {activeTabData.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0 p-1">
                          <Icons.Check />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-blue-50 rounded-2xl shadow-sm">
                    <p className="text-xs text-blue-700 font-semibold">💡 Pro Tip: Our team will guide you through every step — from document collection to final approval.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-green-50 text-green-600">Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">Get Your Virtual Office in 4 Simple Steps</h2>
            <p className="text-gray-500 text-sm mt-2">Zero hassle. Our experts handle everything.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 z-0" />

            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 sm:p-7 text-center hover:shadow-md transition-all duration-300 relative z-10 group shadow-sm">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} mx-auto mb-5 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-250 p-3`}>
                  <step.icon />
                </div>
                <div className="absolute top-4 right-4 text-xs font-black text-gray-200">{step.num}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button id="process-cta-btn" onClick={scrollToForm}
              className="bg-[#F97316] text-white px-8 py-3.5 rounded-full font-bold hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer min-h-[48px]">
              Start Your Virtual Office Today →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DYNAMIC OFFICE GALLERY
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-16 overflow-hidden border-t border-slate-100">
        <div className="max-w-screen-xl mx-auto px-4 mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A56DB] bg-blue-50 px-3.5 py-1.5 rounded-full">
            Our Premium Infrastructure
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight leading-tight">
            Vibrant, Compliance-Ready Workspace Environments
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-medium">
            Explore our state-of-the-art office locations featuring professional boardrooms, high-speed connectivity, and modern business lounges.
          </p>
        </div>
        
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-20 before:bg-gradient-to-r before:from-slate-50 before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-20 after:bg-gradient-to-l after:from-slate-50 after:to-transparent after:z-10">
          <div className="flex animate-ticker whitespace-nowrap gap-4">
            {officePhotos.map((photo, i) => (
              <div key={i} className="w-80 h-52 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <img src={optimizeCloudinaryUrl(photo.imageUrl)} alt={photo.name || "Office Space"} className="w-full h-full object-cover select-none" />
              </div>
            ))}
            {/* Loop for infinite scroll */}
            {officePhotos.map((photo, i) => (
              <div key={`dup-${i}`} className="w-80 h-52 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <img src={optimizeCloudinaryUrl(photo.imageUrl)} alt={photo.name || "Office Space"} className="w-full h-full object-cover select-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DOCUMENTS SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section ref={docsRef} className="bg-gray-50 py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-[#1A56DB]">Documents</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">Everything Included in Your Package</h2>
            <p className="text-gray-500 text-sm mt-2">All documents required for GST & company registration — bundled in</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            {/* Left: Visual card */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] rounded-3xl p-10 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="w-24 h-24 mx-auto mb-6 text-blue-300/80 relative z-10"><Icons.FileText /></div>
              <h3 className="text-white text-xl font-bold mb-2 relative z-10">All Documents Included</h3>
              <p className="text-blue-200 text-sm relative z-10">Official, government-accepted paperwork — ready for you</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 relative z-10">
                {["GST Ready","MCA Compliant","Bank Accepted","Court Valid"].map(tag => (
                  <span key={tag} className="bg-white/5 text-white/80 text-[10px] font-semibold px-3 py-1 rounded-full shadow-sm">{tag}</span>
                ))}
              </div>
            </div>

            {/* Right: Document list */}
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 hover:shadow-md shadow-sm transition-all duration-300 group flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${doc.bg} flex items-center justify-center ${doc.color} flex-shrink-0 p-2.5 group-hover:scale-110 transition-transform`}>
                    <doc.icon />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#1A56DB] transition-colors">{doc.title}</h4>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{doc.desc}</p>
                  </div>
                  <div className="ml-auto flex-shrink-0 w-5 h-5 text-emerald-500 mt-0.5"><Icons.CheckCircle /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          E-COMMERCE PLATFORMS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-purple-50 text-purple-600">E-Commerce</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">Register on Any Platform with Our Address</h2>
            <p className="text-gray-500 text-sm mt-2">Accepted as VPOB & PPOB on all major Indian e-commerce platforms</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {platforms.map((p) => (
              <div key={p.name} onClick={scrollToForm}
                className="bg-white rounded-2xl p-5 text-center hover:shadow-md shadow-sm transition-all duration-300 group active:scale-95 cursor-pointer flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-200 p-3`}>
                  <p.icon />
                </div>
                <p className="text-xs font-bold text-gray-800">{p.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">+ Nykaa, Snapdeal, AJIO, Indiamart and 50+ more platforms</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          WHY CHOOSE US — Dark Section
      ══════════════════════════════════════════════════════════════════ */}
      <section ref={whyUsRef} className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] py-20 sm:py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-[#60a5fa] bg-blue-500/10 shadow-sm">Why FilingBy</span>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mt-3">Why 22,000+ Businesses Choose FilingBy</h2>
            <p className="text-blue-300 text-sm mt-2">The most trusted virtual office provider in India</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((f, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white/5 hover:bg-white/[0.08] transition-all duration-300 group cursor-default shadow-md">
                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${f.color} mb-5 p-2.5 group-hover:scale-110 transition-transform`}>
                  <f.icon />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{f.title}</h3>
                <p className="text-sm text-blue-200/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Active States Coverage GRID
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">Available States Coverage</h2>
            <p className="text-gray-500 text-sm mt-2">Premium virtual office address options in Gujarat and Maharashtra</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            {states.map((state) => (
              <div key={state.name} onClick={scrollToForm}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center gap-3 active:scale-95 group justify-center">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1A56DB] flex-shrink-0 group-hover:bg-blue-100 transition-colors p-2 shadow-sm">
                  <Icons.MapPin />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{state.name}</p>
                  <p className="text-gray-400 text-xs">{state.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-50 text-yellow-600">Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">Highly Rated Virtual Office Service</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {[1,2,3,4].map(i => <div key={i} className="w-5 h-5 text-yellow-400"><Icons.Star /></div>)}
                <div className="w-5 h-5 text-yellow-300"><Icons.Star /></div>
              </div>
              <span className="text-gray-600 text-sm font-semibold">4.7 / 5 · 928 Google Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(dynamicReviews.length > 0 ? dynamicReviews : DEFAULT_REVIEWS).map((rev, i) => {
              const name = rev.authorName || rev.name;
              const text = rev.comment || rev.text;
              const rating = rev.rating || 5;
              const initials = rev.initials || name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
              const color = rev.color || "bg-[#1A56DB]";
              const designation = rev.businessName || "Virtual Office Client";

              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: rating }).map((_, s) => (
                        <div key={s} className="w-4 h-4 text-yellow-400"><Icons.Star /></div>
                      ))}
                      {Array.from({ length: 5 - rating }).map((_, s) => (
                        <div key={s} className="w-4 h-4 text-gray-250"><Icons.Star /></div>
                      ))}
                    </div>
                    <p className="mb-6 text-sm leading-relaxed text-gray-600 italic">"{text}"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0 shadow-sm ${color}`}>
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
                      <p className="text-xs text-gray-400">{designation}</p>
                    </div>
                    <div className="ml-auto w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.CheckCircle /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-200 text-gray-700">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm mt-2">Everything you need to know about virtual offices</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${openFaq === i ? "shadow-md bg-blue-50/30" : "hover:shadow-md"}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer focus:outline-none gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === i ? "bg-[#1A56DB] text-white" : "bg-gray-100 text-gray-500"} p-1`}>
                      <Icons.FileText />
                    </div>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">{faq.q}</span>
                  </div>
                  <div className={`w-5 h-5 text-[#1A56DB] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>
                    <Icons.ChevronDown />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pl-14 animate-fadeInUp">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] py-20 sm:py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-650/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 text-blue-300/30"><Icons.Building /></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
            Ready to Get Your<br />
            <span className="text-[#F97316]">Premium Virtual Office?</span>
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Join 22,000+ businesses who trust FilingBy for a credible, government-accepted business address across India.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button id="final-cta-primary" onClick={scrollToForm}
              className="w-full sm:w-auto rounded-full bg-[#F97316] text-white px-8 py-3.5 text-sm font-bold hover:bg-orange-500 transition-all active:scale-95 cursor-pointer min-h-[48px] shadow-lg shadow-orange-500/20">
              Get Free Consultation →
            </button>
            <a href={`tel:${settings?.vs_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`} id="final-cta-secondary"
              className="w-full sm:w-auto rounded-full bg-white/10 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/15 transition-all active:scale-95 text-center min-h-[48px] flex items-center justify-center gap-2 shadow-md">
              <div className="w-4 h-4"><Icons.Phone /></div>
              Talk to Expert
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {[
              { icon: Icons.Check, label: "All Documents Included" },
              { icon: Icons.Globe, label: "28 States Covered" },
              { icon: Icons.Lightning, label: "7-Day Setup" },
              { icon: Icons.ShieldCheck, label: "100% Compliant" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-xs text-gray-350 font-medium">
                <div className="w-4 h-4 text-emerald-400"><b.icon /></div>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FLOATING ELEMENTS
      ══════════════════════════════════════════════════════════════════ */}

      {/* WhatsApp */}
      <div className="fixed bottom-6 right-5 z-50 group">
        <div className="pointer-events-none absolute bottom-16 right-0 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Chat with us on WhatsApp
        </div>
        <a href={settings?.vs_whatsapp_url ? `${settings.vs_whatsapp_url}?text=Hi%2C%20I%20need%20help%20with%20a%20virtual%20office%20on%20FilingBy.com` : "https://wa.me/917567126945?text=Hi%2C%20I%20need%20help%20with%20a%20virtual%20office%20on%20FilingBy.com"}
          target="_blank" rel="noopener noreferrer"
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-green-500/30 transition-transform duration-300 hover:scale-110"
          title="Chat on WhatsApp">
          <div className="w-7 h-7"><Icons.Whatsapp /></div>
        </a>
      </div>

      {/* Back to Top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"
        className={`fixed bottom-24 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A56DB] text-white shadow-lg transition-all duration-300 hover:bg-blue-700 p-2.5 ${
          showBackTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}>
        <Icons.ArrowUp />
      </button>

    </main>
  );
}
