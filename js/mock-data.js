/**
 * ==========================================================================
 * MOCK DATA
 * Seed records for alumni directory, news stories, videos, and stats
 * ==========================================================================
 */

export const INITIAL_STATS = {
  totalAlumni: 28450,
  countriesRepresented: 52,
  activeChapters: 38,
  yearsOfExcellence: 45
};

export const INITIAL_ALUMNI = [
  {
    uid: "alumni-001",
    name: "Dr. Elena Rostova",
    email: "elena.rostova@biotech-innovations.org",
    gradYear: 2012,
    degree: "Ph.D. Biomedical Engineering",
    company: "Genovate Therapeutics",
    jobTitle: "VP of Molecular Therapeutics",
    city: "Boston, MA",
    country: "United States",
    industry: "Biotechnology & Healthcare",
    linkedin: "https://linkedin.com",
    bio: "Pioneering novel mRNA delivery mechanisms for targeted neurodegenerative therapies. Named MIT Technology Review 35 Under 35.",
    photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-01-15T08:30:00Z"
  },
  {
    uid: "alumni-002",
    name: "Marcus Vance",
    email: "marcus.vance@apexcapital.co",
    gradYear: 2008,
    degree: "B.S. Economics & Data Science",
    company: "Apex Capital Partners",
    jobTitle: "Managing Director & Co-Founder",
    city: "London",
    country: "United Kingdom",
    industry: "Venture Capital & Finance",
    linkedin: "https://linkedin.com",
    bio: "Backing early-stage climate tech and clean infrastructure across Europe and North America. Passionate university mentor.",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: true, // sample admin user for testing admin dashboard
    createdAt: "2023-02-10T11:20:00Z"
  },
  {
    uid: "alumni-003",
    name: "Aria Chen",
    email: "aria.chen@quantumreach.ai",
    gradYear: 2019,
    degree: "M.S. Computer Science",
    company: "Google DeepMind",
    jobTitle: "Senior Research Scientist",
    city: "San Francisco, CA",
    country: "United States",
    industry: "Artificial Intelligence & Software",
    linkedin: "https://linkedin.com",
    bio: "Focusing on multimodal foundation models and robotic dexterity. Former president of the University AI & Robotics Society.",
    photoURL: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-03-01T14:45:00Z"
  },
  {
    uid: "alumni-004",
    name: "David Adebayo",
    email: "david@luminaenergy.org",
    gradYear: 2015,
    degree: "B.S. Electrical Engineering",
    company: "Lumina Energy",
    jobTitle: "Head of Smart Grid Architecture",
    city: "Nairobi",
    country: "Kenya",
    industry: "Energy & Sustainability",
    linkedin: "https://linkedin.com",
    bio: "Deploying off-grid solar microgrids across East Africa, providing reliable power to over 200,000 rural households.",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-04-18T09:15:00Z"
  },
  {
    uid: "alumni-005",
    name: "Sofia Rodriguez",
    email: "sofia.rodriguez@civicjustice.org",
    gradYear: 2011,
    degree: "J.D. Law & Public Policy",
    company: "International Justice Council",
    jobTitle: "Chief Human Rights Counsel",
    city: "Geneva",
    country: "Switzerland",
    industry: "Law & Public Policy",
    linkedin: "https://linkedin.com",
    bio: "Advocating for international humanitarian compliance and privacy legislation. Keynote speaker at UN Youth Summits.",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-05-12T16:00:00Z"
  },
  {
    uid: "alumni-006",
    name: "Kenji Sato",
    email: "ksato@studio-form.jp",
    gradYear: 2016,
    degree: "Master of Architecture",
    company: "Kengo Kuma & Associates",
    jobTitle: "Lead Urban Designer",
    city: "Tokyo",
    country: "Japan",
    industry: "Architecture & Design",
    linkedin: "https://linkedin.com",
    bio: "Blending traditional timber joinery with computational generative structures for resilient seismic civic spaces.",
    photoURL: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-06-25T13:30:00Z"
  },
  {
    uid: "alumni-007",
    name: "Priya Sundaram",
    email: "priya@novalabs.tech",
    gradYear: 2021,
    degree: "B.S. Mechanical & Aerospace Engineering",
    company: "SpaceX",
    jobTitle: "Propulsion Integration Engineer",
    city: "Los Angeles, CA",
    country: "United States",
    industry: "Aerospace & Defense",
    linkedin: "https://linkedin.com",
    bio: "Working on upper-stage re-ignition systems for commercial orbital launch vehicles. University Rocketry Team alum.",
    photoURL: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-07-19T10:10:00Z"
  },
  {
    uid: "alumni-008",
    name: "Mateo Rossi",
    email: "mateo.rossi@veritasmedia.eu",
    gradYear: 2014,
    degree: "B.A. Journalism & Media Studies",
    company: "The Global Chronicle",
    jobTitle: "Investigative Senior Editor",
    city: "Milan",
    country: "Italy",
    industry: "Media & Journalism",
    linkedin: "https://linkedin.com",
    bio: "Pulitzer-nominated journalist covering algorithmic transparency, global supply chains, and digital sovereignty.",
    photoURL: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    verified: false,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-08-04T12:00:00Z"
  },
  {
    uid: "alumni-009",
    name: "Zainab Al-Mansoor",
    email: "zainab@fintech-gulf.com",
    gradYear: 2018,
    degree: "B.S. Information Systems",
    company: "Stripe",
    jobTitle: "Engineering Manager - Global Payouts",
    city: "Dubai",
    country: "United Arab Emirates",
    industry: "Fintech & Payments",
    linkedin: "https://linkedin.com",
    bio: "Building high-throughput real-time payment rails across MENA and Southeast Asia. Passionate about empowering women in STEM.",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-09-14T15:20:00Z"
  },
  {
    uid: "alumni-010",
    name: "Liam O'Connor",
    email: "liam.oconnor@biosphere.ie",
    gradYear: 2023,
    degree: "B.S. Environmental Science",
    company: "McKinsey & Company",
    jobTitle: "Sustainability Strategy Consultant",
    city: "Dublin",
    country: "Ireland",
    industry: "Management Consulting",
    linkedin: "https://linkedin.com",
    bio: "Helping multinational corporations chart net-zero decarbonization pathways. Valedictorian Class of 2023.",
    photoURL: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    verified: true,
    profileComplete: true,
    isAdmin: false,
    createdAt: "2023-10-01T09:00:00Z"
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: "story-001",
    authorUid: "alumni-001",
    authorName: "Dr. Elena Rostova ('12)",
    title: "Breakthrough in Targeted mRNA Delivery for Rare Neurological Diseases",
    category: "Achievement",
    excerpt: "Elena's research team at Genovate Therapeutics has successfully passed Phase II clinical trials for a ground-breaking synthetic lipid carrier.",
    body: "After five years of intensive clinical lab trials, our team has achieved targeted blood-brain barrier penetration without systemic cytotoxicity. This breakthrough owes an immense debt to the foundational bioengineering principles forged in the university's advanced wet labs under Prof. Harrison. We look forward to initiating global pediatric compassionate use protocols by the fourth quarter.",
    imageURL: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    status: "approved",
    createdAt: "2026-08-20T10:00:00Z",
    reviewedAt: "2026-08-21T12:00:00Z"
  },
  {
    id: "story-002",
    authorUid: "alumni-004",
    authorName: "David Adebayo ('15)",
    title: "Bringing 100% Renewable Microgrids to 200,000 Off-Grid Families",
    category: "Story",
    excerpt: "Lumina Energy has completed its largest regional decentralised solar installation project in rural Kenya, powering schools and health clinics.",
    body: "Energy access transforms communities overnight. When children no longer have to study by kerosene fumes and medical refrigerators stay constantly chilled, maternal health outcomes surge. Our seed funding was originally sparked by the University Innovation Grant in 2016, proving that collegiate entrepreneurship ripples across the globe.",
    imageURL: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    status: "approved",
    createdAt: "2026-08-14T09:30:00Z",
    reviewedAt: "2026-08-15T11:00:00Z"
  },
  {
    id: "story-003",
    authorUid: "alumni-003",
    authorName: "Aria Chen ('19)",
    title: "Why Mentoring the Next Generation of Engineers is My Greatest Milestone",
    category: "News",
    excerpt: "Google DeepMind researcher Aria Chen shares reflections on establishing the Women in Robotics Endowment at the university.",
    body: "Technical milestones are exhilarating, but opening doors for curious minds is what endures. This month, we welcomed the third cohort of engineering scholars through our alumni-funded scholarship. If you are considering giving back your time as a student mentor this semester, please reach out to the university network office!",
    imageURL: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    status: "approved",
    createdAt: "2026-08-01T15:20:00Z",
    reviewedAt: "2026-08-02T16:00:00Z"
  },
  {
    id: "story-004",
    authorUid: "alumni-007",
    authorName: "Priya Sundaram ('21)",
    title: "Class of 2021 Bay Area Alumni Meetup Recap",
    category: "News",
    excerpt: "Over 65 alumni gathered at the Presidio in San Francisco for our annual West Coast autumn mixer.",
    body: "From autonomous vehicle engineers to fintech founders and policy analysts, the spirit of our graduating class remains stronger than ever. Special thanks to Apex Capital for sponsoring our networking venue.",
    imageURL: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    status: "pending", // demonstrates moderation queue
    createdAt: "2026-09-08T18:40:00Z",
    reviewedAt: null
  }
];

