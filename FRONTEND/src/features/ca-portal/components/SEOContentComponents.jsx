import { useState } from "react";
import { Link } from "react-router-dom";

// Clean and safe HTML sanitizer that runs consistently in Node and browser
function sanitizeHtml(html) {
  if (!html) return "";
  let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  cleaned = cleaned.replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"');
  cleaned = cleaned.replace(/\son[a-z]+\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\son[a-z]+\s*=\s*([^\s>]+)/gi, "");
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  return cleaned;
}

export function ServiceOverview({ name, description }) {
  const sanitized = sanitizeHtml(description);
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#1A56DB]">Overview</p>
      <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">About {name}</h2>
      {sanitized ? (
        <div 
          className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      ) : (
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Secure your {name} online with FilingBy. Our expert team of Chartered Accountants (CA) and Company Secretaries (CS) manages the entire application, drafting, and regulatory approvals.
        </p>
      )}
    </article>
  );
}

export function ServiceBenefits({ name, benefits }) {
  const defaultBenefits = [
    { title: "100% Tax Compliance", desc: "Ensure complete adherence to GST, Income Tax, and ROC filing deadlines." },
    { title: "Legal Liability Protection", desc: "Protect your personal assets through structured corporate entities." },
    { title: "Better Brand Trust", desc: "Raise capital, secure loans, and win corporate clients with transparent registration." },
    { title: "Expert CA Consultation", desc: "On-demand guidance from qualified CA and CS professionals throughout the lifecycle." }
  ];

  const items = benefits && benefits.length > 0 
    ? benefits.map((b) => ({ title: b, desc: `Key advantage of getting your ${name} done with our certified compliance team.` }))
    : defaultBenefits;

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#1A56DB]">Benefits</p>
      <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Key Benefits of {name}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <span className="text-slate-800 text-sm font-extrabold">{item.title}</span>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function ServiceDocuments({ documents }) {
  const defaultDocs = [
    "PAN Card of all Directors/Partners",
    "Aadhaar Card or Passport of Directors/Partners",
    "Utility Bill of Registered Office Address (not older than 2 months)",
    "No-Objection Certificate (NOC) from Property Owner",
    "Passport size Photograph of all applicants"
  ];

  const items = documents && documents.length > 0 ? documents : defaultDocs;

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Documents Required for Filing</h2>
      <p className="text-xs text-slate-500 mt-1">Make sure you have scanned copies of these documents ready:</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600">✓</span>
            <span className="text-xs font-medium text-slate-700">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ServiceTimeline({ steps }) {
  const defaultSteps = [
    "Consultation & Document Submission: Share details with our legal advisor.",
    "Form Preparation & Draft Review: We prepare legal drafts and file name approval requests.",
    "Govt Portal Submission: Application is filed on the official government registry portal.",
    "Approval & Certificate Delivery: Receive your registration license digitally."
  ];

  const items = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Registration Process & Timeline</h2>
      <p className="text-xs text-slate-500 mt-1">Our streamlined CA-guided compliance steps:</p>
      <div className="mt-6 space-y-4">
        {items.map((step, index) => (
          <div key={index} className="flex gap-4 rounded-2xl bg-slate-50 p-4 items-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A56DB] text-xs font-black text-white">{index + 1}</span>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function ServiceFees({ basePrice, name }) {
  const govtFee = Math.round(basePrice * 0.4);
  const profFee = basePrice;
  const total = govtFee + profFee;

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Transparent Pricing & Fee Breakup</h2>
      <p className="text-xs text-slate-500 mt-1">No hidden charges. Clear split of your {name} registration costs:</p>
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 font-black text-slate-800">Fee Component</th>
              <th className="p-4 font-black text-slate-800 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-4 text-slate-600">Professional & Filing Fees (FilingBy CA Panel)</td>
              <td className="p-4 text-slate-800 font-bold text-right">₹{profFee.toLocaleString("en-IN")}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 text-slate-600">Estimated Govt. Fees & Taxes</td>
              <td className="p-4 text-slate-800 font-bold text-right">₹{govtFee.toLocaleString("en-IN")}</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-4 font-black text-slate-900">Total Investment</td>
              <td className="p-4 text-[#1A56DB] font-black text-sm text-right">₹{total.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function ServiceFAQ({ faqs, openFaq, setOpenFaq }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
      <p className="text-xs text-slate-500 mt-1">Got questions? Find direct answers regarding this registration:</p>
      <div className="mt-5 space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              className="flex w-full items-center justify-between text-left text-xs font-black text-slate-800 cursor-pointer"
            >
              {faq.q}
              <span className="text-[#1A56DB] font-extrabold">{openFaq === index ? "−" : "+"}</span>
            </button>
            {openFaq === index && (
              <p className="mt-3 text-xs text-slate-600 leading-relaxed font-medium">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

export function RelatedServices({ services, currentCategory, currentSlug }) {
  const related = services
    .filter(s => s.category === currentCategory && s.slug !== currentSlug && s.isActive !== false)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 mt-6">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Related Services</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((service) => (
          <Link
            key={service.slug}
            to={`/services/${service.slug}`}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:border-blue-500 hover:bg-blue-50/10 transition-all group"
          >
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">{service.name}</span>
            <span className="text-[10px] font-black text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RelatedBlogs({ currentCategory }) {
  const categoryLabel = currentCategory || "compliance";
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 mt-6">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Latest Guides & Updates</h3>
      <div className="mt-4">
        <Link
          to="/blog"
          aria-label={`Explore FilingBy Knowledge Hub guides for ${categoryLabel}`}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:border-blue-500 hover:bg-blue-50/10 transition-all group"
        >
          <div>
            <span className="block text-xs font-bold text-slate-700 group-hover:text-blue-600">FilingBy Knowledge Hub</span>
            <span className="block text-[10px] text-slate-400 mt-1">Read expert legal and tax guides on {categoryLabel}</span>
          </div>
          <span className="text-xs font-black text-[#1A56DB]">Explore guides</span>
        </Link>
      </div>
    </div>
  );
}

export function ComparisonTable({ slug }) {
  const comparisons = {
    "private-limited-company": {
      title: "Private Limited vs LLP Registration",
      heads: ["Feature", "Private Limited Company", "Limited Liability Partnership (LLP)"],
      rows: [
        ["Liability", "Limited to capital contribution", "Limited to capital contribution"],
        ["Ownership transfer", "Easy via share transfer", "Requires agreement modification"],
        ["Funding option", "Excellent (VCS, Angels favor shares)", "Moderate (Debt, partners equity only)"],
        ["Annual Audits", "Mandatory from registration", "Mandatory if turnover exceeds ₹40L"]
      ]
    },
    "llp-registration": {
      title: "LLP vs OPC Registration",
      heads: ["Feature", "LLP (Partnership)", "One Person Company (OPC)"],
      rows: [
        ["Min Partners", "Minimum 2 partners", "Exactly 1 shareholder + 1 nominee"],
        ["Governance", "Governed by LLP Agreement", "Governed by MOA & AOA"],
        ["Tax Rates", "Flat 30% tax rate", "Effective tax starts from 15% / 22%"]
      ]
    }
  };

  const comp = comparisons[slug];
  if (!comp) return null;

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{comp.title}</h3>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {comp.heads.map((h, i) => (
                <th key={i} className="p-4 font-black text-slate-800">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comp.rows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                {row.map((cell, cidx) => (
                  <td key={cidx} className={`p-4 ${cidx === 0 ? "font-bold text-slate-700" : "text-slate-600"}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function CTASection({ name, whatsappUrl, phone }) {
  const [callbackName, setCallbackName] = useState("");
  const [callbackMobile, setCallbackMobile] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!callbackName.trim() || !callbackMobile.trim()) return;
    setSuccess(true);
    setTimeout(() => {
      setCallbackName("");
      setCallbackMobile("");
      setSuccess(false);
    }, 4000);
  };

  return (
    <article className="rounded-3xl border border-[#1A56DB] bg-white p-6 shadow-lg sm:p-8 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-40 pointer-events-none" />
      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">Quick Action</span>
      <h2 className="mt-4 text-2xl font-black text-slate-900">Need help incorporating your {name}?</h2>
      <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">Get on a free 15-minute consultation call with our legal expert to clarify fees and procedures.</p>

      {success ? (
        <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
          <span className="text-emerald-700 text-xs font-bold">✓ Call Request Received! We will get in touch shortly.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            required
            placeholder="Your Name"
            value={callbackName}
            onChange={(e) => setCallbackName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-50"
          />
          <input
            type="tel"
            required
            placeholder="Mobile Number"
            value={callbackMobile}
            onChange={(e) => setCallbackMobile(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-50"
          />
          <button
            type="submit"
            className="w-full bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-bold transition-all cursor-pointer border-0"
          >
            Request Callback
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
        <a
          href={whatsappUrl || "https://wa.me/917567126945"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-green-500 px-4 py-3.5 text-xs font-bold text-green-600 hover:bg-green-50/50"
        >
          WhatsApp Now
        </a>
        <a
          href={`tel:${phone?.replace(/\s+/g, "") || "+917567126945"}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          Call Advisor
        </a>
      </div>
    </article>
  );
}

export function ExpertReview({ updatedDate }) {
  const formattedDate = updatedDate
    ? new Date(updatedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row items-center gap-4 text-left">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-[#1A56DB]">FB</div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-800">Editorially reviewed by FilingBy Content Team</span>
          <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase">Editorial Review</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Last updated on {formattedDate}</p>
      </div>
    </article>
  );
}
