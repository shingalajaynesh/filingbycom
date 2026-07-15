import { useState } from "react";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";
import { trackEvent } from "../../../shared/utils/gtm";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const { settings } = useSharedData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject/Category is required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setTicketId(Math.floor(100000 + Math.random() * 900000));
      setSubmitted(true);
      trackEvent("contact_form_submit", {
        form_name: "contact_us",
        subject: formData.subject
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title="Contact Us — FilingBy.com | Customer Support & Business Desk"
        description="Have queries about GST registration, company incorporation, or virtual offices? Contact the FilingBy team via phone, email, or chat for expert support."
        keywords="contact FilingBy, FilingBy phone number, GST registration support, CA portal help, corporate address support"
        canonical="/contact-us"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact-us" },
        ])}
      />
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-24 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-fadeInUp">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Contact Our Compliance Experts
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Need guidance with business registration, CA consultations, or virtual offices? We are here to assist you from Monday to Saturday, 9:00 AM to 7:00 PM IST.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-screen-xl mx-auto px-4 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Contact details - Left Fold */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">Corporate Desk</h3>

            <div className="space-y-4 text-xs font-medium text-gray-650">
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">📞</span>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Call Support Helpline</p>
                  <a href={`tel:${settings?.ca_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`} className="text-sm font-bold text-[#1A56DB] hover:underline">
                    {settings?.ca_contact_phone || "+91 75671 26945"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">📧</span>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Email Coordinates</p>
                  <a href={`mailto:${settings?.ca_contact_email || "support@filingby.com"}`} className="text-sm font-bold text-[#1A56DB] hover:underline">
                    {settings?.ca_contact_email || "support@filingby.com"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">💬</span>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">WhatsApp Live Assistant</p>
                  <a href={settings?.vs_whatsapp_url || "https://wa.me/917567126945"} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-green-600 hover:underline">
                    Chat with an expert
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">📍</span>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Headquarters Address</p>
                  <p className="text-gray-900 text-xs font-semibold leading-relaxed">
                    {settings?.ca_contact_address || "3rd Floor, Business Center, New Delhi, India"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">⏰</span>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Desk Operating Hours</p>
                  <p className="text-gray-900 text-xs font-semibold">Monday – Saturday: 09:00 AM – 07:00 PM IST</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">Closed on National and Gazetted Holidays</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Box */}
          <div className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white rounded-2xl p-6 shadow-sm space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-orange-400">Response SLA Commitment</h4>
            <p className="text-xs text-blue-100 leading-relaxed font-medium">
              We verify and respond to GST, company registration, and trademark queries within 2 hours. Our panel of CAs and CSs ensures that all technical advice is fully compliant with current government rules.
            </p>
          </div>
        </div>

        {/* Form - Right Fold */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8">
          <h3 className="text-lg font-black tracking-tight mb-2">Send us a Message</h3>
          <p className="text-xs text-gray-500 font-medium mb-6">Fill out the form below and one of our CAs or legal representatives will contact you shortly.</p>

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fadeIn">
              <span className="text-5xl text-green-500">📥</span>
              <h4 className="text-xl font-bold text-gray-900">Message Received Successfully</h4>
              <p className="text-xs text-gray-650 font-medium">
                We have registered your query under ID **#FB-{ticketId}**. A representative will call or email you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setTicketId(null);
                  setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });
                }}
                className="px-6 py-2 bg-[#1A56DB] hover:bg-blue-700 text-white rounded-full font-bold active:scale-95 transition-all text-xs uppercase cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="9999988888"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                  {errors.mobile && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.mobile}</p>}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                />
                {errors.email && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Query Subject / Service Category</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none bg-white cursor-pointer"
                >
                  <option value="">Select a category</option>
                  <option value="GST Registration">GST Registration / Amendment</option>
                  <option value="Company Registration">Company or LLP Registration</option>
                  <option value="Virtual Office Address">Virtual Office Leases</option>
                  <option value="ITR & Tax Filing">Income Tax Return Filing</option>
                  <option value="Trademark & Logo">Trademark Search or Filing</option>
                  <option value="Other Service">Other CA / Compliance queries</option>
                </select>
                {errors.subject && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Message Details</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe what services you need help with..."
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none resize-none"
                ></textarea>
                {errors.message && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F97316] hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/25 border-0"
              >
                Send Inquiry Request
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
