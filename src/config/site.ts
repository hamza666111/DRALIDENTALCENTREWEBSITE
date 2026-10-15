/**
 * Central editable content for the DADC website.
 * Every value that has not been verified by the clinic is null or flagged
 * as unconfirmed. Presentation components read from here only.
 */

export type Category = "preventive" | "restorative" | "cosmetic"

export interface OpeningHours {
  days: string
  hours: string
}

export interface ClinicConfig {
  name: string
  tagline: string
  /** Path or URL of the original DADC logo file. null until the file is added to /public. */
  logo: { src: string | null ; alt: string ; width: number ; height: number }
  address: string | null
  city: string | null
  postcode: string | null
  phone: string | null
  /** WhatsApp number in international format, digits only (e.g. 60123456789). */
  whatsapp: string | null
  email: string | null
  openingHours: OpeningHours[] | null
  mapEmbedUrl: string | null
  /** Direct link to Google Maps destination */
  mapUrl: string | null
  social?: {
    instagram: string
    facebook: string
  }
}

/**
 * SEO / domain settings.
 * Supports dynamic environment variables, custom domain, and safe fallback.
 */
export const seo = {
  /**
   * Configurable production base URL without trailing slash.
   * Priority: import.meta.env.VITE_SITE_URL -> seo.domain -> fallback placeholder.
   */
  domain: ((typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_SITE_URL) ||
    null) as string | null,
  /** Safe placeholder fallback so canonicals, Open Graph, sitemaps, and schemas work out of the box */
  defaultBaseUrl: "https://example.com",
  defaultDescription:
    "Dr Ali Dental Centre provides modern dentistry with gentle care in Lahore. Explore scaling, implants, aligners, RCT, transparent fees, and book on WhatsApp.",
  /** Standard 1200x630 social sharing preview image asset path */
  socialImage: "/og-image.jpg",
  locale: "en",
  siteName: "Dr Ali Dental Centre",
}

export const clinic: ClinicConfig = {
  name: "Dr Ali Dental Centre",
  tagline: "Modern Dentistry With Gentle Care.",
  logo: {
    src: "/dadc-logo.svg",
    alt: "Dr Ali Dental Centre logo",
    width: 48,
    height: 48,
  },
  address: "Shop# 2 Ground Floor, Galaxy Mall, Airport Rd",
  city: "Lahore",
  postcode: "54000",
  phone: "03282333999",
  whatsapp: "923282333999",
  email: "DrAliDentalCentre1@gmail.com",
  openingHours: [
    {
      days: "Monday – Saturday",
      hours: "3:00 PM – 10:00 PM",
    },
  ],
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Shop+2+Galaxy+Mall+Airport+Rd+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed",
  mapUrl: "https://maps.app.goo.gl/kkKaiHisnZZbzoZ7A",
  social: {
    instagram: "https://www.instagram.com/dr.alidentalcentre/",
    facebook: "https://www.facebook.com/dr.alidentalcentre",
  },
}

export const clinicAddress = [clinic.address, clinic.city, clinic.postcode]
  .filter(Boolean)
  .join(", ")

export const pricing = {
  /** ISO currency code, e.g. 'MYR' or 'USD'. null until confirmed. */
  currency: null as string | null,
  note: "Fees are confirmed after a clinical assessment. Your plan and estimate are explained before any treatment begins.",
}

export interface Fee {
  /** Exact fee or "from" amount. null = not confirmed. Never use 0 as a placeholder. */
  amount: number | null
  from: boolean
  basis: string | null
}

