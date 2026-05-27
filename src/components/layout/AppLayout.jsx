import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyMobileCTA from './StickyMobileCTA';
import CookieBanner from '../CookieBanner';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/*
        Navbar total height (fixed):
        Mobile:  utility(0,hidden) + row1(56px) + banner(34px) = ~90px  → use pt-[126px] (with 36px utility on mobile too = 126px)
        Desktop: utility(36px) + row1(56px) + row2(40px) + banner(34px) = 166px → use pt-[172px]
        CSS variable --nav-h exposed so all pages can use it uniformly.
      */}
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pb-[80px] lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <StickyMobileCTA />
      <CookieBanner />
    </div>
  );
}