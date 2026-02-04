import IProject from '../../@types/IProject';

const PROJECTS: IProject[] = [
  /** Recent Cybrary work (most impactful) */
  {
    title: 'Enterprise Hub Platform',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Next.js dashboard for team owners to manage users, assign learning, and view reports across multiple Cybrary products. Supports multi-tenant team/group hierarchies, role-based permissions, and persistent team selection. Tech: Next.js 15, TypeScript, Material-UI, TanStack Query.',
    viewLink: 'https://app.cybrary.it/',
    tags: ['Next.js', 'TypeScript', 'Material-UI', 'Multi-Tenancy', 'RBAC', 'Enterprise'],
  },
  {
    title: 'Type-Safe API Client Generator',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Automated TypeScript client generation from OpenAPI specs. Syncs backend microservice schemas to frontend types for end-to-end type safety. Includes JWT auth injection and team-scoped request patterns. Tech: OpenAPI, TypeScript, code generation tooling.',
    tags: ['OpenAPI', 'TypeScript', 'Code Generation', 'Type Safety', 'Microservices'],
  },
  {
    title: 'Dynamic Form System',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Form builder with 22+ field types: date/time pickers, file uploads with validation, ratings, multi-select chips. Uses JSON configs with Zod schemas for type-safe validation. Responsive, accessible (WCAG AA), 100% test coverage (65 tests). Tech: React Hook Form, Zod, TypeScript, MUI.',
    tags: ['React Hook Form', 'Zod', 'TypeScript', 'Material-UI', 'Accessibility', 'Testing'],
  },
  {
    title: 'Multi-Tenancy',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'System for managing hierarchical organization and group selection in multi-tenant SaaS. Handles automatic team selection, localStorage persistence with validation, and team-scoped data fetching. Tech: React Context, TypeScript, TanStack Query.',
    tags: ['React', 'Context API', 'Multi-Tenancy', 'TypeScript', 'SaaS Architecture'],
  },
  /** Earlier Cybrary work */
  {
    title: 'User Checkout',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Led migration of checkout and registration flows from Chargebee to Paddle payment platform. Implemented dual-flow support for authenticated and guest users, payment processing with subscription management, retention flows, and upgrade paths. Included building migration plans, test plans, and data-science event tracking for conversion analytics. Tech: React, Paddle SDK, TypeScript.',
    viewLink: 'https://app.cybrary.it/',
    tags: ['Paddle', 'Chargebee', 'React', 'SaaS'],
  },
  {
    title: 'Immersive LX',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Learning platform serving video lessons, text lessons, quizzes/assessments, and hands-on virtual labs for cybersecurity training. Supports free, paid, and enterprise users with configurable access levels and permissions. Includes progress tracking, bookmarking, completion certificates, and content recommendations. Tech: React, video player APIs, virtual lab integration.',
    viewLink: 'https://app.cybrary.it/',
    tags: ['React', 'SaaS', 'Cybersecurity', 'Virtual Labs'],
  },
  {
    title: 'Enterprise Dashboards',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Rebuilt enterprise dashboards that allowed users to manage their team, access their learning materials, and manage their account settings. Features highly configurable RBAC and license management.',
    viewLink: 'https://app.cybrary.it/',
    tags: ['React', 'SaaS', 'Cybersecurity', 'Reporting'],
  },
  {
    title: 'User Profiles',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Built a user profile system that allowed users to manage their account settings and information such as name and profile image, toggle profile visibility, and share their progress and achievements with others.',
    viewLink: 'https://app.cybrary.it/',
    tags: ['React', 'SaaS', 'Cybersecurity', 'User Profiles'],
  },
  {
    title: 'Forums',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Built a public and private forums system that allowed users to ask questions, share knowledge, and collaborate with others. The forums were built to serve free, paid, and teams users with different access levels and permissions. Authentication was shared with the main platform for better UX.',
    viewLink: 'https://forums.cybrary.it/',
    tags: ['React', 'SaaS', 'Cybersecurity', 'Forums'],
  },
  {
    title: 'Guided Onboarding',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Built an in-app onboarding system that guided users through the platform, helped them set up their account, and showed them how to access their learning materials. The onboarding system was built to serve free and teams users, navigating them to relevant parts of the platform.',
    viewLink: 'https://app.cybrary.it',
    tags: ['React', 'SaaS', 'Cybersecurity', 'Onboarding'],
  },
  {
    title: 'Sales Demos',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Built an in-app sales demo system that empowered sales teams to show off the teams platform to potential customers. The sales demo system was built to showcase different access levels and permissions of a team, as well as reporting features and user management tools.',
    viewLink: 'https://app.cybrary.it/',
    tags: ['React', 'SaaS', 'Cybersecurity', 'Sales Demos'],
  },
  {
    title: 'Demo Mocks (MSW)',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Browser-only demo mocks using Mock Service Worker (MSW). Intercepts API calls and serves deterministic demo data while keeping type-safe API clients and TanStack Query hooks intact. Covers auth, roles, permissions, courses, and team management endpoints.',
    viewLink: 'https://app.cybrary.it/',
    tags: ['MSW', 'TypeScript', 'React', 'TanStack Query'],
  },
  {
    title: 'Marketing Website (Headless CMS)',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Next.js marketing website powered by Contentful CMS with block-based architecture. 35+ reusable marketing blocks, dynamic content pages (courses, programs, instructors, blogs), automated type-safe Contentful integration. 90+ Lighthouse scores with ISR on Vercel. Tech: Next.js, Contentful, TypeScript, ISR.',
    viewLink: 'https://www.cybrary.it/',
    tags: ['Next.js', 'Contentful', 'TypeScript', 'Headless CMS', 'ISR', 'SEO'],
  },
  {
    title: 'Contentful Automation Scripts',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Suite of automation scripts syncing React components with Contentful CMS. Auto-generates TypeScript types from Contentful schemas, creates/updates block type entries with screenshots and documentation, maintains bidirectional sync between codebase and CMS. Eliminated 95% of manual Contentful configuration. Tech: Contentful API, TypeScript, automation.',
    tags: ['Contentful', 'TypeScript', 'Code Generation', 'Automation', 'DevOps'],
  },
  {
    title: 'Webflow Migration (1000+ Pages)',
    subtitle: 'Cybrary - Cybersecurity Training Platform',
    description:
      'Migration from Webflow to Next.js + Contentful. Built ETL scripts to convert Webflow HTML/CSV exports into Contentful rich text format. Handled asset migration (1000+ images), author linking, category mapping, and URL preservation. Automated blog import with deduplication and HTML-to-RichText conversion. Tech: ETL, Contentful, data transformation.',
    tags: ['Migration', 'ETL', 'Contentful', 'Data Transformation', 'Automation'],
  },
  /** SGPFL – ordered by resume relevance (e-commerce lead, report/diagnostic, then CMS, a11y, label) */
  {
    title: 'E-commerce Website',
    subtitle: 'Stove & Grill Parts For Less',
    description:
      "Built a custom e-commerce point-of-sale website on top of Shopify's CMS/Checkout. The system included a user funnel to reduce incorrect orders, product pages optimized for conversion, and resources to make informed purchasing decisions. The website was built to be fast, SEO performant, and easy to use for non-technical users.",
    viewLink: 'https://pellet-stove-parts-4less.com/',
    tags: ['Shopify', 'E-commerce', 'SSR', 'Liquid'],
  },
  {
    title: 'Reporting Server',
    subtitle: 'Stove & Grill Parts For Less',
    description:
      'Built a custom reporting server to pull data from Shopify, Finale Inventory, and several other third-party services. The system included multiple forms of export, including CSV/PDF via email, direct download, and writing directly to Google sheets. Handled user authentication, filtering, sorting, custom formulas, and more. Hosted on GCP using cloud run and cloud scheduler.',
    tags: ['Shopify', 'Finale Inventory', 'E-commerce', 'Reporting', 'GCP', 'API', 'Google Sheets'],
  },
  {
    title: 'Diagnostics Server',
    subtitle: 'Stove & Grill Parts For Less',
    description:
      'Built a custom diagnostics server to monitor the health of our e-commerce catalog. The system included monitoring of product prices, inventory levels, and order statuses. The system was built to be fast, reliable, and issues were surfaced in a way that was easy fix for end users. Hosted on GCP using cloud run and cloud scheduler.',
    tags: ['Shopify', 'Finale Inventory', 'E-commerce', 'Diagnostics', 'GCP', 'API'],
  },
  {
    title: 'CMS',
    subtitle: 'Stove & Grill Parts For Less',
    description:
      'Built a content management system to extend our existing product catalog(s) from Shopify and Finale Inventory in custom ways. The system included a product editor, product list, and product detail pages. It performed basic CRUD operations on data from multiple sources and was built to be fast, reliable, and easy to use for non-technical users.',
    tags: ['Shopify', 'Finale Inventory', 'E-commerce', 'CMS'],
  },
  {
    title: 'Accessibility Compliance',
    subtitle: 'Stove & Grill Parts For Less',
    description:
      'Lead the effort to make our e-commerce platform WCAG 2.2 AA compliant. This included a full audit of the website, a plan to fix issues, and a plan to maintain compliance moving forward. All websites should be accessible to all users, including those with disabilities. Used WAVE and Lighthouse to audit the website.',
    viewLink: 'https://pellet-stove-parts-4less.com/',
    tags: ['Shopify', 'E-commerce', 'WCAG 2.2 AA', 'Accessibility'],
  },
  {
    title: 'Label Generation Server',
    subtitle: 'Stove & Grill Parts For Less',
    description:
      'Created an internal custom label generation server to print shelf labels for our warehouse. The system included a web interface to select products, print labels, and manage label templates. The system built labels to a PDF and sent print jobs to a print node client running on the respective printers machine. Hosted on GCP using cloud run.',
    tags: ['Shopify', 'Finale Inventory', 'E-commerce', 'Label Generation', 'GCP', 'API'],
  },
  /** Portfolio */
  {
    title: 'My Portfolio',
    subtitle: 'Personal Portfolio',
    description:
      'This website! Built with Next.js, TailwindCSS, and TypeScript. Exported as a static site and hosted on Github Pages. The site is built to be fast, mobile-first, open-source, and easily maintainable meaning a heavy focus on documentation and minimal dependencies.',
    codeLink: 'https://github.com/Cellis9421/portfolio',
    viewLink: 'https://calvinellis.io',
    tags: ['Next.js', 'TailwindCSS', 'TypeScript', 'Static Site', 'Open Source'],
  },
  /** Side projects – AI-related first (resume relevance), then other */
  {
    title: 'Discord AI Bot',
    subtitle: 'Personal Project',
    description:
      'Created a discord bot to do various things with AI. The bot could generate text, images, and more. It was a good project to learn about AI text generation and how to integrate it into a discord bot. The bot was used in a few small servers and was a fun project to work on.',
    codeLink: 'https://github.com/Cellis9421/discord-ai-bot',
    tags: ['Discord', 'AI', 'Bot', 'Python', 'OpenAI'],
  },
  {
    title: 'pAInt it',
    subtitle: 'Personal Project',
    description:
      'Created a web app to generate art using AI. The app could generate art from text. It was a fun project to learn about AI image generation and how to integrate it into a web app. The app was used by a few friends and was a fun project to work on.',
    codeLink: 'https://github.com/Cellis9421/paint-it',
    tags: ['AI', 'OpenAI', 'React', 'Next.js', 'DALL-E'],
  },
  {
    title: 'Process Manager',
    subtitle: 'Personal Project',
    description:
      'Created a process manager to manage long-running processes on a system. The python script starts processes and monitors them for crashes, restarting them as needed. The system was built to be fast, reliable, and easy to use for non-technical users.',
    codeLink: 'https://github.com/Cellis9421/HydraMBLauncher/tree/master',
    tags: ['Python', 'Process Manager', 'System Administration', 'CLI'],
  },
  {
    title: 'Website Builder',
    subtitle: 'Personal Project',
    description:
      "Created a php website builder to generate static websites from a simple JSON configuration. As one of my first projects in PHP, it was a great learning experience and allowed me to build a website for a friend in a fraction of the time it would have taken to build by hand. (That was it's only user)",
    codeLink: 'https://github.com/Cellis9421/HydraMBLauncher/tree/master',
    tags: ['PHP', 'Website Builder', 'Static Site'],
  },
];

export default PROJECTS;