export interface ServiceStep {
  title: string
  body: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Service {
  slug: string
  name: string
  category: Category
  /** Approved by the clinic for publication. All proposed examples start false. */
  confirmed: boolean
  summary: string
  headline: string
  intro: string
  /** 40-60 word Answer-First summary optimized for LLM RAG & AI search extraction (Google AI Overviews / Perplexity) */
  geoDirectAnswer?: string
  /** Schema procedure type e.g. 'SurgicalProcedure', 'NoninvasiveProcedure', 'DiagnosticProcedure' */
  procedureType?: string
  /** High-resolution image path/URL for service showcase */
  image?: string | null
  imageAlt?: string | null
  imageWidth?: number
  imageHeight?: number
  /** ISO last modification date for sitemaps & schemas */
  lastmod?: string
  fee: Fee
  included: string[]
  additional: string[]
  overview: string[]
  highlights: { title: string ; body: string }[]
  suitability: string | null
  journey: ServiceStep[]
  aftercare: string[]
  faqs: FAQ[]
  related: string[]
  articles: string[]
  /** Clinician who reviewed the clinical copy, and review date. */
  review: { reviewer: string | null ; date: string | null }
}

export const categories: { id: Category | "all" ; label: string }[] = [
  { id: "all", label: "All care" },
  { id: "preventive", label: "Preventive" },
  { id: "restorative", label: "Restorative" },
  { id: "cosmetic", label: "Cosmetic" },
]

const unreviewed = { reviewer: null, date: null }
const unknownFee = (basis: string | null): Fee => ({
  amount: null,
  from: false,
  basis,
})

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

export const images = {
  clinicRoom: u("photo-1704455306251-b4634215d98f", 1600),
  clinicRoom2: u("photo-1704455306925-1401c3012117", 1200),
  waiting: u("photo-1762625570087-6d98fca29531", 1000),
}

export const services: Service[] = [
  {
    slug: "scaling-and-polishing",
    name: "Scaling & Polishing",
    category: "preventive",
    confirmed: false,
    summary:
      "Thorough removal of plaque, tartar, and stubborn stains to keep gums healthy and teeth smooth.",
    headline: "A fresher, cleaner feel and healthier gums.",
    intro:
      "Professional scaling and polishing reaches the build-up that daily brushing and flossing can miss.",
    geoDirectAnswer:
      "Professional scaling and polishing at Dr Ali Dental Centre gently clears hardened plaque, tartar (calculus), and stubborn stains from teeth and below the gumline. Conducted with fine ultrasonic scaling and polishing, this essential preventive hygiene procedure combats gum inflammation, prevents periodontitis, and restores a fresh, smooth oral feel.",
    procedureType: "NoninvasiveProcedure",
    image: images.clinicRoom2,
    imageAlt:
      "Sanitized clinical hygiene station for gentle dental scaling and polishing at Dr Ali Dental Centre",
    imageWidth: 1200,
    imageHeight: 900,
    lastmod: "2026-04-01",
    fee: unknownFee("Per session"),
    included: [
      "Comprehensive gum and plaque assessment",
      "Ultrasonic tartar removal and stain scaling",
      "Enamel polishing with prophylactic paste",
    ],
    additional: [
      "Deep periodontal cleaning if gum inflammation is advanced",
      "Fluoride treatment for sensitive enamel",
    ],
    overview: [
      "Even with diligent daily brushing, hardened mineral deposits known as tartar accumulate in hard-to-reach areas.",
      "Regular scaling and polishing eliminates bacteria, keeps gums firm and pink, and leaves teeth visibly cleaner.",
    ],
    highlights: [
      {
        title: "Gentle on gums",
        body: "Ultrasonic technology cleans thoroughly while minimizing discomfort.",
      },
      {
        title: "Freshens breath",
        body: "Removes odor-causing bacteria lodged between teeth and along the gumline.",
      },
    ],
    suitability:
      "Recommended for children, teenagers, and adults every 6 months to maintain optimal oral health.",
    journey: [
      {
        title: "Gum check",
        body: "We examine your gums and identify areas of plaque and tartar accumulation.",
      },
      {
        title: "Ultrasonic scaling",
        body: "Hardened calculus is gently loosened and rinsed away.",
      },
      {
        title: "Polishing & advice",
        body: "Teeth are polished smooth, followed by tailored home hygiene guidance.",
      },
    ],
    aftercare: [
      "Mild sensitivity may occur for a few hours.",
      "Continue brushing twice daily and using interdental floss.",
    ],
    faqs: [
      {
        question: "Does scaling and polishing hurt?",
        answer:
          "Most patients find it very comfortable. We can adjust the intensity or apply a topical numbing gel if your gums are sensitive.",
      },
      {
        question: "How often should I get scaling and polishing done?",
        answer:
          "For most people, every six months is ideal to prevent gum disease and maintain clean teeth.",
      },
    ],
    related: ["composite-filling", "teeth-whitening"],
    articles: ["everyday-oral-care", "first-dental-visit"],
    review: unreviewed,
  },
  {
    slug: "extractions",
    name: "Extractions",
    category: "restorative",
    confirmed: false,
    summary:
      "Safe, comfortable removal of severely damaged, non-restorable, or impacted teeth.",
    headline: "Gentle, pain-free tooth extractions with fast healing.",
    intro:
      "When a tooth is severely damaged or threatens your surrounding oral health, our gentle extraction techniques ensure maximum comfort.",
    geoDirectAnswer:
      "Dental extractions at Dr Ali Dental Centre provide safe, gentle removal of severely decayed, broken, infected, or impacted teeth. Using modern local anesthesia and minimally traumatic surgical techniques, our dentists prioritize patient comfort, rapid healing, and future tooth-replacement planning.",
    procedureType: "SurgicalProcedure",
    image: images.clinicRoom,
    imageAlt:
      "Modern sterile treatment operatory for gentle dental extractions at Dr Ali Dental Centre",
    imageWidth: 1600,
    imageHeight: 1200,
    lastmod: "2026-04-01",
    fee: unknownFee("Per tooth, based on surgical complexity"),
    included: [
      "Pre-extraction diagnostic assessment and X-ray",
      "Effective local anesthesia for complete numbness",
      "Gentle tooth removal and socket preservation care",
      "Post-operative care pack and guidance",
    ],
    additional: [
      "Surgical extraction for impacted wisdom teeth",
      "Bone grafting for future implant placement",
    ],
    overview: [
      "While preserving natural teeth is always our priority, extraction becomes necessary when extensive decay, fractures, or overcrowding compromise your mouth.",
      "We use gentle, minimally invasive techniques to protect the surrounding bone and gums for smooth healing.",
    ],
    highlights: [
      {
        title: "Completely numbed",
        body: "Advanced local anesthetics ensure you feel pressure, not pain.",
      },
      {
        title: "Quick recovery",
        body: "Clear post-operative instructions help the socket heal comfortably.",
      },
    ],
    suitability:
      "Appropriate for non-restorable teeth, severe impactions, or orthodontic space creation after thorough radiographic evaluation.",
    journey: [
      {
        title: "Evaluation & X-ray",
        body: "We assess the tooth roots and surrounding bone structure.",
      },
      {
        title: "Gentle removal",
        body: "The tooth is gently mobilized and removed under complete local numbing.",
      },
      {
        title: "Recovery care",
        body: "Gauze is placed, and clear home-care instructions are explained.",
      },
    ],
    aftercare: [
      "Bite gently on the gauze for 30–45 minutes.",
      "Avoid vigorous rinsing, spitting, or using a straw for 24 hours.",
      "Stick to soft foods and cool drinks for the first day.",
    ],
    faqs: [
      {
        question: "Will the extraction hurt?",
        answer:
          "No, the area is completely numbed with local anesthesia before starting. You will only feel slight movement or pressure.",
      },
      {
        question: "How long does the socket take to heal?",
        answer:
          "The gum tissue typically closes within 1 to 2 weeks, while the underlying bone heals fully over several months.",
      },
    ],
    related: ["dental-implants", "removable-dentures", "crowns-and-bridges"],
    articles: ["treatment-estimate", "first-dental-visit"],
    review: unreviewed,
  },
  {
    slug: "composite-filling",
    name: "Composite Filling",
    category: "restorative",
    confirmed: false,
    summary:
      "Natural-looking, tooth-colored restorations that repair cavities and preserve healthy enamel.",
    headline: "Seamless tooth repairs that blend naturally with your smile.",
    intro:
      "Repair cavities, chips, and worn areas with durable composite resin matched exactly to your natural tooth shade.",
    geoDirectAnswer:
      "Composite fillings at Dr Ali Dental Centre treat tooth decay, chipping, and wear using durable, tooth-colored composite resins that bond directly to natural tooth enamel. Performed comfortably with local numbing, dentists remove bacteria, sterilize the cavity, and sculpt the composite to match your natural bite and tooth color seamlessly.",
    procedureType: "NoninvasiveProcedure",
    image: images.clinicRoom,
    imageAlt:
      "Dental operatory equipped for tooth-colored composite restorations at Dr Ali Dental Centre",
    imageWidth: 1600,
    imageHeight: 1200,
    lastmod: "2026-04-01",
    fee: unknownFee("Per tooth, depending on surface size"),
    included: [
      "Removal of decay and cavity disinfection",
      "Shade-matched composite resin layering",
      "Curing with specialized LED light",
      "Bite adjustment and final polishing",
    ],
    additional: [
      "Diagnostic digital X-rays",
      "Deep cavity pulp capping if near the nerve",
    ],
    overview: [
      "Composite fillings bond chemically to your natural tooth structure, requiring less removal of healthy enamel than traditional amalgam fillings.",
      "They are custom-tinted to match your surrounding teeth so the restoration is virtually indistinguishable.",
    ],
    highlights: [
      {
        title: "Tooth-colored",
        body: "Custom blended to match the exact shade and translucency of your tooth.",
      },
      {
        title: "Preserves tooth structure",
        body: "Requires minimal drilling compared to old metal fillings.",
      },
    ],
    suitability:
      "Ideal for small-to-moderate cavities, chipped front teeth, or replacing deteriorated silver fillings.",
    journey: [
      {
        title: "Preparation",
        body: "The tooth is cleaned, numbed if necessary, and decay is gently removed.",
      },
      {
        title: "Bonding & Sculpting",
        body: "Composite resin is applied in layers and shaped to natural tooth anatomy.",
      },
      {
        title: "Polishing",
        body: "The restoration is hardened with a curing light and polished smooth.",
      },
    ],
    aftercare: [
      "Avoid chewing hard foods until local anesthesia wears off.",
      "Maintain daily flossing around the filled tooth.",
    ],
    faqs: [
      {
        question: "How long do composite fillings last?",
        answer:
          "With good oral hygiene and regular check-ups, composite fillings typically last 7 to 10 years or longer.",
      },
      {
        question: "Will the filling be visible when I smile?",
        answer:
          "No, we select a shade that matches your natural tooth color closely so it blends seamlessly.",
      },
    ],
    related: ["rct-root-canal", "scaling-and-polishing", "crowns-and-bridges"],
    articles: ["treatment-estimate", "everyday-oral-care"],
    review: unreviewed,
  },
  {
    slug: "crowns-and-bridges",
    name: "Crowns & Bridges",
    category: "restorative",
    confirmed: false,
    summary:
      "Durable ceramic and porcelain restorations to strengthen broken teeth and bridge missing gaps.",
    headline:
      "Restore strength, function, and aesthetics to compromised teeth.",
    intro:
      "Protect cracked or heavily restored teeth with custom crowns, or replace missing teeth permanently with fixed dental bridges.",
    geoDirectAnswer:
      "Dental crowns and bridges at Dr Ali Dental Centre provide durable, bespoke prosthetics that restore structurally compromised teeth or replace one or more missing teeth. Crafted from premium zirconia or porcelain, crowns encase weak teeth while bridges anchor replacement teeth firmly to adjacent abutments.",
    procedureType: "NoninvasiveProcedure",
    image: images.clinicRoom2,
    imageAlt:
      "Precision dental prosthetic equipment for crowns and bridges at Dr Ali Dental Centre",
    imageWidth: 1200,
    imageHeight: 900,
    lastmod: "2026-04-01",
    fee: unknownFee("Per crown or bridge unit"),
    included: [
      "Tooth preparation and precision impressions",
      "Temporary crown or bridge placement",
      "Custom laboratory fabrication from zirconia or porcelain",
      "Permanent bonding and bite calibration",
    ],
    additional: [
      "Core buildup or post placement for weakened teeth",
      "Diagnostic shade consultation",
    ],
    overview: [
      "A crown completely covers a damaged tooth to protect it from fracture and restore its original contour and strength.",
      "A dental bridge spans the space where one or more teeth are missing, anchored securely to natural teeth or implants on either side.",
    ],
    highlights: [
      {
        title: "High-strength ceramics",
        body: "Fabricated from lifelike zirconia and porcelain for long-lasting durability.",
      },
      {
        title: "Restores chewing power",
        body: "Allows you to eat your favorite foods with complete confidence.",
      },
    ],
    suitability:
      "Suitable for teeth with large fractures, teeth after root canal treatment, or replacing missing teeth adjacent to healthy anchors.",
    journey: [
      {
        title: "Tooth preparation",
        body: "The tooth is shaped and a precise impression is captured.",
      },
      {
        title: "Temporary crown",
        body: "A temporary restoration protects your tooth while the custom piece is crafted.",
      },
      {
        title: "Fitting & cementation",
        body: "The finished crown or bridge is checked for fit, bite, and permanently cemented.",
      },
    ],
    aftercare: [
      "Avoid very sticky foods for the first 24 hours after cementation.",
      "Use superfloss or interdental brushes under bridge pontics.",
    ],
    faqs: [
      {
        question: "What is the difference between a crown and a bridge?",
        answer:
          "A crown caps an individual existing damaged tooth. A bridge replaces one or more missing teeth by anchoring to the teeth on either side.",
      },
      {
        question: "How long do dental crowns last?",
        answer:
          "Well-maintained porcelain and zirconia crowns commonly last 10 to 15 years or more with regular dental visits.",
      },
    ],
    related: ["rct-root-canal", "dental-implants", "composite-filling"],
    articles: ["treatment-estimate", "first-dental-visit"],
    review: unreviewed,
  },
  {
    slug: "removable-dentures",
    name: "Removable Dentures",
    category: "restorative",
    confirmed: false,
    summary:
      "Custom full and partial dentures designed for natural comfort, facial support, and chewing confidence.",
    headline: "Comfortable, lifelike dentures tailored to your smile.",
    intro:
      "Regain your smile and bite functionality with lightweight, custom-fitted partial or complete removable dentures.",
    geoDirectAnswer:
      "Removable dentures at Dr Ali Dental Centre are custom-fabricated prosthetic appliances replacing multiple or all missing teeth. Tailored to the unique contours of your mouth, modern acrylic and flexible dentures provide dependable chewing function, facial volume support, and a natural, radiant smile.",
    procedureType: "NoninvasiveProcedure",
    image: images.waiting,
    imageAlt:
      "Comfortable consultation environment for denture fittings at Dr Ali Dental Centre",
    imageWidth: 1000,
    imageHeight: 750,
    lastmod: "2026-04-01",
    fee: unknownFee("Per arch, complete or partial"),
    included: [
      "Detailed oral examination and jaw measurements",
      "Diagnostic impressions and custom tray fabrication",
      "Wax try-in appointment to preview appearance and bite",
      "Final denture delivery and adjustment appointments",
    ],
    additional: [
      "Denture relining or repair",
      "Special flexible valplast or cobalt-chrome frameworks",
    ],
    overview: [
      "Modern dentures look more natural and fit more securely than ever before.",
      "Whether you need a partial denture to replace several missing teeth or a complete set, we take the time to ensure proper bite alignment and comfortable aesthetics.",
    ],
    highlights: [
      {
        title: "Facial support",
        body: "Restores natural lip and cheek volume for a youthful facial contour.",
      },
      {
        title: "Custom aesthetics",
        body: "Tooth size, shape, and gum tinting are customized to suit your face.",
      },
    ],
    suitability:
      "Recommended for patients with multiple missing teeth seeking a dependable, non-surgical restoration.",
    journey: [
      {
        title: "Initial impressions",
        body: "Precise molds of your gums and jaw ridges are made.",
      },
      {
        title: "Wax try-in",
        body: "You preview the appearance, tooth shade, and bite before final processing.",
      },
      {
        title: "Fitting & adjustments",
        body: "We fit your completed denture and schedule follow-ups to relieve any pressure spots.",
      },
    ],
    aftercare: [
      "Clean dentures daily with a soft denture brush and mild cleaner.",
      "Remove them at night to give your gums a rest.",
    ],
    faqs: [
      {
        question: "Will dentures look natural?",
        answer:
          "Yes, modern dentures use premium acrylics with subtle color variations that closely emulate natural gums and teeth.",
      },
      {
        question: "How long does it take to get used to new dentures?",
        answer:
          "Most patients adapt within 2 to 4 weeks as the mouth muscles learn to accommodate the new appliance.",
      },
    ],
    related: ["extractions", "dental-implants", "crowns-and-bridges"],
    articles: ["treatment-estimate", "first-dental-visit"],
    review: unreviewed,
  },
  {
    slug: "veneers",
    name: "Veneers",
    category: "cosmetic",
    confirmed: false,
    summary:
      "Ultra-thin porcelain or composite shells that transform chipped, stained, or uneven teeth.",
    headline:
      "A harmonious, radiant smile designed specifically for your face.",
    intro:
      "Custom-crafted veneers bond to the front of teeth to correct deep stains, gaps, chips, and minor misalignments.",
    geoDirectAnswer:
      "Porcelain and composite veneers at Dr Ali Dental Centre are ultra-thin, tailor-made shells bonded to the front surface of teeth to correct discoloration, gaps, chips, or minor asymmetries. Veneers provide a durable, luminous, and natural smile enhancement customized to your facial aesthetics.",
    procedureType: "NoninvasiveProcedure",
    image: images.clinicRoom,
    imageAlt:
      "Cosmetic dentistry consultation room for dental veneers at Dr Ali Dental Centre",
    imageWidth: 1600,
    imageHeight: 1200,
    lastmod: "2026-04-01",
    fee: unknownFee("Per veneer unit"),
    included: [
      "Comprehensive cosmetic smile design consultation",
      "Minimal tooth preparation and shade selection",
      "High-precision digital or silicone impressions",
      "Bonding with specialized aesthetic resin cements",
    ],
    additional: [
      "Diagnostic mock-up preview",
      "Nightguard to protect veneers from grinding",
    ],
    overview: [
      "Dental veneers are thin, custom-made ceramic or composite facings designed to conceal cosmetic imperfections.",
      "They reflect light just like natural tooth enamel and are highly resistant to staining from coffee, tea, and tobacco.",
    ],
    highlights: [
      {
        title: "Lifelike translucency",
        body: "Replicates the light-reflecting quality of natural enamel.",
      },
      {
        title: "Stain resistant",
        body: "Porcelain resists surface staining far better than natural teeth.",
      },
    ],
    suitability:
      "Ideal for patients with healthy gums who want to correct discolored, chipped, gapped, or slightly crooked teeth.",
    journey: [
      {
        title: "Smile consultation",
        body: "We discuss your aesthetic goals, take photos, and plan your smile proportion.",
      },
      {
        title: "Preparation & impressions",
        body: "A microscopic layer of enamel is prepared and precise impressions are taken.",
      },
      {
        title: "Bonding",
        body: "Each veneer is individually checked for symmetry, color, and permanently bonded.",
      },
    ],
    aftercare: [
      "Brush twice daily and floss carefully around veneer margins.",
      "Avoid biting down on hard objects like ice, pens, or bottle caps.",
    ],
    faqs: [
      {
        question: "Is the veneer procedure reversible?",
        answer:
          "Because a tiny amount of enamel is usually removed to fit porcelain veneers, the process is considered irreversible. Composite veneers may require less preparation.",
      },
      {
        question: "How long do porcelain veneers last?",
        answer:
          "With good oral hygiene and routine dental visits, porcelain veneers typically last 10 to 15 years or longer.",
      },
    ],
    related: ["teeth-whitening", "clear-aligners", "composite-filling"],
    articles: ["questions-whitening", "treatment-estimate"],
    review: unreviewed,
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    category: "restorative",
    confirmed: false,
    summary:
      "Permanent titanium tooth replacements that look, feel, and function like natural teeth.",
    headline: "Permanent tooth replacement built to last a lifetime.",
    intro:
      "The gold standard for replacing missing teeth: biocompatible implants that restore chewing power and bone health.",
    geoDirectAnswer:
      "Dental implants at Dr Ali Dental Centre are permanent tooth replacement solutions consisting of biocompatible titanium fixtures anchored into the jawbone, topped with bespoke porcelain crowns. Implants prevent bone resorption, preserve adjacent teeth, and provide natural-looking chewing strength.",
    procedureType: "SurgicalProcedure",
    image: images.clinicRoom2,
    imageAlt:
      "Advanced surgical operatory for dental implant placement at Dr Ali Dental Centre",
    imageWidth: 1200,
    imageHeight: 900,
    lastmod: "2026-04-01",
    fee: unknownFee("Per implant, after clinical assessment"),
    included: [
      "Comprehensive 3D radiographic assessment",
      "Surgical implant placement with sterile protocol",
      "Healing abutment and integration monitoring",
      "Custom ceramic implant crown and final torque verification",
    ],
    additional: [
      "Bone grafting or sinus lift if bone volume is reduced",
      "Sedation options for anxious patients",
      "Routine dental and hygiene check appointments",
    ],
    overview: [
      "A dental implant is a titanium post placed into the jawbone where it integrates naturally with the bone.",
      "It serves as a sturdy root anchor for an individual crown, a bridge, or an implant-retained denture without compromising neighboring teeth.",
    ],
    highlights: [
      {
        title: "Protects jawbone",
        body: "Prevents the bone shrinkage that naturally follows tooth loss.",
      },
      {
        title: "Independent foundation",
        body: "Healthy adjacent teeth do not need to be shaved down.",
      },
      {
        title: "Lifelong potential",
        body: "With proper oral hygiene, implants are designed to last decades.",
      },
    ],
    suitability:
      "Suitable for adults with missing teeth, good general health, and sufficient jawbone density.",
    journey: [
      {
        title: "Planning & imaging",
        body: "Digital diagnostics evaluate bone depth and map implant trajectory.",
      },
      {
        title: "Placement",
        body: "The titanium implant is placed under local anesthesia with minimal discomfort.",
      },
      {
        title: "Restoration",
        body: "After osseointegration, a custom abutment and porcelain crown are fitted.",
      },
    ],
    aftercare: [
      "Maintain impeccable brushing and flossing around the implant post.",
      "Attend regular dental hygiene check-ups every 6 months.",
    ],
    faqs: [
      {
        question: "Are dental implants painful?",
        answer:
          "The procedure is performed under local anesthesia and is surprisingly comfortable. Most patients report less discomfort than a tooth extraction.",
      },
      {
        question: "How long does the whole implant process take?",
        answer:
          "Typically 3 to 6 months to allow the implant to fully fuse with the jawbone before the permanent crown is attached.",
      },
    ],
    related: ["crowns-and-bridges", "extractions", "removable-dentures"],
    articles: ["treatment-estimate", "first-dental-visit"],
    review: unreviewed,
  },
  {
    slug: "clear-aligners",
    name: "Clear Aligners",
    category: "cosmetic",
    confirmed: false,
    summary:
      "Virtually invisible, removable aligner trays that straighten teeth discreetly without metal wires.",
    headline:
      "Straighten your teeth discreetly with removable transparent trays.",
    intro:
      "Achieve a beautifully aligned smile without brackets or metal wires using custom 3D-designed clear aligners.",
    geoDirectAnswer:
      "Clear aligners at Dr Ali Dental Centre offer a modern, discreet alternative to traditional braces. Utilizing a series of custom 3D-mapped transparent trays, clear aligners gently shift teeth into optimal alignment without metal wires, allowing normal eating, easy brushing, and seamless daily life.",
    procedureType: "NoninvasiveProcedure",
    image: images.clinicRoom,
    imageAlt:
      "Orthodontic alignment consultation space at Dr Ali Dental Centre",
    imageWidth: 1600,
    imageHeight: 1200,
    lastmod: "2026-04-01",
    fee: unknownFee("Per course of treatment"),
    included: [
      "Digital 3D intraoral scan and treatment simulation",
      "Series of custom-made clear aligner trays",
      "Regular progress reviews with your dentist",
      "Initial set of retainers after alignment",
    ],
    additional: [
      "Composite attachments (buttons) if needed for complex rotations",
      "Interproximal reduction (IPR) if spacing requires",
    ],
    overview: [
      "Clear aligners use modern 3D imaging technology to manufacture a series of transparent, medical-grade plastic trays.",
      "Each tray applies gentle, controlled pressure to move specific teeth into place. You switch to the next tray every 1 to 2 weeks.",
    ],
    highlights: [
      {
        title: "Nearly invisible",
        body: "Others will hardly notice you are wearing orthodontic trays.",
      },
      {
        title: "Removable convenience",
        body: "Take them out to eat whatever you like and brush normally.",
      },
    ],
    suitability:
      "Effective for mild-to-moderate crowding, spacing, relapse from previous braces, and minor bite misalignments.",
    journey: [
      {
        title: "3D digital scan",
        body: "We scan your teeth and generate a 3D digital model showing your smile transformation.",
      },
      {
        title: "Tray manufacturing",
        body: "Your custom set of precision aligners is fabricated.",
      },
      {
        title: "Wearing your aligners",
        body: "Wear each set 20–22 hours per day, changing to the next tray as directed.",
      },
    ],
    aftercare: [
      "Clean aligners daily with cool water and a soft toothbrush.",
      "Wear retainers as prescribed after treatment to maintain results.",
    ],
    faqs: [
      {
        question: "How many hours a day do I need to wear clear aligners?",
        answer:
          "For best results, aligners should be worn 20 to 22 hours per day, only removing them to eat, drink hot beverages, and brush.",
      },
      {
        question: "How long does clear aligner treatment take?",
        answer:
          "Most cases take between 6 and 18 months, depending on the degree of tooth movement needed.",
      },
    ],
    related: ["braces-and-alignment", "veneers", "scaling-and-polishing"],
    articles: ["first-dental-visit", "treatment-estimate"],
    review: unreviewed,
  },
  {
    slug: "braces-and-alignment",
    name: "Braces and Alignment",
    category: "cosmetic",
    confirmed: false,
    summary:
      "Precision orthodontic braces to correct complex teeth misalignments, spacing, and bite irregularities.",
    headline:
      "Reliable orthodontic solutions for balanced smiles and functional bites.",
    intro:
      "Comprehensive orthodontic treatment for children, teenagers, and adults to achieve ideal dental alignment and bite harmony.",
    geoDirectAnswer:
      "Orthodontic braces at Dr Ali Dental Centre correct complex dental crowding, bite misalignments (overbite, underbite, crossbite), and severe spacing irregularities. Through precision brackets and archwires, our orthodontic treatments deliver lifelong bite functionality and aesthetic facial balance.",
    procedureType: "NoninvasiveProcedure",
    image: images.clinicRoom2,
    imageAlt:
      "Orthodontic care station for dental braces and alignment at Dr Ali Dental Centre",
    imageWidth: 1200,
    imageHeight: 900,
    lastmod: "2026-04-01",
    fee: unknownFee("Complete treatment, phased payments"),
    included: [
      "Orthodontic diagnostic analysis and cephalometric evaluation",
      "Placement of precision brackets and initial archwires",
      "Routine monthly adjustments and wire progressions",
      "Post-treatment retainers to stabilize results",
    ],
    additional: [
      "Aesthetic ceramic (clear) brackets option",
      "Specialized bite correction appliances",
    ],
    overview: [
      "Traditional and ceramic braces remain the most versatile and powerful tool for correcting complex dental misalignments.",
      "By guiding teeth and their roots gently through the jawbone, orthodontic treatment enhances both your smile appearance and the long-term health of your teeth and jaw joints.",
    ],
    highlights: [
      {
        title: "Comprehensive correction",
        body: "Capable of handling complex bite issues, rotations, and severe crowding.",
      },
      {
        title: "Long-term joint health",
        body: "A balanced bite reduces abnormal tooth wear and jaw joint stress.",
      },
    ],
    suitability:
      "Suitable for patients of all ages, from growing children to adults seeking definitive bite and alignment correction.",
    journey: [
      {
        title: "Orthodontic consultation",
        body: "Diagnostic X-rays, photos, and dental models are analyzed to plan tooth movements.",
      },
      {
        title: "Braces bonding",
        body: "Brackets are carefully bonded to each tooth and the initial flexible archwire is placed.",
      },
      {
        title: "Adjustments & retention",
        body: "Periodic adjustments guide your teeth into optimal position, followed by retainers.",
      },
    ],
    aftercare: [
      "Brush meticulously after every meal using orthodontic toothbrushes and interdental aids.",
      "Avoid hard, crunchy, or sticky foods that could dislodge brackets.",
    ],
    faqs: [
      {
        question: "Am I too old for braces?",
        answer:
          "Not at all! Healthy teeth can be moved at any age. Many adults successfully undergo orthodontic treatment.",
      },
      {
        question: "Do braces hurt?",
        answer:
          "You may feel mild tenderness for 2 to 4 days after brackets are placed or adjusted. This responds well to mild over-the-counter pain relief.",
      },
    ],
    related: ["clear-aligners", "scaling-and-polishing", "composite-filling"],
    articles: ["first-dental-visit", "everyday-oral-care"],
    review: unreviewed,
  },
  {
    slug: "rct-root-canal",
    name: "RCT (Root Canal Treatment)",
    category: "restorative",
    confirmed: false,
    summary:
      "Gentle, pain-relieving endodontic care to clear deep tooth infections and save your natural tooth.",
    headline: "Painless infection relief that preserves your natural tooth.",
    intro:
      "Targeted root canal therapy clears infected nerve tissue, disinfects the inner chamber, and saves your tooth from extraction.",
    geoDirectAnswer:
      "Root canal treatment (RCT) at Dr Ali Dental Centre eliminates deep tooth infection, stops severe toothache, and preserves natural teeth. Performed comfortably under local anesthesia, our dentists thoroughly clean, disinfect, and seal infected canals before placing a protective restoration.",
    procedureType: "SurgicalProcedure",
    image: images.clinicRoom2,
    imageAlt:
      "Sterile endodontic treatment operatory for root canal therapy at Dr Ali Dental Centre",
    imageWidth: 1200,
    imageHeight: 900,
    lastmod: "2026-04-01",
    fee: unknownFee("Per tooth, according to canal complexity"),
    included: [
      "Diagnostic digital periapical radiographs",
      "Complete local anesthesia and rubber dam isolation",
      "Canal debridement, shaping, and medicinal disinfection",
      "Biocompatible gutta-percha canal sealing",
    ],
    additional: ["Post-and-core reinforcement", "Protective porcelain crown"],
    overview: [
      "When dental decay or trauma reaches the nerve (pulp) inside the tooth, it causes inflammation and severe pain.",
      "Root canal treatment eliminates the infection by cleaning and sealing the hollow root canals, allowing you to keep your natural tooth for decades.",
    ],
    highlights: [
      {
        title: "Immediate pain relief",
        body: "Resolves throbbing toothaches and removes the source of dental infection.",
      },
      {
        title: "Saves your tooth",
        body: "Retaining your natural root preserves bone and natural bite dynamics.",
      },
    ],
    suitability:
      "Indicated for teeth with deep decay reaching the pulp, irreversible pulpitis, dental abscesses, or trauma.",
    journey: [
      {
        title: "Diagnosis & anesthesia",
        body: "Digital X-rays verify canal anatomy and the tooth is fully numbed.",
      },
      {
        title: "Cleaning & shaping",
        body: "Fine rotary instruments clean and disinfect each root canal canal thoroughly.",
      },
      {
        title: "Sealing & protection",
        body: "The canals are sealed with biocompatible material and prepared for a final crown.",
      },
    ],
    aftercare: [
      "Avoid chewing on the treated tooth until the final permanent crown is placed.",
      "Mild tenderness when chewing is normal for a few days and subsides quickly.",
    ],
    faqs: [
      {
        question: "Is a root canal treatment painful?",
        answer:
          "With modern local anesthesia, root canal treatment is as comfortable as getting a routine filling. It relieves the pain caused by the infected nerve.",
      },
      {
        question: "Why does a tooth need a crown after RCT?",
        answer:
          "Once the nerve and blood supply are removed, the tooth becomes more brittle. A custom crown protects it from cracking during normal chewing.",
      },
    ],
    related: ["crowns-and-bridges", "composite-filling", "dental-implants"],
    articles: ["treatment-estimate", "first-dental-visit"],
    review: unreviewed,
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    category: "cosmetic",
    confirmed: false,
    summary:
      "Safe, professionally supervised whitening treatments that lift stubborn stains and brighten enamel.",
    headline:
      "A noticeably brighter, cleaner smile planned with clinical care.",
    intro:
      "Clinically supervised teeth whitening safely lightens discoloration caused by coffee, tea, smoking, and aging.",
    geoDirectAnswer:
      "Professional teeth whitening at Dr Ali Dental Centre is a safe, dentist-supervised cosmetic procedure that lifts deep food, tea, coffee, and tobacco stains from tooth enamel. We formulate customized treatment strengths to ensure maximum whitening efficacy while preventing tooth sensitivity.",
    procedureType: "NoninvasiveProcedure",
    image: images.clinicRoom,
    imageAlt: "Cosmetic whitening consultation suite at Dr Ali Dental Centre",
    imageWidth: 1600,
    imageHeight: 1200,
    lastmod: "2026-04-01",
    fee: unknownFee("Per course of whitening"),
    included: [
      "Pre-whitening shade assessment and tooth health check",
      "Protective gum barrier application",
      "Professional-grade whitening gel application",
      "Post-treatment desensitizing treatment and shade verification",
    ],
    additional: ["Custom take-home maintenance whitening trays"],
    overview: [
      "Over time, daily consumption of tea, coffee, spices, and natural aging can cause teeth to take on a dull or yellowish shade.",
      "Professional whitening gently breaks down organic stain molecules within the enamel without weakening tooth structure.",
    ],
    highlights: [
      {
        title: "Enamel safe",
        body: "Clinically tested whitening gels that protect tooth mineral structure.",
      },
      {
        title: "Noticeable results",
        body: "Brightens teeth several shades lighter under direct dental supervision.",
      },
    ],
    suitability:
      "Suitable for adults with healthy teeth and gums seeking a brighter smile. Existing fillings or crowns do not change color.",
    journey: [
      {
        title: "Initial shade evaluation",
        body: "We record your starting tooth shade and check gum health.",
      },
      {
        title: "Whitening treatment",
        body: "Gums are protected and whitening gel is applied in controlled sessions.",
      },
      {
        title: "Shade reveal",
        body: "We evaluate the lighter shade and discuss tips to maintain your bright smile.",
      },
    ],
    aftercare: [
      "Avoid strongly colored foods and drinks (tea, coffee, curries) for 48 hours.",
      "Use a desensitizing toothpaste if temporary sensitivity occurs.",
    ],
    faqs: [
      {
        question: "How long do whitening results last?",
        answer:
          "Results typically last 1 to 2 years, depending on your diet and smoking habits. Periodic touch-ups can maintain the brightness indefinitely.",
      },
      {
        question: "Will whitening harm my enamel?",
        answer:
          "No, professional whitening supervised by a dentist is completely safe for tooth enamel.",
      },
    ],
    related: ["scaling-and-polishing", "veneers", "composite-filling"],
    articles: ["questions-whitening", "everyday-oral-care"],
    review: unreviewed,
  },
]

export const slugAliases: Record<string, string> = {
  "check-ups": "scaling-and-polishing",
  cleaning: "scaling-and-polishing",
  fillings: "composite-filling",
  "root-canal-care": "rct-root-canal",
}

export const getService = (slug: string) => {
  const resolved = slugAliases[slug] || slug
  return services.find((s) => s.slug === resolved)
}

export interface Clinician {
  id: string
  /** Used for the #anchor on /team/. There are no individual clinician routes. */
  slug: string
  /** Full professional name exactly as approved. */
  name: string | null
  role: string | null
  /** Approved photograph only. width/height are the file's real pixel size. */
  portrait: { src: string ; width: number ; height: number } | null
  portraitAlt: string | null
  /** Exact supplied wording, one credential per item. */
  qualifications: string[]
  /** "Areas of clinical focus". Only call something a specialty if registered as one. */
  clinicalFocus: string[]
  /** Free text, e.g. "Practising since 2012". Never auto-calculated. */
  experienceText: string | null
  registrationBody: string | null
  registrationNumber: string | null
  bio: string | null
  /** Clinician-approved, roughly 40–70 words. */
  approachToCare: string | null
  relatedServiceSlugs: string[]
  displayOrder: number
  /** Only published profiles appear on the live site. */
  published: boolean
  /** Layout-preview stand-in: shown in development only, always labelled. */
  placeholder?: boolean
}

/**
 * The single source for team data (used by /team/, About, schema and service pages).
 */
export const clinicians: Clinician[] = [
  {
    id: "dr-ali-azhar",
    slug: "dr-ali-azhar",
    name: "Dr. Ali Azhar",
    role: "Dentist & Founder",
    portrait: {
      src: "/team/dr-ali-azhar.png",
      width: 365,
      height: 430,
    },
    portraitAlt: "Dr. Ali Azhar - Dentist & Founder at Dr Ali Dental Centre",
    qualifications: [
      "B.D.S, R.D.S (PMDC)",
      "C-Ortho, C-Endo",
      "Islamabad Dental Hospital",
    ],
    clinicalFocus: [
      "Cosmetic Dentistry & Smile Transformations",
      "Restorative Dentistry & Composite Fillings",
      "Endodontics (Root Canal Treatment)",
      "Teeth Whitening & Veneers",
    ],
    experienceText: "7+ Years · Cosmetic & Restorative Dentistry",
    registrationBody: "PMDC (Pakistan Medical & Dental Council)",
    registrationNumber: "Verified R.D.S",
    bio: "Dr. Ali Azhar founded Dr Ali Dental Centre with a vision to make world-class dental care accessible and comfortable. His artistry in cosmetic dentistry has transformed thousands of smiles.",
    approachToCare:
      "I believe that true excellence in dentistry begins with unhurried listening and genuine gentleness. Every smile is unique, and our goal is to combine aesthetic precision with long-term oral health so you feel completely at ease and confident in your care.",
    relatedServiceSlugs: [
      "veneers",
      "teeth-whitening",
      "composite-filling",
      "rct-root-canal",
      "dental-implants",
    ],
    displayOrder: 1,
    published: true,
    placeholder: false,
  },
  {
    id: "dr-maria-khan",
    slug: "dr-maria-khan",
    name: "Dr. Maria Khan",
    role: "Dentist",
    portrait: {
      src: "/team/dr-maria-khan.png",
      width: 477,
      height: 567,
    },
    portraitAlt: "Dr. Maria Khan - Dentist at Dr Ali Dental Centre",
    qualifications: [
      "B.D.S, R.D.S (PMDC)",
      "C-Ortho, C-Prostho, C-Implant",
      "Gold Medalist",
      "Allied Hospital, Faisalabad",
    ],
    clinicalFocus: [
      "Braces & Orthodontic Alignment",
      "Clear Aligners",
      "Prosthodontics (Crowns & Bridges, Dentures)",
      "Dental Implants",
    ],
    experienceText: "6+ Years · Braces & Clear Aligners",
    registrationBody: "PMDC (Pakistan Medical & Dental Council)",
    registrationNumber: "Verified R.D.S",
    bio: "Dr. Maria Khan is a specialist in orthodontics, dedicated to creating perfectly aligned smiles. With a passion for patient care and a gentle touch, she ensures every treatment is comfortable and effective.",
    approachToCare:
      "Orthodontics and restorative care can transform a person’s quality of life. I focus on gentle, minimally invasive techniques and meticulous alignment planning to ensure every patient experiences comfortable, predictable results.",
    relatedServiceSlugs: [
      "braces-and-alignment",
      "clear-aligners",
      "crowns-and-bridges",
      "removable-dentures",
      "dental-implants",
    ],
    displayOrder: 2,
    published: true,
    placeholder: false,
  },
  {
    id: "dr-usman-tariq",
    slug: "dr-usman-tariq",
    name: "Dr. Usman Tariq",
    role: "Dental Surgeon · Oral & Maxillofacial Surgery",
    portrait: {
      src: "/team/dr-usman-tariq.png",
      width: 477,
      height: 567,
    },
    portraitAlt: "Dr. Usman Tariq - Dental Surgeon at Dr Ali Dental Centre",
    qualifications: [
      "BDS — Bachelor of Dental Surgery",
      "PMDC Registration No. 8950-D",
      "Former Lecturer, Department of Oral Surgery / OMFS, University of Lahore",
    ],
    clinicalFocus: [
      "Oral & Maxillofacial Surgery (OMFS)",
      "Surgical Extractions & Wisdom Tooth Removal",
      "Dental Implants & Socket Preservation",
      "Minor Oral Surgery",
    ],
    experienceText: "Oral Surgery & Maxillofacial Expertise",
    registrationBody: "PMDC (Pakistan Medical & Dental Council)",
    registrationNumber: "8950-D",
    bio: "Dr. Usman Tariq is an accomplished dental surgeon with specialized expertise in oral and maxillofacial surgery. As a former lecturer in the Department of Oral Surgery at the University of Lahore, he combines extensive surgical acumen with a calm, gentle approach to complex extractions and implant care.",
    approachToCare:
      "Surgical dentistry should never feel intimidating. My priority is ensuring complete patient comfort through gentle, minimally invasive techniques, precise local anesthesia, and dedicated recovery support.",
    relatedServiceSlugs: [
      "extractions",
      "dental-implants",
      "crowns-and-bridges",
    ],
    displayOrder: 3,
    published: true,
    placeholder: false,
  },
]

export interface Review {
  author: string
  source: string
  date: string
  text: string
  url: string | null
}
/** Only genuine, attributable reviews. No scores are shown until real data exists. */
export const reviews: Review[] = []

export interface CaseStudy {
  timeline?: string
  context?: string
  followUp?: string
  title: string
  treatment: string
  clinician: string
  consentConfirmed: boolean
  before: string
  after: string
}
/** Only cases with documented patient consent. */
export const cases: CaseStudy[] = []

export interface Article {
  slug: string
  title: string
  category: string
  excerpt: string
  image: string
  imageAlt: string
  status: "draft" | "reviewed"
  author: string | null
  reviewer: string | null
  published: string | null
  lastmod?: string | null
  readingTimeMinutes?: number
  keywords?: string[]
  imageWidth?: number
  imageHeight?: number
}

export const articles: Article[] = [
  {
    slug: "first-dental-visit",
    title: "What to expect at your first dental visit",
    category: "Dental visits",
    excerpt:
      "A step-by-step guide to a first appointment, how to prepare and questions worth asking.",
    image: images.clinicRoom2,
    imageAlt:
      "Empty, brightly illuminated dental treatment operatory at DADC clinic",
    imageWidth: 1200,
    imageHeight: 900,
    status: "draft",
    author: "DADC Clinical Team",
    reviewer: null,
    published: null,
    lastmod: null,
    readingTimeMinutes: 4,
    keywords: [
      "first dental visit",
      "what to expect at the dentist",
      "initial dental checkup",
      "dental consultation preparation",
    ],
  },
  {
    slug: "treatment-estimate",
    title: "Understanding your treatment estimate",
    category: "Costs",
    excerpt:
      "What is usually included in a dental estimate, and how to ask about the details.",
    image: images.waiting,
    imageAlt:
      "Calm and comfortable patient reception area at DADC dental clinic",
    imageWidth: 1000,
    imageHeight: 750,
    status: "draft",
    author: "DADC Clinical Team",
    reviewer: null,
    published: null,
    lastmod: null,
    readingTimeMinutes: 5,
    keywords: [
      "dental treatment estimate",
      "dental pricing transparency",
      "dental cost breakdown",
      "dental quote explanation",
    ],
  },
  {
    slug: "everyday-oral-care",
    title: "A guide to everyday oral care",
    category: "Oral care",
    excerpt:
      "Simple daily habits to help keep your teeth and gums healthy between visits.",
    image: u("photo-1628444299889-734f3621220a", 1200),
    imageAlt:
      "Eco-friendly wooden toothbrush for daily oral hygiene maintenance",
    imageWidth: 1200,
    imageHeight: 900,
    status: "draft",
    author: "DADC Clinical Team",
    reviewer: null,
    published: null,
    lastmod: null,
    readingTimeMinutes: 4,
    keywords: [
      "everyday oral care",
      "proper teeth brushing technique",
      "daily flossing routine",
      "preventing gum disease",
    ],
  },
  {
    slug: "questions-whitening",
    title: "Questions to ask about teeth whitening",
    category: "Aesthetics",
    excerpt:
      "Points to discuss with your dentist before deciding whether whitening is right for you.",
    image: u("photo-1693692258834-74c62f467cb7", 1200),
    imageAlt:
      "Clean dental bristles and hygiene tools demonstrating enamel care during whitening",
    imageWidth: 1200,
    imageHeight: 900,
    status: "draft",
    author: "DADC Clinical Team",
    reviewer: null,
    published: null,
    lastmod: null,
    readingTimeMinutes: 5,
    keywords: [
      "teeth whitening questions",
      "safe cosmetic dental whitening",
      "teeth whitening consultation",
      "whitening expectations",
    ],
  },
]

export const getArticle = (slug: string) =>
  articles.find((a) => a.slug === slug)

/** Enable each navigation entry only after its page has been completed and approved. */
export const pageLaunch = { internationalClients: true, videos: true }

export const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services/" },
  { label: "Our work", to: "/work/" },
  { label: "Reviews", to: "/reviews/" },
  { label: "Team", to: "/team/" },
  { label: "About", to: "/about/" },
  ...(pageLaunch.internationalClients
    ? [{ label: "International Clients", to: "/international-clients/" }]
    : []),
  ...(pageLaunch.videos ? [{ label: "Videos", to: "/videos/" }] : []),
  { label: "Blog", to: "/blog/" },
  { label: "Contact", to: "/contact/" },
]

