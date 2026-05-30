/**
 * AdminShell — Redesigned: Light, high-contrast, professional
 * Sidebar with grouped navigation, breadcrumb header, mobile drawer
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  UtensilsCrossed, BedDouble, MessageSquare, FileText, Briefcase, Gift,
  LayoutDashboard, Calendar, BookOpen, Sparkles, Users, Activity, Zap,
  Shield, Clock, Image, Tag, Menu, X, ArrowLeft,
  RefreshCw, ChevronRight, Bell, Settings, LogOut, Home
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
      { to: '/admin/calendar', label: 'Kalender', icon: Calendar },
    ],
  },
  {
    label: 'Inhalte',
    items: [
      { to: '/admin/menu', label: 'Speisekarte', icon: BookOpen },
      { to: '/admin/events', label: 'Events', icon: Sparkles },
      { to: '/admin/hero', label: 'Hero-Slides', icon: Image },
      { to: '/admin/offers', label: 'Angebote', icon: Tag },
      { to: '/admin/opening-hours', label: 'Öffnungszeiten', icon: Clock },
      { to: '/admin/vouchers', label: 'Gutscheine', icon: Gift },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/beds24', label: 'Beds24 Sync', icon: BedDouble },
      { to: '/admin/audit', label: 'Audit-Log', icon: Activity },
      { to: '/admin/credits', label: 'Credits', icon: Zap },
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all group relative ${
        active
          ? 'bg-[#8B6914] text-white font-semibold shadow-sm'
          : 'text-[#4A3F35] hover:text-[#1C1714] hover:bg-[#F2E8D0]'
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-[#8B6914]/60 group-hover:text-[#8B6914]'}`} />
      <span className="truncate">{item.label}</span>
      {active && <ChevronRight className="w-3 h-3 ml-auto text-white/60" />}
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

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#EDE6D8] flex items-center justify-between">
        <Link to="/" className="flex flex-col" onClick={onClose}>
          <p className="font-display text-base font-semibold tracking-[0.08em] text-[#1C1714]">Krone Langenburg</p>
          <p className="text-[#8B6914] text-[9px] tracking-[0.35em] uppercase font-body mt-0.5">by Ammesso · Admin</p>
        </Link>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F2E8D0] text-[#8B6914] hover:bg-[#EDE6D8] transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[#8A7A6A] text-[9px] tracking-[0.3em] uppercase font-body font-bold px-3 mb-2">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavItem key={item.to} item={item} active={isActive(item)} onClick={onClose} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-[#EDE6D8] bg-[#FAF7F2]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#8B6914]/15 border border-[#8B6914]/25 flex items-center justify-center flex-shrink-0">
            <span className="text-[#8B6914] text-xs font-body font-bold">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[#1C1714] text-xs font-body font-semibold truncate">{user?.full_name || 'Admin'}</p>
            <p className="text-[#8A7A6A] text-[10px] font-body truncate">{user?.email || '…'}</p>
          </div>
        </div>
        <Link to="/" className="flex items-center gap-2 text-[#8A7A6A] hover:text-[#1C1714] text-xs font-body transition-colors py-1.5 px-2 rounded-lg hover:bg-[#EDE6D8]">
          <Home className="w-3.5 h-3.5" /> Zur Website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#1C1714] flex">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0 bg-white border-r border-[#EDE6D8] fixed top-0 left-0 h-screen overflow-y-auto z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white flex flex-col overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 lg:ml-60 xl:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#EDE6D8] px-4 sm:px-6 py-0 flex items-center gap-3 shadow-sm" style={{ minHeight: '64px' }}>
          <button onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#F7F3EC] text-[#8B6914] hover:bg-[#F2E8D0] flex-shrink-0 transition-colors">
            <Menu className="w-4.5 h-4.5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#1C1714] leading-tight truncate">{title}</h1>
              {badge && (
                <span className="flex-shrink-0 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-[10px] font-body font-bold">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-[#8A7A6A] text-xs font-body">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onRefresh && (
              <button onClick={onRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-[#F7F3EC] hover:bg-[#F2E8D0] border border-[#EDE6D8] rounded-xl text-[#4A3F35] hover:text-[#1C1714] text-xs font-body transition-all font-semibold">
                <RefreshCw className={`w-3.5 h-3.5 text-[#8B6914] ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Aktualisieren</span>
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