import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Clock, XCircle, Home, Phone } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

export default function BookingReturn() {
  const { lang } = useLang();
  const [state, setState] = useState('loading');
  const [intentRef, setIntentRef] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || 'pending';
    const ref = params.get('ref') || '';
    setIntentRef(ref);
    if (status === 'confirmed' || status === 'success' || status === 'completed') setState('confirmed');
    else if (status === 'cancelled' || status === 'cancel' || status === 'failed') setState('cancelled');
    else setState('pending');
    if (ref) {
      const s = status === 'confirmed' || status === 'success' ? 'returned_confirmed'
        : status === 'cancelled' || status === 'cancel' ? 'returned_cancelled' : 'returned_pending';
      base44.entities.HotelBookingIntent.filter({ intent_ref: ref }).then(async items => {
        if (items.length > 0) {
          await base44.entities.HotelBookingIntent.update(items[0].id, { status: s, returned_at: new Date().toISOString() });
        }
        // Notify Slack about return status
        base44.functions.invoke('notifySlack', {
          type: 'booking_returned',
          ref,
          status: s,
        }).catch(() => {});
      }).catch(() => {});
    }
  }, []);

  const configs = {
    loading: {
      icon: <div className="w-12 h-12 border-2 border-[#C9A96E]/20 border-t-gold rounded-full animate-spin" />,
      color: 'border-[#C9A96E]/10',
      title: '...',
      text: '',
    },
    confirmed: {
      icon: <CheckCircle className="w-14 h-14 text-gold" />,
      color: 'border-gold/20',
      title: lang === 'de' ? 'Buchung erfolgreich' : lang === 'en' ? 'Booking Successful' : 'Prenotazione completata',
      text: lang === 'de' ? 'Sie erhalten in Kürze eine Bestätigung per E-Mail.' : lang === 'en' ? 'A booking confirmation will be sent to your email.' : 'Riceverete a breve una conferma via email.',
    },
    pending: {
      icon: <Clock className="w-14 h-14 text-gold/60" />,
      color: 'border-[#C9A96E]/10',
      title: lang === 'de' ? 'Buchung in Bearbeitung' : lang === 'en' ? 'Booking Pending' : 'Prenotazione in elaborazione',
      text: lang === 'de' ? 'Falls Sie keine Bestätigung erhalten, kontaktieren Sie uns bitte.' : lang === 'en' ? 'If you do not receive a confirmation, please contact us.' : 'Se non ricevete una conferma, contattateci.',
    },
    cancelled: {
      icon: <XCircle className="w-14 h-14 text-red-400/60" />,
      color: 'border-red-900/20',
      title: lang === 'de' ? 'Buchung nicht abgeschlossen' : lang === 'en' ? 'Booking Not Completed' : 'Prenotazione non completata',
      text: lang === 'de' ? 'Möchten Sie es erneut versuchen?' : lang === 'en' ? 'Would you like to try again?' : 'Volete riprovare?',
    },
  };

  const cfg = configs[state];

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 sm:px-5 pt-16 sm:pt-20 pb-28 lg:pb-16">
      <div className="max-w-md w-full">
        <div className={`glass-card rounded-2xl p-10 text-center border ${cfg.color} mb-6`}>
          <div className="flex justify-center mb-6">{cfg.icon}</div>
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg</p>
          <h1 className="font-display text-2xl font-light text-ivory mb-3">{cfg.title}</h1>
          {cfg.text && <p className="text-ivory/50 text-sm font-body leading-relaxed">{cfg.text}</p>}
          {intentRef && <p className="text-xs text-ivory/20 mt-3 font-body">Ref: {intentRef}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/" className="flex items-center justify-center gap-2 py-3.5 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/60 text-xs font-body tracking-widest uppercase hover:text-ivory transition-colors">
            <Home className="w-4 h-4" />
            {lang === 'de' ? 'Startseite' : lang === 'en' ? 'Home' : 'Home'}
          </Link>
          <a href={`tel:${SITE_DEFAULTS.phone}`} className="flex items-center justify-center gap-2 py-3.5 btn-gold rounded-xl text-xs font-body font-semibold tracking-widest uppercase">
            <Phone className="w-4 h-4" />
            {lang === 'de' ? 'Anrufen' : lang === 'en' ? 'Call Us' : 'Chiama'}
          </a>
        </div>

        {state !== 'confirmed' && (
          <div className="mt-4 text-center">
            <Link to="/rooms" className="text-sm text-gold/60 hover:text-gold font-body transition-colors">
              {lang === 'de' ? 'Erneut versuchen →' : lang === 'en' ? 'Try again →' : 'Riprova →'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}