/* ---------------- Phase 2 content ---------------- */

/** External integrations. Each stays null until a verified value exists. */
export const integrations = {
  /** Verified URL where patients can leave a review (e.g. Google Business profile). */
  reviewSubmitUrl: null as string | null,
  /** Verified summary score, only if supplied with its source. */
  reviewSummary: null as {
    score: number
    count: number
    source: string
    url: string
  } | null,
  /** Endpoint that accepts appointment-request POSTs (JSON). null = no backend connected. */
  appointmentEndpoint: (import.meta.env?.VITE_APPOINTMENT_ENDPOINT ||
    null) as string | null,
  /** External directions link (e.g. Google Maps URL) for the verified address. */
  directionsUrl: "https://maps.app.goo.gl/kkKaiHisnZZbzoZ7A" as string | null,
}

/**
 * Development-only placeholder clinician profiles. Article drafts are shown
 * in every build with review labels and noindex on their detail pages.
 */
export const showDrafts: boolean = import.meta.env?.DEV === true

export interface ArticleSection {
  id: string
  title: string
  body: string
  points?: string[]
  sub?: { title: string ; body: string }[]
}

export interface ArticleBody {
  intro: string
  sections: ArticleSection[]
  services: string[]
  references: { label: string ; url: string }[]
}

export const articleBodies: Record<string, ArticleBody> = {
  "first-dental-visit": {
    intro:
      "A first visit is a chance to get to know the team, talk about your oral health and goals, and agree on next steps that feel right for you.",
    sections: [
      {
        id: "before-you-arrive",
        title: "Before you arrive",
        body: "A little preparation helps your appointment run smoothly.",
        points: [
          "Note any medications you take.",
          "Let us know about medical conditions or allergies.",
          "If you have recent dental X-rays elsewhere, tell us where they were taken.",
        ],
      },
      {
        id: "at-your-appointment",
        title: "At your appointment",
        body: "Your first visit may take a little longer so there is time to talk and examine properly.",
        points: [
          "We talk about your dental history and any concerns.",
          "Your teeth, gums and mouth are examined.",
          "X-rays may be suggested if they are clinically useful.",
        ],
        sub: [
          {
            title: "Talking through findings",
            body: "Your dentist explains what they see in plain language and outlines any options, with time for questions.",
          },
        ],
      },
      {
        id: "questions-to-bring",
        title: "Questions to bring",
        body: "Writing questions down in advance can help. A few examples:",
        points: [
          "Are there areas I should focus on at home?",
          "What options are available for my concern?",
          "Are there costs I should know about before deciding?",
        ],
      },
    ],
    services: ["scaling-and-polishing"],
    references: [],
  },
  "treatment-estimate": {
    intro:
      "A treatment estimate sets out what is proposed and what it is expected to cost. Knowing how to read one makes it easier to ask good questions.",
    sections: [
      {
        id: "what-it-covers",
        title: "What an estimate usually covers",
        body: "Estimates commonly list each proposed stage of treatment and its fee.",
        points: [
          "The treatment and the teeth involved.",
          "Separate stages, if treatment is phased.",
          "What is and is not included.",
        ],
      },
      {
        id: "questions-to-ask",
        title: "Questions worth asking",
        body: "It is reasonable to ask for clarity before agreeing to treatment.",
        points: [
          "Which items might change, and why?",
          "Are there alternative options?",
          "What follow-up appointments are included?",
        ],
      },
    ],
    services: ["dental-implants", "rct-root-canal"],
    references: [],
  },
  "everyday-oral-care": {
    intro:
      "Small daily habits make a real difference between visits. Here is a simple routine to discuss with your dentist.",
    sections: [
      {
        id: "brushing",
        title: "Brushing",
        body: "Brushing twice a day with a fluoride toothpaste is a common foundation. Your dentist can recommend a technique that suits you.",
      },
      {
        id: "between-teeth",
        title: "Cleaning between teeth",
        body: "Floss or interdental brushes reach areas a toothbrush misses. Ask which size or method suits your teeth.",
      },
      {
        id: "regular-visits",
        title: "Regular visits",
        body: "Check-ups and professional cleaning help spot changes early. How often you attend is a personal recommendation.",
      },
    ],
    services: ["scaling-and-polishing"],
    references: [],
  },
  "questions-whitening": {
    intro:
      "Whitening is a common request. These questions can help you have a useful conversation with your dentist before deciding.",
    sections: [
      {
        id: "am-i-suitable",
        title: "Am I suitable?",
        body: "Whitening is not appropriate for everyone. An assessment of your teeth and gums comes first.",
      },
      {
        id: "what-to-expect",
        title: "What should I expect?",
        body: "Results vary between people. Existing fillings and crowns do not change colour, which may affect your plan.",
        points: [
          "Ask about possible sensitivity.",
          "Ask how results can be maintained.",
        ],
      },
    ],
    services: ["teeth-whitening", "scaling-and-polishing"],
    references: [],
  },
}

/** Treatment interests offered in the contact form. */
export const treatmentOptions = ["Not sure", ...services.map((s) => s.name)]
