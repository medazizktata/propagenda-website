import type { ServiceSlug } from '@/types/content';

export interface ProcessStep {
  title: string;
  body: string;
}

export interface ServiceDetailConfig {
  /** Full-bleed hero image (real portfolio render). Omit → monogram/pattern hero. */
  heroImage?: string;
  /** Service-specific CTA headline for the closing orange band. */
  ctaHeading: string;
  /** Authored process steps (websites, mobile) — the signature module when the record has none. */
  process?: ProcessStep[];
  /** Interactive "how we work" stepper — an extra section (currently branding). */
  approach?: ProcessStep[];
  /** FAQ accordion — an extra section (currently branding). */
  faqs?: { q: string; a: string }[];
  /** Authored "who we connect you with" list (PR). */
  influence?: string[];
  /** Authored two-discipline split (photography). */
  disciplines?: { label: string; items: string[] }[];
}

/**
 * Per-service presentation for the detail pages. Content (copy, scope, tiers, etc.) lives in
 * `content/services`; this is only art-direction + the authored signature data for services
 * whose record carries no built-in module. Hero images are TEMPORARY portfolio maps until
 * real /images/services assets land.
 */
export const serviceDetailConfig: Record<ServiceSlug, ServiceDetailConfig> = {
  'branding-visual-identity': {
    heroImage: '/images/portfolio/work-sanapex.png',
    ctaHeading: 'Ready to build your identity?',
    approach: [
      { title: 'Discovery', body: 'We dig into your business, audience, and market — the brief behind the brief — so the brand is built on insight, not guesswork.' },
      { title: 'Strategy', body: 'Positioning, personality, and the story your brand needs to tell. This is the thinking every visual decision is anchored to.' },
      { title: 'Identity', body: 'Logo, colour, type, and pattern come together into a distinctive visual system — designed to work everywhere your brand shows up.' },
      { title: 'Guidelines', body: 'Every rule documented — usage, spacing, do’s and don’ts — so the brand stays consistent no matter who’s using it.' },
      { title: 'Rollout', body: 'Stationery, collateral, and templates produced and applied — your new identity, launched and ready to run.' },
    ],
    faqs: [
      {
        q: 'How long does a branding project take?',
        a: 'Most identities take three to six weeks, depending on scope. A full developed system — with strategy, guidelines, and collateral — runs a little longer. You’ll get a clear timeline before we start.',
      },
      {
        q: 'What’s the difference between Basic and Developed branding?',
        a: 'Basic covers the visual essentials: logo, colours, type, pattern, and stationery. Developed adds the full system — brand strategy, voice and messaging, a complete guidelines book, and marketing collateral.',
      },
      {
        q: 'Do we own our logo and brand files?',
        a: 'Yes. Once the project is complete, full ownership of your final logo and brand assets is yours — delivered in every format you’ll need.',
      },
      {
        q: 'Can you refresh our existing brand instead of starting over?',
        a: 'Absolutely. If your brand has equity worth keeping, we’ll evolve it — sharpening the identity while retaining what your audience already recognises.',
      },
      {
        q: 'What do you need from us to get started?',
        a: 'A short brief and a conversation. We dig into your business, audience, and goals during Discovery — you don’t need anything prepared beyond a sense of where you want to go.',
      },
      {
        q: 'What files will we receive?',
        a: 'Print and digital formats for every asset — vector logos (SVG, EPS, PDF), raster versions (PNG, JPG), your colour and type specifications, and a guidelines document.',
      },
    ],
  },
  'public-relations': {
    ctaHeading: 'Ready to get noticed?',
    influence: [
      'A-list celebrities',
      'Bloggers & creators',
      'Gamers & streamers',
      'Actors & artists',
      'Press & media',
    ],
    faqs: [
      {
        q: 'How do you choose the right influencers for our brand?',
        a: 'We match on audience, not just follower count — who their community actually is, how engaged it is, and whether their values fit yours. Relevance and authenticity beat raw reach every time, so every partner is vetted before we recommend them.',
      },
      {
        q: 'How do you measure reach and ROI?',
        a: 'We track the metrics tied to your goals — reach and impressions, engagement rate, click-throughs, referral traffic, and earned-media value — and report against clear benchmarks set before the campaign goes live.',
      },
      {
        q: 'Can you help if we are facing a reputation or crisis situation?',
        a: 'Yes. We handle reputation management and crisis communications — from a rapid holding statement to a full response plan — protecting your credibility while keeping messaging consistent across every channel.',
      },
      {
        q: 'Do partnerships include category exclusivity?',
        a: 'They can. Where it matters, we negotiate exclusivity so your chosen faces are not promoting a competitor during — or shortly after — your campaign. The terms are agreed up front and written into every collaboration.',
      },
      {
        q: 'How long before we start to see results?',
        a: 'Influencer and social activations can drive visibility within days of going live. Earned press coverage and lasting credibility build over weeks — most campaigns run across one to three months for meaningful, measurable impact.',
      },
      {
        q: 'Is sponsored content clearly disclosed?',
        a: 'Always. Every paid partnership follows advertising-disclosure standards and platform rules — clear labelling protects both your brand and the creator, and audiences trust transparent partnerships more.',
      },
    ],
  },
  'online-offline-marketing': {
    heroImage: '/images/portfolio/work-ghaftree.png',
    ctaHeading: 'Ready to grow?',
    faqs: [
      {
        q: 'How do you decide the mix between online and offline?',
        a: 'It follows your audience and goals, not a fixed formula. We map where your customers actually spend attention across the funnel, then weight the budget toward the channels — digital, physical, or both — that move them from awareness to loyalty most efficiently.',
      },
      {
        q: 'What budget do we need, and can we start small and scale?',
        a: 'Yes. We can start lean on a few high-intent channels, prove what works, then reinvest the winners and scale spend as returns come in. You set the monthly budget and we allocate it across the funnel — no long lock-ins to get going.',
      },
      {
        q: 'Which channels are right for my business?',
        a: 'That depends on what you sell and who buys it. A local service leans on search, social, and offline reach; an online store leans on paid social, influencers, and retargeting. After a short discovery, we recommend a specific channel plan rather than a generic package.',
      },
      {
        q: 'How do you report on performance and attribution?',
        a: 'You get a clear dashboard tied to the metrics that matter — reach, engagement, leads, cost per acquisition, and return on ad spend — reviewed on a regular cadence. For offline activity we use trackable codes, landing pages, and lift analysis so every channel earns its place.',
      },
      {
        q: 'How long before we see results?',
        a: 'Paid channels can drive traffic and leads within the first weeks, while content, SEO, and brand-building compound over months. We set realistic milestones up front so early wins and longer-term growth are both accounted for.',
      },
      {
        q: 'Do we own the content and ad accounts you create?',
        a: 'Yes. Ad accounts, campaign data, and the content we produce are yours — set up under your ownership from the start, so nothing is held hostage if we ever part ways.',
      },
    ],
  },
  websites: {
    heroImage: '/images/portfolio/work-quickcars.png',
    ctaHeading: 'Ready to launch?',
    process: [
      { title: 'Concept', body: 'Goals, audience, and structure mapped before a pixel moves.' },
      { title: 'Design', body: 'Interfaces that carry your brand and guide the visitor.' },
      { title: 'Build', body: 'Fast, responsive, accessible front-ends built to last.' },
      { title: 'Launch', body: 'Tested, optimised, and shipped with confidence.' },
      { title: 'Manage', body: 'Ongoing care, updates, and performance tuning.' },
    ],
    faqs: [
      {
        q: 'How long does it take to build a website?',
        a: 'A focused landing page can be live in one to two weeks; a full multi-page site usually runs four to eight weeks depending on the number of pages, features, and content readiness. We map a clear timeline with milestones during the concept phase, so you always know what ships when.',
      },
      {
        q: 'Can we edit the site ourselves after launch?',
        a: 'Yes. We build on a content management system so your team can update text, images, and pages without touching code. We hand over a short walkthrough and simple documentation, and we are on call whenever you want us to handle changes for you.',
      },
      {
        q: 'Do you handle hosting and domains?',
        a: 'We do. We can set up fast, secure hosting, connect your domain, and configure SSL and email — or work with your existing providers if you prefer. Either way you keep full ownership of the domain and accounts.',
      },
      {
        q: 'Will the site work well on mobile?',
        a: 'Always. Every site is designed responsive-first, so the layout, navigation, and imagery adapt cleanly from large desktops down to phones. We test across real devices and breakpoints before launch to make sure it looks and works right everywhere.',
      },
      {
        q: 'Is the site optimised for search and speed?',
        a: 'Yes. We build on clean, efficient code with proper metadata, semantic structure, and image optimisation, and we tune against Core Web Vitals so pages load fast and rank well. Strong performance and on-page SEO are part of the build, not an afterthought.',
      },
      {
        q: 'What does ongoing management include?',
        a: 'Hosting and security, software and plugin updates, backups, uptime monitoring, small content changes, and regular performance checks. We offer flexible care plans so your site stays fast, safe, and current long after launch.',
      },
    ],
  },
  'mobile-applications': {
    heroImage: '/images/portfolio/work-food.png',
    ctaHeading: 'Ready to ship your app?',
    process: [
      { title: 'Discover', body: 'Scope, platforms, core flows.' },
      { title: 'Design', body: 'Native UX/UI for iOS and Android.' },
      { title: 'Build', body: 'Apps wired to solid back-ends.' },
      { title: 'Ship', body: 'App Store and Play launch.' },
      { title: 'Support', body: 'Updates and iteration.' },
    ],
    faqs: [
      {
        q: 'Should we build native or cross-platform?',
        a: 'It depends on the app. Cross-platform (React Native or Flutter) ships one codebase to both stores faster and costs less to maintain, which suits most products. Where an app leans hard on device hardware, heavy graphics, or platform-specific features, we build fully native in Swift or Kotlin. We recommend the right approach after understanding your goals — you are never pushed into one by default.',
      },
      {
        q: 'Do you build for both iOS and Android?',
        a: 'Yes. We design and ship for both platforms, and the app respects each one — iOS conventions on iPhone, Material patterns on Android — so it feels native rather than ported. With a cross-platform build, both versions come from a single codebase and stay in sync as we release updates.',
      },
      {
        q: 'How long does it take to build an app?',
        a: 'A focused MVP with a core set of screens typically takes eight to twelve weeks; a larger app with accounts, payments, and back-end integrations runs longer. We map a clear timeline with milestones during Discovery, so you know what ships at each stage and can plan a launch around it.',
      },
      {
        q: 'Do you handle App Store and Play Store submission?',
        a: 'We do — it is part of the Ship phase. We prepare the store listings, screenshots, and metadata, set up your developer accounts, and manage the review and release process end to end. You keep full ownership of the accounts and the published app.',
      },
      {
        q: 'Can you build the back-end and APIs too?',
        a: 'Yes. Most apps need a server, database, and APIs behind them, and we build and integrate those as part of the project — secure authentication, live data, payments, notifications, and third-party services. If you already have a back-end, we integrate cleanly with your existing APIs.',
      },
      {
        q: 'What happens after the app launches?',
        a: 'Apps are never truly finished. We offer maintenance plans that keep your app compatible with new iOS and Android versions, fix issues, monitor performance and crashes, and roll out new features as you grow. You get steady iteration, not a hand-off and silence.',
      },
    ],
  },
  events: {
    heroImage: '/images/portfolio/work-events.png',
    ctaHeading: 'Planning an event?',
    faqs: [
      {
        q: 'What types of events do you handle?',
        a: 'Corporate launches, conferences, exhibitions, brand activations, and private celebrations — among others. Whatever the format or scale, we bring the same end-to-end approach: branding, production, coverage, and the logistics that hold it all together.',
      },
      {
        q: 'How far in advance should we book you?',
        a: 'The earlier the better — around six to eight weeks gives us room to shape the concept, build the identity, and produce everything properly. We do take on tighter timelines when we can, so it is always worth asking.',
      },
      {
        q: 'Do you cover the event on the day itself?',
        a: 'Yes. Our team is on-site to run the floor and coordinate timings, while photographers and videographers capture the day and our social team posts moments live as they happen.',
      },
      {
        q: 'Can you run virtual or hybrid events?',
        a: 'We do. Alongside in-person events, we handle live streaming, virtual staging, and hybrid formats — so an audience in the room and an audience at home get the same considered experience.',
      },
      {
        q: 'Can you work to our budget?',
        a: 'We scale the plan to fit. We are upfront about where money makes the biggest difference and where it does not, and we shape the scope around your priorities rather than a fixed package.',
      },
      {
        q: 'What exactly is included?',
        a: 'Event branding and identity, marketing materials, full organisation and logistics, photography and videography, social media coverage, and a post-event evaluation. In short, everything from the first brief to the final delivered frame.',
      },
    ],
  },
  'photography-videography': {
    heroImage: '/images/portfolio/work-food.png',
    ctaHeading: 'Ready to shoot?',
    disciplines: [
      {
        label: 'Photography',
        items: ['Products', 'Lifestyle & editorial', 'Events', 'Food', 'Real estate', 'Portraits', 'Drone'],
      },
      {
        label: 'Videography',
        items: [
          'Explainer videos',
          'Product films',
          'Testimonials',
          'Brand videos',
          'Motion graphics',
          'Live streaming',
        ],
      },
    ],
    faqs: [
      {
        q: 'What do you shoot?',
        a: 'Both stills and motion. On the photo side that’s products, lifestyle and editorial, food, events, real estate, portraits, and drone; on video it’s brand films, product and explainer videos, testimonials, motion graphics, and live streaming. If it needs to be captured well we cover it — often photo and video from the same shoot.',
      },
      {
        q: 'Do you charge by the half-day or full-day?',
        a: 'Both. A half-day covers around four hours on location or in studio — ideal for a focused product set or a short interview — while a full day runs about eight hours for larger shoots with multiple setups, looks, or locations. We recommend the right length once we’ve seen the shot list, and we’re clear about what each one covers.',
      },
      {
        q: 'How long does editing take, and what’s the turnaround?',
        a: 'Most photo galleries and video edits are delivered within about two weeks of the shoot, with a first set of previews sooner. Every image is professionally retouched and every video colour-graded and cut to your brief; if you’re working to a launch date, tell us early and we’ll build the schedule around it — rush turnaround is available when you need it.',
      },
      {
        q: 'Who owns the photos and videos, and what usage rights do we get?',
        a: 'You do. Final delivered images and videos come with full commercial usage rights for your brand — website, social, ads, and print — with no recurring licence fees. Where a shoot involves talent, music, or a rented location, any third-party usage terms are agreed and shared up front so there are no surprises later.',
      },
      {
        q: 'Do you do video and reels as well as photography?',
        a: 'Yes — video is half of what we do. Alongside full brand films we shoot short-form vertical content and reels made for Instagram, TikTok, and social feeds, and we can capture them on the same day as your photos so everything shares one consistent look.',
      },
      {
        q: 'Do you shoot on location or in a studio?',
        a: 'Whichever suits the work. We shoot on location — your venue, site, or space — and in a controlled studio setup for products, portraits, and clean-background work. For bigger projects we scout and secure the right location as part of pre-production, and photo and video can run on separate days or be combined into one.',
      },
    ],
  },
};
