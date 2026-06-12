import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0a1628] text-gray-300 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Dot overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand info */}
          <div className="space-y-4">
            <a href="/" className="inline-flex items-center bg-white/5 rounded-xl px-3.5 py-2 border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-xl font-extrabold text-[#1A56DB]">FilingBy</span>
              <span className="text-xl font-extrabold text-[#F97316]">.com</span>
            </a>
            <p className="text-sm text-blue-100/70 leading-relaxed">
              Expert CA & CS assisted compliance services for Indian businesses. Fast, secure, transparent, and completely online.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
                <a
                  key={platform}
                  href={`https://${platform}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center border border-white/10 transition-all active:scale-95"
                  aria-label={platform}
                >
                  <span className="text-sm capitalize">{platform[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Popular Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Popular Services
            </h4>
            <ul className="space-y-2 text-sm text-blue-100/75">
              {[
                { label: 'Private Limited Company', slug: 'private-limited-company' },
                { label: 'LLP Registration', slug: 'llp-registration' },
                { label: 'GST Registration', slug: 'gst-registration' },
                { label: 'Trademark Registration', slug: 'trademark-registration' },
                { label: 'ITR Return Filing', slug: 'itr-1-filing' },
              ].map((link) => (
                <li key={link.slug}>
                  <button
                    onClick={() => navigate(`/services/${link.slug}`)}
                    className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-blue-100/75">
              {[
                { label: 'Home', path: '/' },
                { label: 'Locations Directory', path: '/locations' },
                { label: 'For E-commerce', path: '/virtual-office-ecommerce' },
                { label: 'About Us', path: '/about-us' },
                { label: 'Our Promise', path: '/our-promise' },
                { label: 'Customer Care', path: '/customer-care' },
                { label: 'FAQs', path: '/faq' },
                { label: 'Partner Onboarding', path: '/partner-onboarding' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Contact Us
            </h4>
            <div className="space-y-2 text-sm text-blue-100/75">
              <p className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+917567126945" className="hover:text-white transition-colors">+91 75671 26945</a>
              </p>
              <p className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:info@filingby.com" className="hover:text-white transition-colors">info@filingby.com</a>
              </p>
              <p className="flex items-start gap-2 leading-relaxed">
                <span className="mt-1">📍</span>
                <span>3rd Floor, Business Center, New Delhi, India</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-100/50">
          <p>© 2026 FilingBy.com. All rights reserved.</p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy', path: '/default/privacy-policy' },
              { label: 'Terms of Service', path: '/terms-conditions' },
              { label: 'Refund Policy', path: '/default/refund' },
            ].map((policy) => (
              <button
                key={policy.label}
                onClick={() => navigate(policy.path)}
                className="hover:text-white transition-colors cursor-pointer text-xs"
              >
                {policy.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
