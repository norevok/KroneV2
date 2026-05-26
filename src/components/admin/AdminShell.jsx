/**
 * AdminShell — Shared layout wrapper for all admin pages.
 * Provides sidebar navigation (desktop) + mobile drawer + header.
 * No auto-refresh. No polling. Manual only.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  UtensilsCrossed, BedDouble, MessageSquare, FileText, Briefcase, Gift,
  LayoutDashboard, Calendar, BookOpen, Sparkles, Users, Activity, Zap,
  Shield, Clock, Image, Tag, ChevronRight, Menu, X, ArrowLeft,
  RefreshCw, AlertTriangle
} from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const NAV_GROUPS = [
  {
    label: 'Hauptbereich',
    items: [
      { to: '/admin', label: 'Übersicht', icon: LayoutDashboard, exact: true },
      { to: '/admin/reservations', label: 'Reservierungen', icon: UtensilsCrossed },
      { to: '/admin/guests', label: 'Gäste', icon: Users },
      { to: '/admin/beds24-bookings', label: 'Hotelbuchungen', icon: BedDouble },
    ],
  },
  {
    label: 'Kommunikation',
    items: [
      { to: '/admin/calendar', label: 'Kalender', icon: Calendar },
      { to: '/admin/guest-calendar', label: 'Gäste-Kalender', icon: Users },
      { to: '/admin/events', label: 'Events', icon: Sparkles },
    ],
  },
  {
    label: 'Inhalte',
    items: [
      { to: '/admin/menu', label: 'Speisekarte', icon: BookOpen },
      { to: '/admin/hero', label: 'Hero-Slides', icon: Image },
      { to: '/admin/offers', label: 'Angebote', icon: Tag },
      { to: '/admin/opening-hours', label: 'Öffnungszeiten', icon: Clock },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/beds24', label: 'Beds24 Sync', icon: BedDouble },
      { to: '/admin/audit', label: 'Audit-Log', icon: Activity },
      { to: '/admin/credits', label: 'Credit-Architektur', icon: Zap },
      { to: '/admin/credit-dashboard', label: 'Credit-Monitor', icon: Shield },
    ],
  },
];

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all group ${
        active
          ? 'bg-[#C9A96E]/15 text-[#C9A96E] font-semibold border border-[#C9A96E]/20'
          : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#C9A96E]' : 'text-white/30 group-hover:text-white/60'}`} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export default function AdminShell({ children, title, subtitle, onRefresh, loading, badge }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function isActive(item) {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  }

  return (
    <div className="min-h-screen bg-[#0F0D0B] text-white flex">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0 bg-[#141210] border-r border-white/8 fixed top-0 left-0 h-screen overflow-y-auto z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/8">
          <Link to="/" className="flex flex-col">
            <p className="font-display text-base font-light tracking-[0.12em] text-white uppercase">Krone Langenburg</p>
            <p className="text-[#C9A96E] text-[9px] tracking-[0.3em] uppercase font-body mt-0.5">by Ammesso · Admin</p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-white/20 text-[9px] tracking-[0.3em] uppercase font-body font-semibold px-3 mb-1.5">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <NavItem key={item.to} item={item} active={isActive(item)} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-3.5 h-3.5 text-[#C9A96E]" />
            </div>
            <div className="min-w-0">
              <p className="text-white/60 text-[10px] font-body truncate">{user?.email || '…'}</p>
              <p className="text-white/25 text-[9px] font-body">Admin</p>
            </div>
          </div>
          <Link to="/" className="mt-3 flex items-center gap-1.5 text-white/25 hover:text-white/50 text-[10px] font-body transition-colors">
            <ArrowLeft className="w-3 h-3" /> Zur Website
          </Link>
        </div>
      </aside>

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-[#141210] border-r border-white/8 flex flex-col overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="px-5 py-5 border-b border-white/8 flex items-center justify-between">
              <div>
                <p className="font-display text-base font-light text-white uppercase tracking-wider">Krone Admin</p>
                <p className="text-[#C9A96E] text-[9px] tracking-[0.3em] uppercase font-body mt-0.5">by Ammesso</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
              {NAV_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-white/20 text-[9px] tracking-[0.3em] uppercase font-body font-semibold px-3 mb-1.5">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.map(item => (
                      <NavItem key={item.to} item={item} active={isActive(item)} onClick={() => setMobileOpen(false)} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="px-4 py-4 border-t border-white/8">
              <Link to="/" className="flex items-center gap-1.5 text-white/25 hover:text-white/50 text-[10px] font-body transition-colors">
                <ArrowLeft className="w-3 h-3" /> Zur Website
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 lg:ml-60 xl:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0F0D0B]/95 backdrop-blur-sm border-b border-white/8 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white flex-shrink-0">
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display text-xl sm:text-2xl font-light text-white leading-tight truncate">{title}</h1>
              {subtitle && <p className="text-white/30 text-xs font-body truncate">{subtitle}</p>}
            </div>
            {badge && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-body font-semibold">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onRefresh && (
              <button onClick={onRefresh}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 hover:text-white text-xs font-body transition-all">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}