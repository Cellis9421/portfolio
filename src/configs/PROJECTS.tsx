import Screenshot from "@/components/Screenshot/Screenshot";
import IProject from "../../@types/IProject";

const PROJECTS: IProject[] = [
  /** Cybrary */
  {
    title: "Checkout",
    subtitle: "Cybrary - Cybersecurity Training Platform",
    description:
      "Lead migration of checkout and registration flows from Chargebee to Paddle. Handled user authentication, payment processing, retention flows, and more. Included building migrations plans, test plans, and data-science events for reporting.",
    viewLink: "https://app.cybrary.it/upgrade/checkout",
    iconElement: (
      <Screenshot src="cybrary_checkout.png" alt="Cybrary Checkout" />
    ),
    tags: ["Paddle", "Chargebee", "React", "SaaS", "E-commerce"],
  },
  {
    title: "Immersive LX",
    subtitle: "Cybrary - Cybersecurity Training Platform",
    description:
      "Extended a learning platform that served video lessons, text lessons, assessments, and virtual labs for a Cybersecurity Training Platform. The platform was built to serve free, paid, and teams users with different access levels and permissions.",
    viewLink: "https://app.cybrary.it/upgrade/checkout",
    iconElement: (
      <Screenshot src="cybrary_immersive.png" alt="Cybrary Immersive" />
    ),
  },
  {
    title: "Enterprise Dashboards",
    subtitle: "Cybrary - Cybersecurity Training Platform",
    description:
      "Lead rebuild of the dashboard that allowed users to view their progress, access their learning materials, and manage their account settings. The dashboard was built to serve free, paid, and teams users with different access levels and permissions.",
    viewLink: "https://app.cybrary.it/",
    iconElement: (
      <Screenshot src="cybrary_dashboard.png" alt="Cybrary Dashboard" />
    ),
  },
  {
    title: "User Profiles",
    subtitle: "Cybrary - Cybersecurity Training Platform",
    description:
      "Built a user profile system that allowed users to manage their account settings and information such as name and profile image, toggle profile visibility, and share their progress and achievements with others.",
    viewLink: "https://app.cybrary.it/profile",
    iconElement: (
      <Screenshot src="cybrary_profile.png" alt="Cybrary Profiles" />
    ),
  },
  {
    title: "Forums",
    subtitle: "Cybrary - Cybersecurity Training Platform",
    description:
      "Built a public and private forums system that allowed users to ask questions, share knowledge, and collaborate with others. The forums were built to serve free, paid, and teams users with different access levels and permissions. Authentication was shared with the main platform for better UX.",
    viewLink: "https://forums.cybrary.it/",
    iconElement: <Screenshot src="cybrary_forums.png" alt="Cybrary Forums" />,
  },
  {
    title: "Guided Onboarding",
    subtitle: "Cybrary - Cybersecurity Training Platform",
    description:
      "Built an in-app onboarding system that guided users through the platform, helped them set up their account, and showed them how to access their learning materials. The onboarding system was built to serve free and teams users, navigating them to relevant parts of the platform.",
    viewLink: "https://app.cybrary.it",
    iconElement: (
      <Screenshot src="cybrary_onboarding.png" alt="Cybrary Onboarding" />
    ),
  },
  {
    title: "Sales Demos",
    subtitle: "Cybrary - Cybersecurity Training Platform",
    description:
      "Built an in-app sales demo system that empowered sales teams to show off the teams platform to potential customers. The sales demo system was built to showcase different access levels and permissions of a team, as well as reporting features and user management tools.",
    viewLink: "https://app.cybrary.it/enterprise/demo/organization/dashboard",
    iconElement: (
      <Screenshot src="cybrary_sales_demo.png" alt="Cybrary Sales Demo" />
    ),
  },
  /** SGPFL */
  {
    title: "E-commerce PoS",
    subtitle: "Stove & Grill Parts For Less",
    description:
      "Built a custom e-commerce point-of-sale website on top of Shopify's CMS/Checkout. The system included a user funnel to reduce incorrect orders, product pages optimized for conversion, and resources to make informed purchasing descisions. The website was built to be fast, SEO performant, and easy to use for non-technical users.",
    viewLink: "https://pellet-stove-parts-4less.com/",
    iconElement: <Screenshot src="sgpfl_homepage.png" alt="SGPFL Homepage" />,
  },
  {
    title: "CMS",
    subtitle: "Stove & Grill Parts For Less",
    description:
      "Built a content management system to extend our existing product catalog(s) from Shopify and Finale Inventory in custom ways. The system included a product editor, product list, and product detail pages. It performed basic CRUD operations on data from multiple sources and was built to be fast, reliable, and easy to use for non-technical users.",
    iconElement: <Screenshot src="sgpfl_ac2_app.png" alt="SGPFL AC2 App" />,
  },
  {
    title: "Reporting Server",
    subtitle: "Stove & Grill Parts For Less",
    description:
      "Built a custom reporting server to pull data from Shopify, Finale Inventory, and several other third-party services. The system included multiple forms of export, including CSV/PDF via email, direct download, and writing directly to googlesheets. Handled user authentication, filtering, sorting, custom formulas, and more. Hosted on GCP using cloud run and cloud scheduler.",
    iconElement: (
      <Screenshot src="sgpfl_ac2_reports.png" alt="SGPFL AC2 Reports" />
    ),
  },
  {
    title: "Diagnsotics Server",
    subtitle: "Stove & Grill Parts For Less",
    description:
      "Built a custom diagnostics server to monitor the health of our e-commerce catalog. The system included monitoring of product prices, inventory levels, and order statuses. The system was built to be fast, reliable, and issues were surfaced in a way that was easy fix for end users. Hosted on GCP using cloud run and cloud scheduler.",
    iconElement: (
      <Screenshot src="sgpfl_ac2_diagnostics.png" alt="SGPFL AC2 Diagnostics" />
    ),
  },
  {
    title: "Accessibility Compliance",
    subtitle: "Stove & Grill Parts For Less",
    description:
      "Lead the effort to make our e-commerce platform WCAG 2.2 AA compliant. This included a full audit of the website, a plan to fix issues, and a plan to maintain compliance moving forward. All websites should be accessible to all users, including those with disabilities. Used WAVE and Lighthouse to audit the website.",
    iconElement: (
      <Screenshot
        src="sgpfl_homepage_wave.png"
        alt="SGPFL Homepage WCAG 2.2 AA Compliance"
      />
    ),
    viewLink: "https://pellet-stove-parts-4less.com/",
  },
  {
    title: "Label Generation Server",
    subtitle: "Stove & Grill Parts For Less",
    description:
      "Created an internal custom label generation server to print shelf labels for our warehouse. The system included a web interface to select products, print labels, and manage label templates. The system built labels to a PDF and sent print jobs to a print node client running on the respective printers machine. Hosted on GCP using cloud run.",
    iconElement: (
      <Screenshot src="sgpfl_label_pdf.png" alt="SGPFL Label Server" />
    ),
  },
  /** Portfolio */
  {
    title: "My Portfolio",
    subtitle: "Personal Portfolio",
    description:
      "This website! Built with Next.js, TailwindCSS, and TypeScript. Exported as a static site and hosted on Github Pages. The site is built to be fast, mobile-first, open-source, and easily maintainable meaning a heavy focus on documentation and minimal dependencies.",
    codeLink: "https://github.com/Cellis9421/portfolio",
    viewLink: "https://calvinellis.io",
    iconElement: <Screenshot src="portfolio.png" alt="Portfolio" />,
  },
  /** Side Projects */
  {
    title: "Process Manager",
    subtitle: "Personal Project",
    description:
      "Created a process manager to manage long-running processes on a system. The python script starts processes and monitors them for crashes, restarting them as needed. The system was built to be fast, reliable, and easy to use for non-technical users.",
    iconElement: <Screenshot src="process_manager.png" alt="Process Manager" />,
    codeLink: "https://github.com/Cellis9421/HydraMBLauncher/tree/master",
  },
  {
    title: "Website Builder",
    subtitle: "Personal Project",
    description:
      "Created a php website builder to generate static websites from a simple JSON configuration. As one of my first projects in PHP, it was a great learning experience and allowed me to build a website for a friend in a fraction of the time it would have taken to build by hand. (That was it's only user)",
    iconElement: <Screenshot src="website_builder.png" alt="Website Builder" />,
    codeLink: "https://github.com/Cellis9421/HydraMBLauncher/tree/master",
  },
  {
    title: "Discord AI Bot",
    subtitle: "Personal Project",
    description:
      "Created a discord bot to do various things with AI. The bot could generate text, images, and more. It was a good project to learn about AI text generation and how to integrate it into a discord bot. The bot was used in a few small servers and was a fun project to work on.",
    iconElement: <Screenshot src="discord_ai_bot.png" alt="Discord AI Bot" />,
    codeLink: "https://github.com/Cellis9421/discord-ai-bot",
  },
  {
    title: "pAInt it",
    subtitle: "Personal Project",
    description:
      "Created a web app to generate art using AI. The app could generate art from text. It was a fun project to learn about AI image generation and how to integrate it into a web app. The app was used by a few friends and was a fun project to work on.",
    iconElement: <Screenshot src="paint_it.png" alt="pAInt it App" />,
    codeLink: "https://github.com/Cellis9421/paint-it",
  },
];

export default PROJECTS;
