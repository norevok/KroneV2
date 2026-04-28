// Canonical normalized site data — single source of truth
// Extracted from krone-ammesso.de and normalized
// Migration conflicts documented below

export const SITE_DEFAULTS = {
  hotel_name: "Krone Langenburg by Ammesso",
  brand_short: "Ammesso",
  tagline_de: "Wo Heimat schmeckt — echt · herzlich · hausgemacht",
  tagline_en: "Where Home Tastes Real — genuine · warm · handcrafted",
  tagline_it: "Dove il gusto è di casa — autentico · caloroso · artigianale",
  address_street: "Hauptstraße 24",
  address_city: "Langenburg",
  address_zip: "74595",
  address_country: "Deutschland",
  phone: "+49 7905 41770",
  email_info: "info@krone-ammesso.de",
  email_reservations: "info@krone-ammesso.de",
  beds24_prop_id: "310599",
  beds24_booking_url: "https://beds24.com/booking2.php?propid=310599",
  restaurant_capacity: 120,
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  restaurant_closed_days: [1], // Monday closed
  restaurant_lunch_start: "12:00",
  restaurant_lunch_end: "14:30",
  restaurant_dinner_start: "17:30",
  restaurant_dinner_end: "22:00",
  restaurant_sunday_start: "12:00",
  restaurant_sunday_end: "20:00",
  social_instagram: "https://www.instagram.com/kulinarium.ammesso/",
  social_facebook: "https://www.facebook.com/pages/H%C3%A4llisches%20Kulinarium%20by%20Ammesso",
  social_tripadvisor: "https://www.tripadvisor.de/Restaurant_Review-g198538-d26012517-Reviews-Hallisches_Kulinarium_by_Ammesso-Schwabisch_Hall_Baden_Wurttemberg.html",
  whatsapp_number: "+4979054177",
  breakfast_price: 14,
};

// MIGRATION CONFLICTS DETECTED FROM OLD SITE:
export const MIGRATION_CONFLICTS = [
  {
    field: "restaurant_hours_wed_sun",
    old_site_value: "Website hero says Mittwoch–Sonntag, but reservation widget shows Dienstag–Samstag + Sonntag",
    normalized_to: "Dienstag–Samstag: 12:00–14:30, 17:30–22:00 | Sonntag: 12:00–20:00 | Montag: Ruhetag",
    needs_admin_review: true,
    note: "Old hero video mentioned Wed–Sun for grand opening period. Standing hours appear to be Tue–Sun."
  },
  {
    field: "brand_name",
    old_site_value: "Site uses both 'Ammesso', 'Kulinarium by Ammesso', 'Hällisches Kulinarium by Ammesso', and 'Krone Langenburg by Ammesso'",
    normalized_to: "Krone Langenburg by Ammesso (hotel), Kulinarium by Ammesso (restaurant brand)",
    needs_admin_review: false,
    note: "Hällisches Kulinarium was the Schwäbisch Hall location. Current location is Langenburg."
  },
  {
    field: "tripadvisor_link",
    old_site_value: "Points to Schwäbisch Hall location (Hällisches Kulinarium) — not the Langenburg location",
    normalized_to: "Kept as-is pending new Langenburg TripAdvisor listing",
    needs_admin_review: true,
    note: "Update TripAdvisor URL once Langenburg listing is created."
  }
];