export const INITIAL_VIDEOS = [
  {
    id: "video-001",
    title: "Annual Alumni Gala: 45 Years of Academic Excellence",
    youtubeId: "vpW2sGlCtaE", // UPenn Commencement Address keynote
    description: "Highlights from our prestigious annual homecoming gala celebrating international alumni achievements and scholarships.",
    category: "Reunions",
    addedAt: "2026-06-12"
  },
  {
    id: "video-002",
    title: "Future of AI & Humanity: Keynote by Dr. Aria Chen",
    youtubeId: "aircAruvnKk", // 3Blue1Brown neural networks placeholder
    description: "Distinguished alumna Aria Chen addresses graduating seniors on ethical AI development and foundation architectures.",
    category: "Keynotes & Interviews",
    addedAt: "2026-05-20"
  },
  {
    id: "video-003",
    title: "Campus Transformed: Tour of the New Innovation Quad",
    youtubeId: "bTqVqk7FSmY", // Big Buck Bunny / campus nature placeholder
    description: "Explore the newly unveiled state-of-the-art climate engineering labs and collaborative maker studios.",
    category: "Campus Life",
    addedAt: "2026-04-10"
  },
  {
    id: "video-004",
    title: "Fireside Chat: Venture Capital & Cleantech with Marcus Vance",
    youtubeId: "L_LUpnjgPso",
    description: "Venture partner Marcus Vance ('08) discusses seed funding strategies for deeptech climate startups.",
    category: "Keynotes & Interviews",
    addedAt: "2026-03-15"
  }
];
