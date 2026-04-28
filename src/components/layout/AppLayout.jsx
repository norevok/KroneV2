import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyMobileCTA from './StickyMobileCTA';
import WhatsAppButton from './WhatsAppButton';
import ChatWidget from '../ChatWidget';


export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <StickyMobileCTA />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}