// Canonical room names — reconciled with Beds24 room list
// Beds24 rooms: Deluxe Doppelzimmer, Deluxe Einzelzimmer, Superior Suite, Superior Suite 2
export const ROOMS = [
  {
    id: "deluxe_single",
    beds24_name: "Deluxe Einzelzimmer",
    key_de: "Deluxe Einzelzimmer",
    key_en: "Deluxe Single Room",
    key_it: "Camera Singola Deluxe",
    size_m2: 18, max_guests: 1,
    price_from: 89,
    bed_de: "Einzelbett (90×200)", bed_en: "Single bed (90×200)",
    description_de: "Ruhiges, komfortables Einzelzimmer mit allem, was Sie für einen erholsamen Aufenthalt brauchen. Ideal für Geschäftsreisende und Alleinreisende.",
    description_en: "A quiet, comfortable single room — ideal for business travellers and solo stays.",
    features_de: ['Ruhige Lage', 'Modernes Bad', 'Schreibtisch & Stuhl', 'WLAN', 'Stadtblick', 'Minikühlschrank'],
    features_en: ['Quiet location', 'Modern bathroom', 'Work desk & chair', 'WiFi', 'City view', 'Mini fridge'],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    id: "deluxe_double",
    beds24_name: "Deluxe Doppelzimmer",
    key_de: "Deluxe Doppelzimmer",
    key_en: "Deluxe Double Room",
    key_it: "Camera Doppia Deluxe",
    size_m2: 26, max_guests: 2,
    price_from: 119,
    bed_de: "Doppelbett (180×200)", bed_en: "Double bed (180×200)",
    description_de: "Geräumiges Doppelzimmer mit stilvollem Ambiente und Blick auf die Altstadt Langenburgs. Komfort und historisches Flair in perfekter Balance.",
    description_en: "Spacious double room with tasteful décor and views over Langenburg's old town.",
    features_de: ['Panoramafenster', 'Regendusche', 'Schreibtisch', 'WLAN', 'Stadtblick', 'Minibar'],
    features_en: ['Panoramic window', 'Rain shower', 'Work desk', 'WiFi', 'City view', 'Minibar'],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  },
  {
    id: "superior_suite",
    beds24_name: "Superior Suite",
    key_de: "Superior Suite",
    key_en: "Superior Suite",
    key_it: "Superior Suite",
    size_m2: 38, max_guests: 2,
    price_from: 159,
    bed_de: "King-Size-Bett (180×200)", bed_en: "King-size bed (180×200)",
    description_de: "Großzügige Suite mit separatem Wohnbereich und freistehender Badewanne. Ideal für besondere Anlässe und romantische Aufenthalte.",
    description_en: "Generous suite with separate living area and freestanding bathtub — ideal for romantic stays.",
    features_de: ['Separater Wohnbereich', 'Freistehende Badewanne', 'Premium-Minibar', 'WLAN', 'Exklusiver Blick'],
    features_en: ['Separate living area', 'Freestanding bathtub', 'Premium minibar', 'WiFi', 'Exclusive view'],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  },
  {
    id: "superior_suite_2",
    beds24_name: "Superior Suite 2",
    key_de: "Superior Suite 2",
    key_en: "Superior Suite 2",
    key_it: "Superior Suite 2",
    size_m2: 42, max_guests: 2,
    price_from: 179,
    bed_de: "King-Size-Bett (200×200)", bed_en: "King-size bed (200×200)",
    description_de: "Unsere exklusivste Unterkunft. Weitläufige Suite mit Loungebereich, Premium-Ausstattung und dem schönsten Blick über Langenburg.",
    description_en: "Our most exclusive accommodation — spacious with lounge area and the finest view over Langenburg.",
    features_de: ['Großzügiger Loungebereich', 'Freistehende Badewanne & Dusche', 'Premium-Minibar', 'WLAN', 'Langenburg-Panorama'],
    features_en: ['Generous lounge area', 'Freestanding bathtub & shower', 'Premium minibar', 'WiFi', 'Langenburg panorama'],
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
  },
];

