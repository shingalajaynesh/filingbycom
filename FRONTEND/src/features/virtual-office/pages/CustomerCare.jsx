import { useState } from "react";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

export default function CustomerCare() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    orderId: "",
    category: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setTicketId(Math.floor(100000 + Math.random() * 900000));
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title="FilingBy Customer Support & Helpline — 24/7 Compliance Desk"
        description="Need help with your business registration or virtual office address? Get in touch with FilingBy's customer support center. Contact us via phone, email, or chat."
        keywords="FilingBy customer support, contact FilingBy, virtual office help India, CA support email"
        canonical="/customer-care"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Virtual Office", url: "/virtual-space" },
          { name: "Customer Care", url: "/customer-care" }
        ])}
      />
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-24 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-fadeInUp">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
            FilingBy Support Center
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            How Can We Assist You?
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Our compliance desk is operational Monday to Saturday from 9:00 AM to 7:00 PM. Create a support ticket or call our care lines.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-screen-xl mx-auto px-4 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact details - Left Fold */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-black text-gray-900 pb-3">Support Contacts</h3>
            
            <div className="space-y-4 text-xs font-medium text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px] text-gray-400">Call Support Desk</p>
                  <a href="tel:+917567126945" className="text-sm font-bold text-[#1A56DB] hover:underline">+91 75671 26945</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px] text-gray-400">Email Address</p>
                  <a href="mailto:care@filingby.com" className="text-sm font-bold text-[#1A56DB] hover:underline">care@filingby.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">💬</span>
                <div>
                  <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px] text-gray-400">WhatsApp Live Assistant</p>
                  <a href="https://wa.me/917567126945" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-green-600 hover:underline">Chat on WhatsApp</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <div>
                  <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px] text-gray-400">Operating Hours</p>
                  <p className="text-gray-900 text-xs font-semibold">Monday – Saturday: 09:00 AM – 07:00 PM IST</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">Closed on National & Public Holidays</p>
                </div>
              </div>
            </div>
          </div>

          {/* SLA promises */}
          <div className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white rounded-2xl p-6 shadow-sm space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-orange-400">Resolution Commitment</h4>
            <p className="text-xs text-blue-100 leading-relaxed font-medium">
              We aim to review and resolve standard billing and documentation disputes within 2 working hours. Government tax queries are addressed on priority within 12 hours.
            </p>
          </div>
        </div>

        {/* Ticket Submission Form - Right Fold */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8">
          <h3 className="text-lg font-black tracking-tight mb-2">Create a Support Ticket</h3>
          <p className="text-xs text-gray-500 font-medium mb-6">If you are an existing client, please specify your order ID or company name.</p>
          
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <span className="text-4xl text-green-500">📥</span>
              <h4 className="text-xl font-bold text-gray-900">Support Ticket Created</h4>
              <p className="text-xs text-gray-505 font-medium">Your request ID is **#FB-{ticketId}**. A support representative will email or call you shortly.</p>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setTicketId(null);
                }}
                className="px-6 py-2 bg-[#1A56DB] text-white rounded-full font-bold active:scale-95 transition-all text-xs uppercase cursor-pointer"
              >
                Create another ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Mobile No</label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="9999988888"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@email.com"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Order ID (Optional)</label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="e.g. FB-83742"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Help Category</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none bg-white cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="documentation">Missing Rent Agreement / NOC</option>
                  <option value="verification">Assisted Audit Desk / Physical Inspector Query</option>
                  <option value="mail">Incoming Mail Logging/Forwarding Query</option>
                  <option value="billing">Refund / Payment dispute</option>
                  <option value="general">Other queries</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Detailed Message</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your request in detail..."
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F97316] hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/25"
              >
                Submit Support Request
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
