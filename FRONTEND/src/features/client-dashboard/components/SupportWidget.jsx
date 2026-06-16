import { useState } from 'react';

export default function SupportWidget() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const contactOptions = [
    {
      title: "WhatsApp Chat",
      value: "Chat on WhatsApp",
      detail: "Get instant assistance",
      icon: "💬",
      color: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
      onClick: () => window.open('https://wa.me/917567126945', '_blank')
    },
    {
      title: "Call Helpline",
      value: "+91 75671 26945",
      detail: "Mon-Sat, 9AM to 7PM",
      icon: "📞",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
      onClick: () => window.open('tel:+917567126945')
    },
    {
      title: "Email Support",
      value: "support@filingby.com",
      detail: "Response within 24 hours",
      icon: "✉️",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700",
      onClick: () => window.open('mailto:support@filingby.com')
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject) {
      alert("Please select a subject.");
      return;
    }
    if (!message.trim()) {
      alert("Please write your message detailing the issue.");
      return;
    }

    // Simulate ticket creation
    const randomTicketId = 'TKT' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomTicketId);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubject('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">

      {/* Section 1: Contact Options Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
          Get in Touch Instantly
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactOptions.map((opt, i) => (
            <div
              key={i}
              onClick={opt.onClick}
              className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md flex flex-col items-start text-left ${opt.color}`}
            >
              <span className="text-3xl mb-3">{opt.icon}</span>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {opt.title}
              </p>
              <h4 className="font-bold text-sm sm:text-base mt-1">
                {opt.value}
              </h4>
              <p className="text-xs mt-1 opacity-75">
                {opt.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Ticket Form Container */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Raise a Support Ticket
              </h3>
              <p className="text-xs text-gray-450 mt-1">
                Our support team and designated CAs will review your query and reply within a few hours.
              </p>
            </div>

            {/* Subject Dropdown */}
            <div className="space-y-1">
              <label htmlFor="subject" className="text-xs font-bold text-gray-600 uppercase">
                Subject Category
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-11 cursor-pointer"
              >
                <option value="">-- Select Issue Category --</option>
                <option value="GST Issue">GST Issue / GSTR Filing Query</option>
                <option value="Company Registration">Company / LLP Registration</option>
                <option value="Document Issue">Document Checklist / Verification Issue</option>
                <option value="Payment Issue">Payment Failure / Invoice Request</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            {/* Message Area */}
            <div className="space-y-1">
              <label htmlFor="message" className="text-xs font-bold text-gray-600 uppercase">
                Detailed Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your issue details here, specifying order numbers if relevant..."
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1A56DB] hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-blue-500/10 transition-all min-h-11 flex items-center justify-center cursor-pointer"
              >
                🎟️ Submit Support Ticket
              </button>
            </div>
          </form>
        ) : (
          /* Ticket Created State */
          <div className="text-center py-6 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Ticket Raised Successfully!
            </h3>
            <div className="bg-gray-50 rounded-xl p-3.5 my-4 border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Ticket Reference ID
              </p>
              <p className="text-lg font-bold text-[#1A56DB] tracking-wider mt-0.5">
                {ticketId}
              </p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Your ticket category is <span className="font-semibold text-gray-800">"{subject}"</span>. A customer representative is analyzing the logs and will reach back shortly.
            </p>
            <button
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-full transition-all min-h-11 inline-flex items-center justify-center cursor-pointer"
            >
              Raise Another Query
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
