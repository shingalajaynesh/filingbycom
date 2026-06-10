import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search.jsx";
import PopularServices from "../components/PopularServices.jsx";
import { navData } from "../data/navigation.js";
import { allServices } from "../data/services.js";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-12 text-white  sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur">
            🇮🇳 India's Trusted Legal & Compliance Platform
          </div>
          <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Start, Manage & Grow Your Business
          </h1>
          <p className="mx-auto mb-8 max-w-2xl px-2 text-sm text-blue-100 sm:text-base md:text-lg">
            Expert CA & CS assisted services for GST, Company Registration,
            Trademark, ITR Filing & 100+ more compliance services — 100% online.
          </p>

          <Search />

          <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-4 sm:max-w-2xl sm:grid-cols-4 sm:gap-6">
            {["50,000+", "4.9★", "100+", "10+"].map((value, idx) => (
              <div key={value} className="text-center text-white">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-blue-200">
                  {
                    [
                      "Happy Clients",
                      "Google Rating",
                      "Services",
                      "Years Experience",
                    ][idx]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
        <PopularServices />
      </section>
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-1 text-sm text-gray-500">
            Simple, fast and fully online from start to finish
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              [
                "📝",
                "Fill the Form",
                "Share your basic details and select your service online in minutes.",
              ],
              [
                "📤",
                "Upload Documents",
                "Securely upload required documents from anywhere.",
              ],
              [
                "✅",
                "Get It Done",
                "Our expert CA/CS team processes and delivers your certificate.",
              ],
            ].map(([icon, title, desc]) => (
              <article
                key={title}
                className="mx-auto max-w-xs text-center md:max-w-none"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl sm:h-16 sm:w-16">
                  {icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-[#0F172A] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Why 50,000+ Businesses Trust FilingBy
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {[
              [
                "👨‍💼",
                "Expert CA & CS Team",
                "Qualified professionals with 10+ years experience",
              ],
              [
                "⚡",
                "Fast Processing",
                "Most services processed within 1-3 working days",
              ],
              [
                "💰",
                "Transparent Pricing",
                "No hidden charges. Fixed price, what you see is what you pay",
              ],
              [
                "🔒",
                "100% Secure",
                "Your data is encrypted and completely confidential",
              ],
            ].map(([icon, title, desc]) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:bg-white/10"
              >
                <div className="mb-3 text-2xl">{icon}</div>
                <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
                  {title}
                </h3>
                <p className="text-sm text-blue-100">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-screen-xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            What Our Clients Say
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              [
                "⭐⭐⭐⭐⭐",
                "FilingBy handled our GST registration and company incorporation seamlessly. Highly professional team!",
                "Rahul Mehta",
                "Mehta Enterprises",
              ],
              [
                "⭐⭐⭐⭐⭐",
                "Got our trademark registered in just 3 days. The process was completely online and hassle-free.",
                "Priya Sharma",
                "PS Fashion Studio",
              ],
              [
                "⭐⭐⭐⭐⭐",
                "Their CA team files our monthly GST returns on time every month. No stress, no penalties!",
                "Vikram Patel",
                "Patel Trading Co.",
              ],
            ].map(([stars, quote, name, biz]) => (
              <article
                key={name}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm sm:p-6"
              >
                <p className="mb-4 text-yellow-400">{stars}</p>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 italic">
                  "{quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#1A56DB]">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {name}
                    </p>
                    <p className="text-xs text-gray-500">{biz}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#1A56DB] to-[#1e40af] px-4 py-12 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            Ready to Start Your Business Journey?
          </h2>
          <p className="mb-8 text-blue-100">
            Join 50,000+ entrepreneurs who trust FilingBy.com
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1A56DB] sm:w-auto sm:px-8"
            >
              Get Started Free
            </button>
            <button className="w-full rounded-full border-2 border-white px-6 py-3 text-sm font-medium text-white sm:w-auto sm:px-8">
              Talk to Expert
            </button>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-5 z-50 group">
        <div className="pointer-events-none absolute bottom-16 right-0 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          💬 Chat with us!
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
        </div>
        <a
          href="https://wa.me/917567126945?text=Hi%2C%20I%20need%20help%20with%20a%20service%20on%20FilingBy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="wa-blob-btn flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-110"
          title="Chat with us on WhatsApp"
        >
          <svg
            viewBox="0 0 32 32"
            className="wa-icon-ring h-7 w-7 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.75 3.047 9.383L1.05 30.91l5.7-1.824A15.93 15.93 0 0016.004 32C24.828 32 32 24.822 32 16S24.828 0 16.004 0zm9.28 22.617c-.385 1.086-1.91 1.988-3.13 2.25-.834.178-1.922.32-5.586-1.2-4.688-1.963-7.71-6.72-7.945-7.027-.223-.308-1.883-2.508-1.883-4.781 0-2.273 1.19-3.383 1.61-3.816.386-.4.84-.5 1.12-.5l.808.016c.26.01.613-.098.96.73.386.89 1.313 3.164 1.43 3.393.115.23.19.5.038.808-.15.307-.225.497-.446.766-.224.27-.47.603-.672.81-.224.228-.457.476-.196.932.26.457 1.157 1.908 2.484 3.09 1.707 1.524 3.145 1.996 3.6 2.22.457.222.724.186.99-.112.27-.298 1.154-1.348 1.462-1.81.307-.46.614-.385 1.034-.23.42.154 2.677 1.263 3.134 1.492.457.228.762.342.873.53.11.185.11 1.073-.275 2.16z" />
          </svg>
        </a>
      </div>
    </main>
  );
}
