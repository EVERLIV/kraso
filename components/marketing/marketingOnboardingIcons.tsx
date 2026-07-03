import React from 'react';

export function OnboardCursorIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
            <path d="M6 4l12 5.5-5 1.8L11 18z" fill="#fff" />
            <path d="M17 5.5l1.5-1.5M19 9h2M15 3v-1" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

export function OnboardPlayIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
            <rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="#fff" strokeWidth="1.8" />
            <path d="M10 9.5v5l4-2.5z" fill="#fff" />
        </svg>
    );
}

export function OnboardGlobeIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" className="shrink-0" aria-hidden>
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path
                d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
            />
        </svg>
    );
}

export function OnboardUploadIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path
                d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
