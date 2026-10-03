import { ReactNode } from 'react';

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7M10 11v6m4-6v6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    x: <path d="m6 6 12 12M18 6 6 18"/>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    code: <path d="m8 9-4 3 4 3m8-6 4 3-4 3m-3-9-2 12"/>,
    layers: <><path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
    brain: <><path d="M9.5 4A3.5 3.5 0 0 0 6 7.5v.7A3.5 3.5 0 0 0 4 14.5 3.5 3.5 0 0 0 7.5 18H9"/><path d="M14.5 4A3.5 3.5 0 0 1 18 7.5v.7a3.5 3.5 0 0 1 2 6.3 3.5 3.5 0 0 1-3.5 3.5H15M9 4v16m6-16v16M9 9H7m8 3h3M9 15H7"/></>,
    checklist: <><path d="m4 6 2 2 4-4M4 12l2 2 4-4M4 18l2 2 4-4M13 7h7M13 13h7M13 19h7"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>,
    atom: <><circle cx="12" cy="12" r="1.5"/><path d="M19.4 15c1.2-2.1-1-5.6-4.9-7.9S6.6 4.8 5.4 7s1 5.6 4.9 7.9 7.9 2.3 9.1.1z"/><path d="M19.4 9c-1.2-2.1-5.2-2.1-9.1.1S4.2 14.9 5.4 17s5.2 2.1 9.1-.1 6.1-5.8 4.9-7.9z"/></>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
