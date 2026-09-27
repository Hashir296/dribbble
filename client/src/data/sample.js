const shot = (id, photo) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&h=675&q=70`

const face = (photo) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=80&h=80&q=70`

const rawDesigns = [
  {
    id: '1',
    title: 'Digital tipping & payment mobile app',
    image: shot('1', 'photo-1512941937669-90a1b58e7e9c'),
    tags: ['mobile app', 'dashboard'],
    likes: 171,
    views: 11100,
    author: { name: 'Amina Shah', avatar: face('photo-1494790108377-be9c29b29330'), pro: true },
  },
  {
    id: '2',
    title: 'Pathline logo design',
    image: shot('2', 'photo-1626785774573-4b799315345d'),
    tags: ['branding', 'logo'],
    likes: 196,
    views: 9200,
    author: { name: 'Knack Studio', avatar: face('photo-1500648767791-00dcc994a43e'), pro: true },
  },
  {
    id: '3',
    title: 'Agents for a design canvas',
    image: shot('3', 'photo-1550745165-9bc0b252726f'),
    tags: ['animation', 'landing page'],
    likes: 88,
    views: 6400,
    author: { name: 'Framewell', avatar: face('photo-1438761681033-6461ffad8d80'), pro: false },
  },
  {
    id: '4',
    title: 'Logo for a burger pub',
    image: shot('4', 'photo-1550547660-d9450f859349'),
    tags: ['branding', 'illustration'],
    likes: 55,
    views: 5900,
    author: { name: 'Andre Kovac', avatar: face('photo-1507003211169-0a1dd7228f2d'), pro: true },
  },
  {
    id: '5',
    title: 'Cashly iOS app',
    image: shot('5', 'photo-1563986768609-322da13575f3'),
    tags: ['mobile app', 'onboarding'],
    likes: 89,
    views: 10600,
    author: { name: 'Tara Miguel', avatar: face('photo-1544005313-94ddf0286df2'), pro: true },
  },
  {
    id: '6',
    title: 'Cryonex biostorage mobile UI',
    image: shot('6', 'photo-1582719471384-894fbb16e074'),
    tags: ['mobile app', 'dashboard'],
    likes: 191,
    views: 12700,
    author: { name: 'Samuel Okon', avatar: face('photo-1506794778202-cad84cf45f1d'), pro: true },
  },
  {
    id: '7',
    title: 'Beauty product quiz',
    image: shot('7', 'photo-1596462502278-27bfdc403348'),
    tags: ['ecommerce', 'mobile app'],
    likes: 195,
    views: 18900,
    author: { name: 'Rona Studio', avatar: face('photo-1534528741775-53994a69daeb'), pro: true },
  },
  {
    id: '8',
    title: 'Zoromi AI SaaS landing page',
    image: shot('8', 'photo-1460925895917-afdab827c52f'),
    tags: ['landing page', 'dashboard'],
    likes: 194,
    views: 14900,
    author: { name: 'Korsa', avatar: face('photo-1472099645785-5658abf4ff4e'), pro: true },
  },
  {
    id: '9',
    title: 'Jewelry brand identity & packaging',
    image: shot('9', 'photo-1515562141207-7a88fb7ce338'),
    tags: ['branding', 'portfolio'],
    likes: 142,
    views: 8300,
    author: { name: 'Hana Ito', avatar: face('photo-1524504388940-b1c1722653e1'), pro: false },
  },
  {
    id: '10',
    title: 'Onboarding for a finance app',
    image: shot('10', 'photo-1551288049-bebda4e38f71'),
    tags: ['onboarding', 'mobile app'],
    likes: 120,
    views: 7400,
    author: { name: 'Leo Park', avatar: face('photo-1463453091185-61582044d556'), pro: true },
  },
  {
    id: '11',
    title: 'Editorial illustration series',
    image: shot('11', 'photo-1579783902614-a3fb3927b6a5'),
    tags: ['illustration', 'animation'],
    likes: 76,
    views: 4100,
    author: { name: 'Mara Klein', avatar: face('photo-1487412720507-e7ab37603c6f'), pro: false },
  },
  {
    id: '12',
    title: 'Portfolio site for a product studio',
    image: shot('12', 'photo-1498050108023-c5249f4df085'),
    tags: ['portfolio', 'landing page'],
    likes: 163,
    views: 9800,
    author: { name: 'Northroom', avatar: face('photo-1519345182560-3f2917c472ef'), pro: true },
  },
  {
    id: '13',
    title: 'Editorial type poster',
    image: shot('13', 'photo-1561070791-2526d30994b5'),
    tags: ['typography', 'illustration'],
    likes: 84,
    views: 4200,
    author: { name: 'Hana Ito', avatar: face('photo-1524504388940-b1c1722653e1'), pro: false },
  },
  {
    id: '14',
    title: 'Grocery label and print system',
    image: shot('14', 'photo-1586281380349-632531db7ed4'),
    tags: ['print', 'branding'],
    likes: 67,
    views: 3100,
    author: { name: 'Andre Kovac', avatar: face('photo-1507003211169-0a1dd7228f2d'), pro: true },
  },
  {
    id: '15',
    title: 'Magazine cover lettering',
    image: shot('15', 'photo-1516383740770-fbcc5ccbece0'),
    tags: ['typography', 'print'],
    likes: 112,
    views: 6800,
    author: { name: 'Mara Klein', avatar: face('photo-1487412720507-e7ab37603c6f'), pro: false },
  },
  {
    id: '16',
    title: 'Coffee bag packaging',
    image: shot('16', 'photo-1495474472287-4d71bcdd2085'),
    tags: ['print', 'branding'],
    likes: 143,
    views: 7700,
    author: { name: 'Knack Studio', avatar: face('photo-1500648767791-00dcc994a43e'), pro: true },
  },
]

