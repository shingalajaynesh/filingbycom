import { useState } from "react";
import { Link } from "react-router-dom";

const KNOWLEDGE_RESPONSES = [
  {
    keywords: ["gst", "goods and services tax", "gst registration", "gst file"],
    reply: "GST registration is usually required once your business crosses the applicable threshold or enters situations like interstate supply and marketplace selling.",
    service: { name: "GST Registration", slug: "gst-registration" },
    calc: { name: "GST Tax Calculator", path: "/gst-calculator" },
    template: { name: "Commercial Rent Agreement", path: "/templates/rent-agreement" },
  },
  {
    keywords: ["company", "private limited", "pvt ltd", "incorporation", "llp", "partnership"],
    reply: "A private limited company is usually preferred for fundraising and scale, while an LLP can work well for lean service businesses with multiple founders.",
    service: { name: "Private Limited Company Setup", slug: "private-limited-company" },
    calc: { name: "Asset Depreciation Tool", path: "/calculators/depreciation" },
    template: { name: "Mutual Non-Disclosure Agreement (NDA)", path: "/templates/nda" },
  },
  {
    keywords: ["trademark", "patent", "copyright", "brand name", "logo"],
    reply: "Trademark protection helps secure your brand name, logo, and identity before someone else gets too close to your market position.",
    service: { name: "Trademark Registration", slug: "trademark-registration" },
    calc: { name: "Trademark Search Directory", path: "/trademark-search" },
    template: { name: "Employment Agreement Draft", path: "/templates/employment-agreement" },
  },
  {
    keywords: ["tax", "income tax", "itr", "tds", "tax filing", "late fee"],
    reply: "Income tax and TDS work best when you treat them as a recurring system, not a last-day task. Clean records make the next filing much easier.",
    service: { name: "Income Tax Return (ITR) Filing", slug: "itr-filing" },
    calc: { name: "Income Tax Calculator", path: "/income-tax-calculator" },
    template: { name: "Salary Slip Format Draft", path: "/templates/salary-slip" },
  },
];

function AssistantIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3 4 7.5v6L12 21l8-7.5v-6L12 3Z" />
      <path d="M9.5 10.25h5M8.75 13.5h6.5" />
    </svg>
  );
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello. I am your FilingBy AI assistant. Ask about GST, company setup, trademark, TDS, or filings and I will point you to the right next step.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    setTimeout(() => {
      const match = KNOWLEDGE_RESPONSES.find((item) =>
        item.keywords.some((kw) => userMessage.toLowerCase().includes(kw))
      );

      setMessages((prev) => [
        ...prev,
        match
          ? {
              sender: "ai",
              text: match.reply,
              service: match.service,
              calc: match.calc,
              template: match.template,
            }
          : {
              sender: "ai",
              text: "I could not find a precise match yet. A good next step is to open the relevant service page or request expert help from the team.",
            },
      ]);
    }, 500);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {isOpen ? (
        <div className="flex h-[30rem] w-[22rem] flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] animate-fadeIn">
          <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1A56DB_72%,#38bdf8_100%)] p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <AssistantIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-100">AI Desk</p>
                  <p className="text-sm font-black">FilingBy Compliance Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border-none bg-white/10 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/20 cursor-pointer"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-sky-50/90">
              Start here for quick routing to the right guide, tool, service, or template.
            </p>
          </div>

          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-600">Available now</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f8fbff] p-4 text-[11px] font-medium text-slate-700">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] rounded-3xl p-3 leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-[#1A56DB] text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <p>{m.text}</p>
                  {(m.service || m.calc || m.template) && (
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                      <span className="block text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
                        Recommended next step
                      </span>
                      {m.service ? (
                        <Link to={`/services/${m.service.slug}`} className="block font-bold text-[#1A56DB] hover:underline">
                          Explore: {m.service.name}
                        </Link>
                      ) : null}
                      {m.calc ? (
                        <Link to={m.calc.path} className="block font-bold text-[#1A56DB] hover:underline">
                          Use tool: {m.calc.name}
                        </Link>
                      ) : null}
                      {m.template ? (
                        <Link to={m.template.path} className="block font-bold text-[#1A56DB] hover:underline">
                          Open template: {m.template.name}
                        </Link>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about GST, company setup, tax..."
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-[#1A56DB] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-2xl border-none bg-[#1A56DB] px-4 py-2 text-xs font-bold text-white cursor-pointer hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#1A56DB_72%,#38bdf8_100%)] text-white shadow-[0_18px_38px_rgba(26,86,219,0.35)] transition-all hover:-translate-y-1 cursor-pointer"
          aria-label="Open FilingBy AI assistant"
        >
          <div className="flex flex-col items-center justify-center">
            <AssistantIcon />
            <span className="mt-1 text-[9px] font-black uppercase tracking-[0.2em]">AI</span>
          </div>
        </button>
      )}
    </div>
  );
}
