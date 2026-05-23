import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, UtensilsCrossed, BedDouble, Heart, Star, ArrowRight, Wine, Music, History } from 'lucide-react';

export default function Story() {
  const { lang } = useLang();

  const content = {
    de: {
      title: 'Unsere Geschichte',
      subtitle: 'Von der historischen Krone zum modernen Kulinarium by Ammesso',
      krone_title: 'Die Krone Langenburg – Eine Historie',
      krone_period: 'Historie seit dem 16. Jahrhundert',
      krone_text: `Die Krone in Langenburg blickt auf eine beeindruckende Geschichte zurück, die bis ins 16. Jahrhundert reicht. Erstmals erwähnt wurde das Gasthaus in den Chroniken der Region, als es bereits als zentraler Treffpunkt der Hohenloher Gesellschaft diente.

Über die Jahrhunderte war die Krone Zeuge zahlreicher historischer Ereignisse – von Fürstenhochzeiten im benachbarten Schloss Langenburg bis zu den gesellschaftlichen Veränderungen der Moderne. Das Gebäude selbst ist ein prachtvolles Beispiel traditioneller deutscher Gasthaus-Architektur mit charakteristischen Fachwerk-Elementen und historischen Gewölbekellern.

Bis in die jüngste Vergangenheit blieb die Krone ein wichtiger Bestandteil des kulturellen Lebens in Langenburg – ein Ort, an dem Generationen zusammenkamen, feierten und die regionale Küche genossen.`,
      amesso_title: 'Die Neue Ära – Kulinarium by Ammesso',
      amesso_period: 'Seit 2025 – Omar Ammesso',
      amesso_text: `Im Jahr 2025 begann ein neues Kapitel in der Geschichte der Krone. Omar Ammesso, ein junger Gastronom mit Vision und Leidenschaft für die mediterrane Küche, erkannte das Potenzial dieses historischen Ortes.

Mit tiefem Respekt vor der Tradition und einem modernen Blick auf die Gastronomie entstand das Kulinarium by Ammesso – eine einzigartige Symbiose aus der historischen Substanz der Krone und der zeitgenössischen, leidenschaftlichen Küche von Omar und seinem Team.

Die Philosophie ist einfach und doch außergewöhnlich: Die Wärme der italienischen Küche mit den besten Zutaten der Region Hohenlohe zu verbinden. Pasta wird hausgemacht, Fleisch und Fisch mit Liebe zubereitet, und jedes Gericht erzählt eine Geschichte – von der Vergangenheit der Krone bis zur Vision von Ammesso.

Was als Traum begann, ist heute Realität geworden: Ein Ort, an dem Geschichte auf Moderne trifft, an dem Tradition und Innovation Hand in Hand gehen, und an dem jeder Gast Teil dieser besonderen Geschichte wird.`,
      values_title: 'Unsere Werte',
      values: [
        { icon: History, title: 'Tradition bewahren', desc: 'Respekt vor der Geschichte der Krone' },
        { icon: UtensilsCrossed, title: 'Leidenschaft kochen', desc: 'Mediterrane Küche mit Herz' },
        { icon: Users, title: 'Gastfreundschaft leben', desc: 'Jeder Gast ist Familie' },
        { icon: Star, title: 'Qualität liefern', desc: 'Nur die besten Zutaten' },
      ],
      cta_title: 'Erleben Sie unsere Geschichte',
      cta_subtitle: 'Besuchen Sie uns und werden Sie Teil des Kulinarium by Ammesso',
      cta_reserve: 'Tisch reservieren',
      cta_rooms: 'Zimmer buchen',
    },
    en: {
      title: 'Our Story',
      subtitle: 'From the historic Krone to the modern Kulinarium by Ammesso',
      krone_title: 'The Krone Langenburg – A History',
      krone_period: 'History since the 16th century',
      krone_text: `The Krone in Langenburg looks back on an impressive history dating back to the 16th century. The inn was first mentioned in the chronicles of the region, where it already served as a central meeting point of Hohenlohe society.

Over the centuries, the Krone witnessed numerous historical events – from princely weddings at the nearby Langenburg Castle to the social changes of modern times. The building itself is a magnificent example of traditional German inn architecture with characteristic half-timbered elements and historic vaulted cellars.

Until recently, the Krone remained an important part of cultural life in Langenburg – a place where generations came together to celebrate and enjoy regional cuisine.`,
      amesso_title: 'The New Era – Kulinarium by Ammesso',
      amesso_period: 'Since 2025 – Omar Ammesso',
      amesso_text: `In 2025, a new chapter began in the history of the Krone. Omar Ammesso, a young restaurateur with vision and passion for Mediterranean cuisine, recognized the potential of this historic location.

With deep respect for tradition and a modern perspective on gastronomy, Kulinarium by Ammesso was born – a unique symbiosis of the Krone's historical substance and Omar's contemporary, passionate cuisine with his team.

The philosophy is simple yet extraordinary: to combine the warmth of Italian cuisine with the finest ingredients from the Hohenlohe region. Pasta is homemade, meat and fish prepared with love, and every dish tells a story – from the Krone's past to Ammesso's vision.

What began as a dream has become reality: a place where history meets modernity, where tradition and innovation go hand in hand, and where every guest becomes part of this special story.`,
      values_title: 'Our Values',
      values: [
        { icon: History, title: 'Preserve Tradition', desc: 'Respect for the Krone history' },
        { icon: UtensilsCrossed, title: 'Cook with Passion', desc: 'Mediterranean cuisine with heart' },
        { icon: Users, title: 'Live Hospitality', desc: 'Every guest is family' },
        { icon: Star, title: 'Deliver Quality', desc: 'Only the finest ingredients' },
      ],
      cta_title: 'Experience Our Story',
      cta_subtitle: 'Visit us and become part of Kulinarium by Ammesso',
      cta_reserve: 'Reserve a Table',
      cta_rooms: 'Book Rooms',
    },
    it: {
      title: 'La Nostra Storia',
      subtitle: 'Dalla storica Krone al moderno Kulinarium by Ammesso',
      krone_title: 'La Krone Langenburg – Una Storia',
      krone_period: 'Storia dal XVI secolo',
      krone_text: `La Krone di Langenburg vanta una storia impressionante che risale al XVI secolo. La locanda fu menzionata per la prima volta nelle cronache della regione, dove già serviva come punto di incontro centrale della società di Hohenlohe.

Nel corso dei secoli, la Krone è stata testimone di numerosi eventi storici – dai matrimoni principeschi nel vicino Castello di Langenburg ai cambiamenti sociali dell'età moderna. L'edificio stesso è un magnifico esempio di architettura tradizionale tedesca con caratteristici elementi a graticcio e storiche cantine a volta.

Fino a poco tempo fa, la Krone è rimasta una parte importante della vita culturale di Langenburg – un luogo dove le generazioni si incontravano per celebrare e gustare la cucina regionale.`,
      amesso_title: 'La Nuova Era – Kulinarium by Ammesso',
      amesso_period: 'Dal 2025 – Omar Ammesso',
      amesso_text: `Nel 2025 è iniziato un nuovo capitolo nella storia della Krone. Omar Ammesso, un giovane ristoratore con visione e passione per la cucina mediterranea, ha riconosciuto il potenziale di questo luogo storico.

Con profondo rispetto per la tradizione e una prospettiva moderna sulla gastronomia, è nato il Kulinarium by Ammesso – una simbiosi unica tra la sostanza storica della Krone e la cucina contemporanea e appassionata di Omar con il suo team.

La filosofia è semplice ma straordinaria: combinare il calore della cucina italiana con i migliori ingredienti della regione di Hohenlohe. La pasta è fatta in casa, carne e pesce preparati con amore, e ogni piatto racconta una storia – dal passato della Krone alla visione di Ammesso.

Quello che è iniziato come un sogno è diventato realtà: un luogo dove la storia incontra la modernità, dove tradizione e innovazione vanno di pari passo, e dove ogni ospite diventa parte di questa storia speciale.`,
      values_title: 'I Nostri Valori',
      values: [
        { icon: History, title: 'Preservare la Tradizione', desc: 'Rispetto per la storia della Krone' },
        { icon: UtensilsCrossed, title: 'Cucinare con Passione', desc: 'Cucina mediterranea con cuore' },
        { icon: Users, title: 'Vivere l\'Ospitalità', desc: 'Ogni ospite è famiglia' },
        { icon: Star, title: 'Offrire Qualità', desc: 'Solo i migliori ingredienti' },
      ],
      cta_title: 'Vivi la Nostra Storia',
      cta_subtitle: 'Visitateci e diventate parte del Kulinarium by Ammesso',
      cta_reserve: 'Prenota un tavolo',
      cta_rooms: 'Prenota camere',
    },
  };

  const c = content[lang] || content.de;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714] pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#2A2118] to-[#1C1714] py-20 sm:py-28">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&q=85" alt="Historic Restaurant Interior" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-3"
          >
            Krone Langenburg by Ammesso
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl font-light text-white mb-4"
          >
            {c.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 font-body text-sm sm:text-base"
          >
            {c.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-5xl mx-auto px-5 py-16">
        {/* Krone History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <History className="w-6 h-6 text-[#8B6914]" />
                <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body">{c.krone_period}</p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-6">{c.krone_title}</h2>
              <div className="space-y-4 font-body text-[#4A3F35] leading-relaxed whitespace-pre-line">
                {c.krone_text.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl premium-shadow">
                <img
                  src="https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800&q=85"
                  alt="Historic Krone Building Langenburg"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#C9A96E]/10 rounded-full blur-2xl" />
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />
          <div className="w-12 h-12 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-[#C9A96E]" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />
        </div>

        {/* Amesso Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl premium-shadow">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=85"
                  alt="Kulinarium by Ammesso Modern Restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#C9A96E]/10 rounded-full blur-2xl" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-[#8B6914]" />
                <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body">{c.amesso_period}</p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-6">{c.amesso_title}</h2>
              <div className="space-y-4 font-body text-[#4A3F35] leading-relaxed whitespace-pre-line">
                {c.amesso_text.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="bg-white border-t border-[#EDE6D8] py-16">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.values_title}</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {c.values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-[#C9A96E]" />
                </div>
                <h3 className="font-display text-lg font-light text-[#1C1714] mb-2">{v.title}</h3>
                <p className="font-body text-sm text-[#8A7A6A]">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-b from-[#1C1714] to-[#2A2118] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-5">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl sm:text-4xl font-light text-white mb-4"
          >
            {c.cta_title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/50 font-body text-sm mb-8"
          >
            {c.cta_subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/reserve" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-lg text-sm tracking-widest uppercase font-body font-bold transition-all shadow-lg">
              <UtensilsCrossed className="w-4 h-4" /> {c.cta_reserve}
            </Link>
            <Link to="/rooms" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/25 text-white/70 hover:text-white hover:border-white/50 rounded-lg text-sm tracking-widest uppercase font-body font-semibold transition-all">
              <BedDouble className="w-4 h-4" /> {c.cta_rooms}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}