import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyMobileCTA from './StickyMobileCTA';
import CookieBanner from '../CookieBanner';

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar: utility bar (36px) + main nav (~56-64px) = ~100px total */}
      <Navbar />
      <main className="flex-1 pb-[56px] lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <StickyMobileCTA />
      <CookieBanner />
    </div>
  );
}