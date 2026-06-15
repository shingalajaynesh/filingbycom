import { useEffect, useRef, useState } from 'react';
import SEO from "../../../shared/components/SEO.jsx";

/* ─────────────────────────────────────────────
   Brand Tokens  (FilingBy.com palette)
   Navy: #0A192F  |  Gold: #D4AF37  |  Blue-accent: #1A56DB
   Navy: #0A192F  |  Gold: #D4AF37  |  Blue-accent: #1A56DB
───────────────────────────────────────────── */

const TOKEN = {
  navy: '#0A192F',
  navyMid: '#112240',
  gold: '#D4AF37',
  blue: '#1A56DB',
  white: '#FFFFFF',
  bgBody: '#F0F4FF',
  bgCard: '#F8F9FA',
  textMain: '#1f2937',
  textMuted: '#6b7280',
  whatsapp: '#25D366',
  instagram: '#E1306C',
  facebook: '#1877F2',
  email: '#EA4335',
};

/* ─── inline styles ─── */
const S = {
  body: {
    backgroundColor: TOKEN.bgBody,
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    WebkitTapHighlightColor: 'transparent',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: TOKEN.white,
    minHeight: '100vh',
    position: 'relative',
    boxShadow: '0 0 30px rgba(10,25,47,0.08)',
    paddingBottom: 48,
  },
  coverBanner: {
    height: 185,
    background: `linear-gradient(135deg, ${TOKEN.navy} 0%, ${TOKEN.navyMid} 55%, #1A56DB 100%)`,
    position: 'relative',
    overflow: 'hidden',
  },
  coverPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(212,175,55,0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(26,86,219,0.2) 0%, transparent 40%),
      radial-gradient(circle at 60% 80%, rgba(212,175,55,0.08) 0%, transparent 35%)
    `,
  },
  coverGridLines: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 34px, rgba(255,255,255,0.03) 34px, rgba(255,255,255,0.03) 35px),
      repeating-linear-gradient(90deg, transparent, transparent 34px, rgba(255,255,255,0.03) 34px, rgba(255,255,255,0.03) 35px)
    `,
  },
  coverBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '35%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)',
  },
  coverBrandBadge: {
    position: 'absolute',
    top: 18,
    right: 18,
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: '5px 12px',
    color: TOKEN.white,
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    zIndex: 3,
  },
  coverTitle: {
    position: 'absolute',
    bottom: 14,
    left: 20,
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    zIndex: 3,
  },

  /* profile photo */
  profileContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: -60,
    position: 'relative',
    zIndex: 4,
  },
  profileRing: {
    width: 128,
    height: 128,
    borderRadius: '50%',
    padding: 4,
    background: `linear-gradient(135deg, ${TOKEN.gold}, ${TOKEN.blue})`,
    boxShadow: '0 6px 24px rgba(10,25,47,0.2)',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `3px solid ${TOKEN.white}`,
    backgroundColor: TOKEN.white,
  },

  /* info section */
  infoSection: {
    textAlign: 'center',
    padding: '14px 28px 4px',
  },
  nameText: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: TOKEN.navy,
    marginBottom: 4,
    letterSpacing: '-0.01em',
  },
  titleText: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: TOKEN.gold,
    marginBottom: 4,
    letterSpacing: '0.02em',
  },
  locationText: {
    fontSize: '0.82rem',
    color: TOKEN.textMuted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 4,
  },

  /* service pills */
  pillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    padding: '12px 22px 6px',
  },
  pill: {
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    background: `rgba(10,25,47,0.06)`,
    color: TOKEN.navy,
    letterSpacing: '0.02em',
  },

  /* divider */
  divider: {
    height: 1,
    background: 'linear-gradient(to right, transparent, rgba(10,25,47,0.08), transparent)',
    margin: '10px 25px',
  },

  /* actions row */
  actionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 14,
    padding: '18px 25px',
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: TOKEN.white,
    fontSize: '1.15rem',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    flexShrink: 0,
  },

  /* contact list */
  contactList: {
    padding: '0 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 16px',
    backgroundColor: TOKEN.bgCard,
    borderRadius: 14,
    textDecoration: 'none',
    color: TOKEN.textMain,
    transition: 'background-color 0.18s ease, transform 0.15s ease',
    border: '1px solid rgba(10,25,47,0.05)',
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: `linear-gradient(135deg, rgba(10,25,47,0.08), rgba(26,86,219,0.08))`,
    color: TOKEN.navy,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.05rem',
    flexShrink: 0,
  },
  contactText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  contactLabel: {
    fontSize: '0.72rem',
    color: TOKEN.textMuted,
    marginBottom: 2,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  contactValue: {
    fontSize: '0.92rem',
    fontWeight: 600,
    color: TOKEN.textMain,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  /* primary actions */
  primaryActions: {
    padding: '26px 22px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  btnPrimary: {
    width: '100%',
    padding: '15px 20px',
    borderRadius: 14,
    border: 'none',
    background: `linear-gradient(135deg, ${TOKEN.navy} 0%, #1E3A8A 100%)`,
    color: TOKEN.white,
    fontSize: '0.97rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(10,25,47,0.25)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    letterSpacing: '0.01em',
  },
  btnSecondary: {
    width: '100%',
    padding: '15px 20px',
    borderRadius: 14,
    border: `2px solid ${TOKEN.navy}`,
    backgroundColor: 'transparent',
    color: TOKEN.navy,
    fontSize: '0.97rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    cursor: 'pointer',
    transition: 'background-color 0.18s ease, transform 0.18s ease',
    letterSpacing: '0.01em',
  },

  /* footer strip */
  footerStrip: {
    marginTop: 30,
    padding: '14px 22px',
    background: `linear-gradient(135deg, ${TOKEN.navy} 0%, #112240 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  footerBrand: {
    color: TOKEN.gold,
    fontWeight: 700,
    fontSize: '0.8rem',
  },

  /* toast */
  toast: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%) translateY(80px)',
    background: `linear-gradient(135deg, ${TOKEN.navy}, #1E3A8A)`,
    color: TOKEN.white,
    padding: '12px 24px',
    borderRadius: 10,
    fontSize: '0.88rem',
    fontWeight: 500,
    zIndex: 9999,
    opacity: 0,
    pointerEvents: 'none',
    boxShadow: '0 6px 20px rgba(10,25,47,0.3)',
    transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.32s ease',
    whiteSpace: 'nowrap',
  },
  toastShow: {
    transform: 'translateX(-50%) translateY(0)',
    opacity: 1,
  },
};

/* ─── Social icons helper ─── */
const SocialIcon = ({ href, bg, icon, label, target = '_blank' }) => {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      target={target}
      rel="noopener noreferrer"
      style={{
        ...S.actionBtn,
        background: bg,
        transform: hover ? 'translateY(-3px) scale(1.08)' : 'none',
        boxShadow: hover ? '0 8px 20px rgba(0,0,0,0.22)' : S.actionBtn.boxShadow,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <i className={icon} />
    </a>
  );
};

/* ─── Contact row helper ─── */
const ContactItem = ({ href, icon, label, value, valueStyle, target }) => {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      className="contact-item"
      target={target}
      rel={target ? 'noopener noreferrer' : undefined}
      style={{
        ...S.contactItem,
        backgroundColor: hover ? '#E8EEF8' : TOKEN.bgCard,
        transform: hover ? 'translateX(3px)' : 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={S.contactIcon}><i className={icon} /></div>
      <div style={S.contactText}>
        <span style={S.contactLabel}>{label}</span>
        <span style={{ ...S.contactValue, ...valueStyle }}>{value}</span>
      </div>
    </a>
  );
};

/* ══════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════ */
export default function DigitalCard() {
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  /* scroll to top on mount, hide main nav scroll behaviour */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function showToast(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  }

  /* vCard download */
  function handleSaveContact() {
    const vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:FilingBy.com\r\nORG:FilingBy.com\r\nTITLE:Business Registration & Compliance Experts\r\nTEL;TYPE=WORK,VOICE:+917567126945\r\nEMAIL;TYPE=WORK:support@filingby.com\r\nURL:https://filingby.com\r\nADR;TYPE=WORK:;;Surat;Gujarat;;India\r\nNOTE:India's trusted platform for business registration, GST, ITR, Trademark & all compliance needs.\r\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FilingBy.vcf';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showToast('✅ Contact saved!');
  }

  /* Web Share / clipboard fallback */
  async function handleShare() {
    const shareData = {
      title: 'FilingBy.com — Business Registration & Compliance',
      text: `Check out FilingBy.com — India's trusted platform for company registration, GST, ITR & more.`,
      url: 'https://filingby.com',
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText('https://filingby.com');
        showToast('🔗 Link copied to clipboard!');
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = 'https://filingby.com';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('🔗 Link copied to clipboard!');
      }
    }
  }

  /* responsive: desktop card centering */
  const isWide = typeof window !== 'undefined' && window.innerWidth > 430;
  const containerExtras = isWide
    ? { minHeight: 'auto', borderRadius: 22, overflow: 'hidden' }
    : {};

  return (
    <>
      <SEO
        title="FilingBy.com Digital Business Card — Contact Info & Services"
        description="Connect with FilingBy.com. Download our contact card (vCard), chat on WhatsApp, or view our legal & compliance services. We assist with GST, ITR, company incorporation, and virtual office addresses."
        keywords="FilingBy business card, FilingBy contact details, CA services Surat, digital business card"
        canonical="/digital-card"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "FilingBy.com Digital Business Card",
          "description": "Contact information and compliance services details for FilingBy.com.",
          "url": "https://filingby.com/digital-card"
        }}
      />
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div style={{ ...S.body, padding: isWide ? '40px 20px' : 0, alignItems: isWide ? 'center' : 'flex-start' }}>
        <div style={{ ...S.cardContainer, ...containerExtras }}>

          {/* ── Cover Banner ── */}
          <div style={S.coverBanner}>
            <div style={S.coverPattern} />
            <div style={S.coverGridLines} />
            <div style={S.coverBottom} />

            {/* floating brand badge */}
            <div style={S.coverBrandBadge}>FilingBy.com</div>

            {/* bottom tagline */}
            <div style={S.coverTitle}>India's Compliance Partner</div>

            {/* decorative gold accent circle */}
            <div style={{
              position: 'absolute', bottom: -30, right: -30, width: 120, height: 120,
              borderRadius: '50%', border: `2px solid rgba(212,175,55,0.3)`, zIndex: 1,
            }} />
            <div style={{
              position: 'absolute', top: 20, left: -20, width: 80, height: 80,
              borderRadius: '50%', border: `1px solid rgba(255,255,255,0.1)`, zIndex: 1,
            }} />
          </div>

          {/* ── Profile Photo ── */}
          <div style={S.profileContainer}>
            <div style={S.profileRing}>
              <img
                src="/logo.jpeg"
                alt="FilingBy.com Logo"
                style={S.profilePhoto}
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=FB&background=0A192F&color=D4AF37&size=200&bold=true';
                }}
              />
            </div>
          </div>

          {/* ── Info Section ── */}
          <div style={S.infoSection}>
            <h1 style={S.nameText}>FilingBy.com</h1>
            <h2 style={S.titleText}>Business Registration & Compliance Experts</h2>
            <div style={S.locationText}>
              <i className="fas fa-map-marker-alt" style={{ color: TOKEN.gold, fontSize: '0.8rem' }} />
              Surat, Gujarat · Pan-India Services
            </div>
          </div>

          {/* ── Service Pills ── */}
          <div style={S.pillsRow}>
            {['GST', 'ITR Filing', 'Trademark', 'Company Reg.', 'MCA / ROC', 'Accounting'].map(s => (
              <span key={s} style={S.pill}>{s}</span>
            ))}
          </div>

          <div style={S.divider} />

          {/* ── Social Icons ── */}
          <div style={S.actionsRow}>
            <SocialIcon
              href="https://wa.me/917567126945"
              bg={TOKEN.whatsapp}
              icon="fab fa-whatsapp"
              label="WhatsApp"
            />
            <SocialIcon
              href="https://instagram.com/filingbycom"
              bg="linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
              icon="fab fa-instagram"
              label="Instagram"
            />
            <SocialIcon
              href="https://facebook.com/filingbycom"
              bg={TOKEN.facebook}
              icon="fab fa-facebook-f"
              label="Facebook"
            />
            <SocialIcon
              href="mailto:support@filingby.com"
              bg={TOKEN.email}
              icon="fas fa-envelope"
              label="Email"
              target="_self"
            />
            <SocialIcon
              href="https://filingby.com"
              bg={`linear-gradient(135deg, ${TOKEN.navy}, #1A56DB)`}
              icon="fas fa-globe"
              label="Website"
            />
          </div>

          {/* ── Contact Details ── */}
          <div style={S.contactList}>
            <ContactItem
              href="tel:+917567126945"
              icon="fas fa-phone-alt"
              label="Mobile"
              value="+91 7567126945"
            />
            <ContactItem
              href="mailto:support@filingby.com"
              icon="fas fa-envelope"
              label="Email"
              value="support@filingby.com"
            />
            <ContactItem
              href="https://filingby.com"
              icon="fas fa-globe"
              label="Website"
              value="filingby.com"
              target="_blank"
            />
            <ContactItem
              href="https://wa.me/917567126945"
              icon="fab fa-whatsapp"
              label="WhatsApp"
              value="+91 7567126945"
              target="_blank"
            />
            <ContactItem
              href="https://www.google.com/maps/search/Surat+Gujarat"
              icon="fas fa-map-marker-alt"
              label="Location"
              value="Surat, Gujarat — Pan-India Services"
              valueStyle={{ fontSize: '0.85rem', lineHeight: 1.35 }}
              target="_blank"
            />
          </div>

          {/* ── Primary Actions ── */}
          <div style={S.primaryActions}>
            <PrimaryButton
              icon="fas fa-user-plus"
              label="Save Contact"
              style={S.btnPrimary}
              hoverExtra={{ boxShadow: '0 8px 28px rgba(10,25,47,0.35)', transform: 'scale(0.98)' }}
              onClick={handleSaveContact}
            />
            <SecondaryButton
              icon="fas fa-share-alt"
              label="Share Card"
              style={S.btnSecondary}
              onClick={handleShare}
            />
          </div>

          {/* ── Footer strip ── */}
          <div style={S.footerStrip}>
            <i className="fas fa-shield-alt" style={{ color: TOKEN.gold, fontSize: '0.85rem' }} />
            <span style={S.footerText}>Trusted by 10,000+ businesses across India</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        style={{ ...S.toast, ...(toastVisible ? S.toastShow : {}) }}
      >
        {toastMsg}
      </div>
    </>
  );
}

/* ── Reusable button helpers ── */
function PrimaryButton({ icon, label, style, hoverExtra, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{ ...style, ...(hover ? hoverExtra : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <i className={icon} />
      {label}
    </button>
  );
}

function SecondaryButton({ icon, label, style, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{
        ...style,
        backgroundColor: hover ? 'rgba(10,25,47,0.06)' : 'transparent',
        transform: hover ? 'scale(0.98)' : 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <i className={icon} />
      {label}
    </button>
  );
}