export function slug(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const places = {
  'Amina Shah': 'Dubai, UAE',
  'Knack Studio': 'Seoul, KR',
  Framewell: 'Berlin, DE',
  'Andre Kovac': 'Kyiv, UA',
  'Tara Miguel': 'Lisbon, PT',
  'Samuel Okon': 'Lagos, NG',
  'Rona Studio': 'Warsaw, PL',
  Korsa: 'Austin, US',
  'Hana Ito': 'Tokyo, JP',
  'Leo Park': 'Toronto, CA',
  'Mara Klein': 'Amsterdam, NL',
  Northroom: 'London, UK',
}

const categoryFor = {
  'mobile app': 'Mobile',
  branding: 'Branding',
  illustration: 'Illustration',
  animation: 'Animation',
  'landing page': 'Web Design',
  dashboard: 'Product Design',
  portfolio: 'Web Design',
  ecommerce: 'Product Design',
  onboarding: 'Product Design',
  logo: 'Branding',
  typography: 'Typography',
  print: 'Print',
}

export const exploreCategories = ['Product Design', 'Web Design', 'Animation', 'Branding', 'Illustration', 'Mobile', 'Typography', 'Print']

export const designs = rawDesigns.map((item, index) => ({
  ...item,
  category: categoryFor[item.tags[0]] || 'Product Design',
  createdAt: Date.now() - index * 86400000,
  description: `${item.title}. A product design study covering layout, type, color, and the small interactions that make the screen feel finished.`,
  author: {
    ...item.author,
    username: slug(item.author.name),
    agency: ['Knack Studio', 'Framewell', 'Rona Studio', 'Northroom'].includes(item.author.name),
    location: places[item.author.name] || 'Remote',
    bio: `I design digital products and share the work in progress. Available for selected projects.`,
    followers: 640 + item.likes,
  },
}))

export const tags = [
  'dashboard',
  'landing page',
  'mobile app',
  'portfolio',
  'ecommerce',
  'animation',
  'illustration',
  'onboarding',
]

export const services = [
  { id: 's1', title: 'Product design sprint', price: 'From $2,400', owner: 'Amina Shah', image: designs[0].image },
  { id: 's2', title: 'Brand identity system', price: 'From $3,200', owner: 'Andre Kovac', image: designs[3].image },
  { id: 's3', title: 'Landing page design', price: 'From $1,800', owner: 'Korsa', image: designs[7].image },
  { id: 's4', title: 'Mobile app UI', price: 'From $4,000', owner: 'Rona Studio', image: designs[6].image },
  { id: 's5', title: 'Illustration pack', price: 'From $900', owner: 'Mara Klein', image: designs[10].image },
  { id: 's6', title: 'Portfolio website', price: 'From $1,500', owner: 'Northroom', image: designs[11].image },
]

export const categories = [
  'Illustration',
  'Print',
  'Typography',
  'Product Design',
  'Web Design',
  'Branding',
  'Mobile',
  'Animation',
]

export const jobs = [
  { id: 'j1', title: 'Product designer', company: 'Northroom', place: 'London, UK', type: 'Full-time' },
  { id: 'j2', title: 'Brand designer', company: 'Knack Studio', place: 'Seoul, KR', type: 'Contract' },
  { id: 'j3', title: 'Mobile UI designer', company: 'Rona Studio', place: 'Remote', type: 'Full-time' },
  { id: 'j4', title: 'Motion designer', company: 'Framewell', place: 'Berlin, DE', type: 'Freelance' },
]

export const openBriefs = [
  { id: 'b1', name: 'Lumen Goods', title: 'Logo for a coffee brand', budget: '$1,500 – $2,500', description: 'A wordmark and a small icon for a specialty coffee roaster.', category: 'Logo Design', scope: 'Design only' },
  { id: 'b2', name: 'Northroom', title: 'Brand system for a product studio', budget: '$4,000 – $7,000', description: 'Color, type, and a short brand guide for a new studio site.', category: 'Branding', scope: 'Design only' },
  { id: 'b3', name: 'Kite Health', title: 'Landing page for a wellness app', budget: '$2,000 – $3,500', description: 'One marketing page with a clear signup path.', category: 'Landing Page', scope: 'Design only' },
  { id: 'b4', name: 'Framewell', title: 'Marketing site for a design tool', budget: '$6,000 – $10,000', description: 'A multi-page site that needs design and a build.', category: 'Website Design', scope: 'Dev required' },
  { id: 'b5', name: 'Cashly', title: 'Mobile app screens for payments', budget: '$5,000 – $8,000', description: 'Key flows for sending money, plus a handoff for development.', category: 'Mobile App', scope: 'Dev required' },
  { id: 'b6', name: 'Rona Studio', title: 'UI for a client portal', budget: '$3,000 – $5,000', description: 'Dashboard, project list, and message screens.', category: 'UI UX Design', scope: 'Design only' },
  { id: 'b7', name: 'Mara Klein', title: 'Editorial illustration set', budget: '$800 – $1,400', description: 'Six illustrations for a magazine feature.', category: 'Illustration', scope: 'Design only' },
]

export const posts = [
  { slug: 'how-to-present-a-shot', title: 'How to present a shot', excerpt: 'Crop, title, and the first line of your description do most of the work.' },
  { slug: 'hiring-without-the-noise', title: 'Hiring without the noise', excerpt: 'A short brief gets better proposals than a long wishlist.' },
  { slug: 'building-a-profile', title: 'Building a profile people trust', excerpt: 'Three strong shots beat twenty unfinished ones.' },
  { slug: 'weekly-playoff', title: 'What makes a good playoff entry', excerpt: 'Pick one idea and finish it. Judges notice restraint.' },
]

export const faqs = [
  { q: 'How do I upload a shot?', a: 'Create an account, then use Upload in the header. Add an image, title, description, and tags.' },
  { q: 'How do likes and saves work?', a: 'Open a shot and use Like or Save. You need to be signed in. Saved shots live on your profile and dashboard.' },
  { q: 'How do I hire someone?', a: 'Browse designers or services, send a message with Get in touch, or post a project brief.' },
  { q: 'How do I get hired?', a: 'Fill in your profile, upload shots, add a service, and reply to briefs.' },
]

export function compact(n) {
  if (n >= 1000) {
    const v = n / 1000
    return v.toFixed(1).replace('.0', '') + 'k'
  }
  return String(n)
}
