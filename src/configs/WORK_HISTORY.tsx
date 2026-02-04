import type IWorkHistory from "../../@types/IWorkHistory";

/**
 * Work history from resume. Dates use full months; Cybrary end date February 2025.
 */
const WORK_HISTORY: IWorkHistory[] = [
  {
    company: "Cybrary (Cybersecurity Education-as-a-Service)",
    title: "Principal Software Engineer",
    dates: "September 2022 → February 2026",
    location: "Remote | Washington D.C.",
    bullets: [
      "Rewrote marketing website (Next.js, TS, ISR/SSR, Vercel, Tailwind)",
      "Rewrote core application (Next.js, TS, Vercel, MaterialUI)",
      "Multi-tenancy, Configurable RBAC, MSW Demos, Cursor rules",
      "Organized and led company-wide 'AI Enablement' training sessions",
      "Documented hundreds of workflows and systems, resulting in faster onboarding and better agentic understanding of our code (Confluence, Miro, READMEs)",
      "Managed/Maintained a cloud-based complex virtual lab environment (CLAB)",
      "Orchestrated cross-team projects - often acted as a TPM (JIRA, Trello)",
      "Trained engineers on team/org with 1:1 agentic coding sessions, helping them find where AI can improve DX and velocity",
      "Mentored interns, helping them complete required work and personal goals",
    ],
  },
  {
    company: "Stove & Grill Parts for Less (E-commerce)",
    title: "Lead Software Engineer",
    dates: "January 2017 → September 2022",
    location: "Remote | Cataumet, MA",
    bullets: [
      "Lead engineering strategy/team, growing revenue from $1M ARR → $10M ARR",
      "Rewrote core e-commerce site (Shopify CMS, Liquid, JS) with WCAG 2.2 AA accessibility and better IA / design for the industry",
      "Built sync services to move our catalog, inventory, and sales data between sales channels (Shopify, Amazon, Walmart, eBay, Etsy, Google)",
      "Built a report / diagnostic server to provide critical insights into the business",
      "Optimized third-party tools, significantly enhancing the security, reliability, and cost-efficiency. (Fulfillment, IMS, Marketing)",
      "Implemented CI/CD pipelines for automated deployments of all services and sites (GitHub Actions)",
      "Helped orchestrate engineering, marketing, and customer success efforts.",
      "Mentored engineers of all skill levels through rapid growth.",
    ],
  },
  {
    company: "Independent (SMB Websites / Systems)",
    title: "Contract Software Engineer",
    dates: "May 2012 → January 2017",
    location: "Plymouth, MA",
    bullets: [
      "Built custom CMS platforms and marketing automation tools for small businesses, streamlining internal reporting, task management, and customer engagement.",
      "Built web applications to improve operational efficiency, integrating CRMs and analytics dashboards based on client-specific needs.",
      "Worked with clients to find technologies and tools that cost-effectively empower small businesses.",
    ],
  },
  {
    company: "Independent (Game Bot Development)",
    title: "Game Bot Developer",
    dates: "January 2009 → May 2012",
    bullets: [
      "Built AI bots in Java that automated gameplay and completed complex tasks across multiple video games.",
      "Used reflection and injection techniques to run scripts on top of or inside native game clients.",
      "Designed workflows that consumed external APIs to drive bot behavior and in-game actions.",
      "Developed complex scripts in Java to orchestrate multi-step tasks and objectives within game environments.",
      "Focused on Java-based tooling, API integration, and script orchestration for automated in-game completion of varied tasks.",
    ],
  },
];

export default WORK_HISTORY;