export const MENU_DATA = {
  starters: [
    { name_de: "Mediterrane Bruschetta", name_en: "Mediterranean Bruschetta", name_it: "Bruschetta Mediterranea", desc_de: "Knuspriges Landbrot mit Kirschtomaten, frischem Basilikum und Knoblauch", desc_en: "Crispy country bread with cherry tomatoes, fresh basil and garlic", desc_it: "Pane croccante con pomodorini, basilico fresco e aglio", price: 8.4 },
    { name_de: "Frittierte Gemüsejulienne", name_en: "Fried Vegetable Julienne", name_it: "Verdure in pastella fritte", desc_de: "Fein geschnittenes Gemüse in knusprigem Bierteig", desc_en: "Finely cut vegetables in crispy beer batter", desc_it: "Verdure finemente tagliate in pastella di birra croccante", price: 7.9 },
    { name_de: "Gemüsesuppe alla Italiana", name_en: "Italian Vegetable Soup", name_it: "Minestrone all'Italiana", desc_de: "Suppe nach italienischer Tradition mit frischem Wintergemüse", desc_en: "Soup in Italian tradition with fresh winter vegetables", desc_it: "Zuppa di tradizione italiana con verdure fresche di stagione", price: 6.7 },
    { name_de: "Mediterrane Potatos", name_en: "Mediterranean Potatoes", name_it: "Patate Mediterranee", desc_de: "Goldbraun, knusprig und frisch aus unserer Küche", desc_en: "Golden, crispy and fresh from our kitchen", desc_it: "Dorate, croccanti e fresche dalla nostra cucina", price: 4.3, price_with: 5.7, option_de: "mit Parmesan-Creme", option_en: "with Parmesan cream", option_it: "con crema di Parmigiano" },
  ],
  mains: [
    { name_de: "Carbonara Tradizione", name_en: "Carbonara Tradizione", name_it: "Carbonara Tradizione", desc_de: "Spaghetti nach original italienischem Rezept – mit Guanciale, frischem Eigelb, Pecorino Romano und schwarzem Pfeffer", desc_en: "Spaghetti with the original Italian recipe — with Guanciale, fresh egg yolk, Pecorino Romano and black pepper", desc_it: "Spaghetti con la ricetta originale italiana — con guanciale, tuorlo fresco, Pecorino Romano e pepe nero", price: 14.4 },
    { name_de: "Fusilloni al Brokkoli-Pesto mit Kräuter-Pancetta", name_en: "Fusilloni with Broccoli Pesto & Herb Pancetta", name_it: "Fusilloni al pesto di broccoli e pancetta alle erbe", desc_de: "Große Fusilli mit cremigem Brokkoli-Pesto und knuspriger Pancetta", desc_en: "Large Fusilli with creamy broccoli pesto and crispy herb pancetta", desc_it: "Fusilli grandi con pesto cremoso di broccoli e pancetta croccante alle erbe", price: 13.3 },
    { name_de: "Spaghetti alla Napoletana mit Polpette", name_en: "Spaghetti alla Napoletana with Meatballs", name_it: "Spaghetti alla Napoletana con polpette", desc_de: "Spaghetti in Tomatensauce aus San-Marzano-Pelati mit hausgemachten Fleischbällchen", desc_en: "Spaghetti in San Marzano tomato sauce with homemade meatballs", desc_it: "Spaghetti in salsa di pomodori San Marzano con polpette fatte in casa", price: 13.8 },
    { name_de: "Der Doktor meines Zwillings", name_en: "My Twin's Doctor", name_it: "Il Dottore del Mio Gemello", desc_de: "Calamarata mit Huhn in Sauvignon-Reduktion, Zucchinicreme und karamellisierten Zwiebeln", desc_en: "Calamarata with chicken in Sauvignon reduction, zucchini cream and caramelised onions", desc_it: "Calamarata con pollo in riduzione di Sauvignon, crema di zucchine e cipolle caramellate", price: 14.4 },
    { name_de: "Die Sprache des Meeres", name_en: "The Language of the Sea", name_it: "Il Linguaggio del Mare", desc_de: "Linguine mit Baccalà in Paprika-Zwiebel-Rosmarin-Weißweinsauce", desc_en: "Linguine with salt cod braised in pepper, onion, rosemary and white wine", desc_it: "Linguine con baccalà in salsa di peperoni, cipolla, rosmarino e vino bianco", price: 14.1 },
    { name_de: "Das Herz der Erde", name_en: "The Heart of the Earth", name_it: "Il Cuore della Terra", desc_de: "Frische Kartoffelgnocchi in Vier-Käse-Sauce mit knusprigem Rosmarin-Speck", desc_en: "Fresh potato gnocchi in four-cheese sauce with crispy rosemary bacon", desc_it: "Gnocchi di patate freschi in salsa ai quattro formaggi con pancetta croccante al rosmarino", price: 13.4 },
  ],
  meat_fish: [
    { name_de: "Mediterraner Rostbraten", name_en: "Mediterranean Roastbeef", name_it: "Arrosto Mediterraneo", desc_de: "Saftig rosa gebratenes Roastbeef mit Olivenöl, Kräutern, geschmorten Zwiebeln und Rosmarinkartoffeln — vorab ein frischer Salat", desc_en: "Juicy pink roastbeef with olive oil, herbs, braised onions and rosemary potatoes — with a fresh salad to start", desc_it: "Roastbeef succoso rosa con olio d'oliva, erbe, cipolle stufate e patate al rosmarino — con insalata fresca", price: 25.4 },
    { name_de: "Mediterranes Schnitzel", name_en: "Mediterranean Schnitzel", name_it: "Cotoletta Mediterranea", desc_de: "Zartes Kalbsschnitzel goldbraun gebacken mit mediterranen Kräutern, gegrilltem Gemüse und Rosmarinkartoffeln — vorab ein frischer Salat", desc_en: "Tender veal schnitzel golden baked with Mediterranean herbs, grilled vegetables and rosemary potatoes — with a fresh salad", desc_it: "Tenera cotoletta di vitello dorata con erbe mediterranee, verdure grigliate e patate al rosmarino — con insalata fresca", price: 16.3 },
    { name_de: "Saltimbocca alla Romana", name_en: "Saltimbocca alla Romana", name_it: "Saltimbocca alla Romana", desc_de: "Zartes Kalbsmedaillon mit Prosciutto und Salbei in Weißweinsauce — dazu Ofengemüse und ein frischer Salat", desc_en: "Tender veal medallion with prosciutto and sage in white wine sauce — with oven vegetables and fresh salad", desc_it: "Tenero medaglione di vitello con prosciutto e salvia in salsa al vino bianco — con verdure al forno e insalata fresca", price: 18.3 },
  ],
  sides: [
    { name_de: "Gemischter Salat", name_en: "Mixed Salad", name_it: "Insalata mista", price: 5.5 },
    { name_de: "Ofengemüse", name_en: "Roasted Vegetables", name_it: "Verdure al forno", desc_de: "Saisonal, mit Olivenöl und Kräutern", desc_en: "Seasonal, with olive oil and herbs", desc_it: "Stagionale, con olio d'oliva ed erbe", price: 6.5 },
  ],
  desserts: [
    { name_de: "Die Süße Versuchung", name_en: "Sweet Temptation", name_it: "La Dolce Tentazione", desc_de: "Hausgemachter Schokoladen-Brownie mit warmem Kern, Vanilleeis und Meersalz", desc_en: "Homemade chocolate brownie with warm core, vanilla ice cream and sea salt", desc_it: "Brownie al cioccolato fatto in casa con cuore caldo, gelato alla vaniglia e sale marino", price: 5.5 },
    { name_de: "Der Klassiker meiner Nonna", name_en: "My Nonna's Classic", name_it: "Il Classico della mia Nonna", desc_de: "Tiramisù nach traditionellem Rezept mit Mascarpone, Espresso und einem Hauch Kakao", desc_en: "Tiramisù by traditional recipe with mascarpone, espresso and a hint of cocoa", desc_it: "Tiramisù della ricetta tradizionale con mascarpone, espresso e un tocco di cacao", price: 7.1 },
  ],
};

export const TIME_SLOTS_LUNCH = ["12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15"];
export const TIME_SLOTS_DINNER = ["17:30","17:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30"];
export const TIME_SLOTS_SUNDAY = ["12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","19:00","19:15","19:30"];