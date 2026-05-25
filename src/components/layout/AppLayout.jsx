import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyMobileCTA from './StickyMobileCTA';
import CookieBanner from '../CookieBanner';

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar: utility (36px) + row1 (56px) + row2 (40px) + banner (34px) = ~166px desktop, ~100px mobile */}
      <Navbar />
      <main className="flex-1 pb-[56px] lg:pb-0 pt-0">
        <Outlet />
      </main>
      <Footer />
      <StickyMobileCTA />
      <CookieBanner />
    </div>
  );
}