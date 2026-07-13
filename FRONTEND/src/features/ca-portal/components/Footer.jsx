import { useNavigate } from 'react-router-dom';
import { useSharedData } from '../../../shared/context/SharedDataContext';

const platformIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
};

export default function Footer() {
  const navigate = useNavigate();
  const { settings } = useSharedData();

  return (
    <footer className="bg-[#0a1628] text-gray-300 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Dot overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand info */}
          <div className="space-y-4">
            <a href="/" className="inline-flex items-center bg-white/5 rounded-xl px-3.5 py-2 border border-white/10 hover:bg-white/10 transition-colors">
              <img src="/logo.png" alt="FilingBy.com" className="h-8 w-auto object-contain" />
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
                  {platformIcons[platform]}
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
                { label: 'GST Calculator', path: '/gst-calculator' },
                { label: 'Income Tax Calculator', path: '/income-tax-calculator' },
                { label: 'ROC Tools', path: '/roc-tools' },
                { label: 'Knowledge Hub (Blog)', path: '/blog' },
                { label: 'Company Registration Guides', path: '/company-registration-guides' },
                { label: 'Trademark Search', path: '/trademark-search' },
                { label: 'Legal Templates', path: '/legal-templates' },
                { label: 'Locations Directory', path: '/locations' },
                { label: 'For E-commerce', path: '/virtual-office-ecommerce' },
                { label: 'About Us', path: '/about-us' },
                { label: 'Our Promise', path: '/our-promise' },
                { label: 'Contact Us', path: '/contact-us' },
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
                <a href={`tel:${settings?.ca_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`} className="hover:text-white transition-colors">
                  {settings?.ca_contact_phone || "+91 75671 26945"}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span>📧</span>
                <a href={`mailto:${settings?.ca_contact_email || "support@filingby.com"}`} className="hover:text-white transition-colors">
                  {settings?.ca_contact_email || "support@filingby.com"}
                </a>
              </p>
              <p className="flex items-start gap-2 leading-relaxed">
                <span className="mt-1">📍</span>
                <span>{settings?.ca_contact_address || "3rd Floor, Business Center, New Delhi, India"}</span>
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
