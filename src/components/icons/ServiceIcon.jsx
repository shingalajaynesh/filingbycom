export default function ServiceIcon({ name }) {
    const iconClass = 'h-5 w-5';

    switch (name) {
        case 'building':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21V7l8-3v17" />
                    <path d="M12 4l8 3v14" />
                    <path d="M8 10h1" />
                    <path d="M8 14h1" />
                    <path d="M8 18h1" />
                    <path d="M15 10h1" />
                    <path d="M15 14h1" />
                    <path d="M15 18h1" />
                </svg>
            );
        case 'document':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 3h7l5 5v13H7z" />
                    <path d="M14 3v5h5" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                </svg>
            );
        case 'trademark':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 9h3" />
                    <path d="M9.5 9v6" />
                    <path d="M13 9l2 6 2-6" />
                    <path d="M15 15v-6" />
                    <path d="M15 9h2.5" />
                </svg>
            );
        case 'wallet':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7h16v10H6a2 2 0 0 1-2-2V7z" />
                    <path d="M4 7a2 2 0 0 1 2-2h12v4H6a2 2 0 0 1-2-2z" />
                    <path d="M15.5 12h2" />
                </svg>
            );
        case 'handshake':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 12l2.5 2.5a2 2 0 0 0 2.8 0L18 10" />
                    <path d="M2 12l4-4 3 3" />
                    <path d="M22 12l-4-4-3 3" />
                    <path d="M7 15l2 2" />
                </svg>
            );
        case 'chart':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19h16" />
                    <path d="M6 16V9" />
                    <path d="M11 16V6" />
                    <path d="M16 16v-5" />
                    <path d="M6 16h10" />
                </svg>
            );
        case 'file':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 3h7l5 5v13H7z" />
                    <path d="M14 3v5h5" />
                    <path d="M9 13h6" />
                </svg>
            );
        case 'globe':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M4 12h16" />
                    <path d="M12 4c2.5 2.7 2.5 13.3 0 16" />
                    <path d="M12 4c-2.5 2.7-2.5 13.3 0 16" />
                </svg>
            );
        case 'receipt':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
                    <path d="M9 8h6" />
                    <path d="M9 12h6" />
                </svg>
            );
        case 'landmark':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10h16" />
                    <path d="M6 10v8" />
                    <path d="M10 10v8" />
                    <path d="M14 10v8" />
                    <path d="M18 10v8" />
                    <path d="M3 18h18" />
                    <path d="M12 4l8 6H4z" />
                </svg>
            );
        case 'scale':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M5 7h14" />
                    <path d="M7 7l-3 5h6z" />
                    <path d="M17 7l-3 5h6z" />
                    <path d="M8 21h8" />
                </svg>
            );
        default:
            return null;
    }
}