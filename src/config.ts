// Everything you'd want to edit about the site lives here.
// Items marked ✏️ are starter content — swap them for your own.

import avatarBase from "./assets/avatar-base.png";

export const profile = {
  name: "Juan Alvarez",
  handle: "shixzie",
  role: "AI Engineer",
  bio: "Just a normal guy~",
  location: "Colombia",
  flag: "co" as const,
  timeZone: "America/Bogota",
  email: "juanca.alvrz@gmail.com",
  /** Shows the pulsing "available" badge in the hero. */
  available: true,
  availableLabel: "Available for new projects",
};

/** The big intro line: `${before} <rolling word> ${after}` */
export const intro = {
  before: "Just a normal guy~ who likes building",
  words: ["thoughtful interfaces", "privacy-first apps", "developer tools", "tiny experiments"], // ✏️
  after: "for the web.",
};

/**
 * The avatar is an illustration, so its eyes are drawn live on top of an
 * eyeless base image: they follow the cursor, blink, and smile on hover.
 * Using a photo instead? Point `image` at it and set `eyes` to `null`.
 * Eye geometry is in the image's own pixel space.
 */
export const avatar = {
  image: avatarBase,
  eyes: {
    viewBox: 400,
    color: "#1d1b1b",
    angle: 14,
    width: 24,
    height: 67,
    positions: [
      [89.8, 271.6],
      [199.2, 296.8],
    ] as Array<[number, number]>,
  } as const,
};

export const featured = {
  // Your best project. `repo` (owner/name) enables live GitHub stars & forks.
  title: "RealPDF",
  description:
    "A full PDF editor that runs entirely in your browser: edit text in place, fill forms, convert Office files and sign with real certificates. Your documents never leave your device.",
  href: "https://realpdf.app",
  repo: "shixzie/realpdf",
  tags: ["React", "pdf.js", "WebCrypto", "Cloudflare Workers"],
};

export const works = [
  {
    title: "Factory on Rails",
    description:
      "A software factory on Railway: describe a change, and a coding agent does the work in a sandbox and opens a pull request.",
    href: "https://github.com/shixzie/factory-on-rails",
    meta: "TypeScript · Effect · Railway",
  },
  {
    title: "More on GitHub",
    description: "Everything else I've open-sourced, experiments included.",
    href: "https://github.com/shixzie?tab=repositories",
    meta: "github.com/shixzie",
  },
];

/** Scrolling marquee between sections. */
export const toolbox = [
  "TypeScript",
  "Go",
  "React",
  "Effect",
  "Next.js",
  "Cloudflare Workers",
  "Railway",
  "PostgreSQL",
  "Node.js",
  "WebAssembly",
  "AWS",
  "MCP",
  "Redis",
  "Docker",
  "Astro",
];

/** Work history. The page shows it on the timeline; /llms.txt lists the details. */
export const experience = [
  {
    company: "Prisma Gestión Empresarial",
    href: "https://www.prisma.com.co",
    role: "Full-Stack Developer",
    period: "Apr 2019 – Aug 2026",
    about: "Event-management company in Medellín that runs Feria 2 Ruedas.",
    highlights: [
      "Ran the company's digital infrastructure and its events, keeping them available through traffic spikes.",
      "Designed, built and maintained 4+ production websites with React, Next.js and Strapi.",
      "Built internal Go and Node.js APIs for accreditation, payments and event data.",
      "Brought AI-assisted development (Claude Code, Codex) into the team's workflow.",
    ],
  },
];

export const timeline = [
  // Newest first.
  { when: "Now", what: "Building RealPDF and Factory on Rails in the open." },
  { when: "2026 Sep", what: "Started Factory on Rails, a software factory where coding agents open the pull requests." },
  { when: "2026 Sep", what: "Launched RealPDF: edit, sign and convert PDFs without uploading them anywhere." },
  {
    when: "2019–2026",
    what: "Full-stack developer at Prisma Gestión Empresarial, the team behind Feria\u00a02\u00a0Ruedas: ran the web side of its events and built its Go and Node.js APIs.",
  },
  { when: "2016", what: "Opened a GitHub account and started building in public." },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/shixzie", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/juanca-alvrz/", icon: "linkedin" },
  { label: "X", href: "https://x.com/shixzie", icon: "x" },
] as const;

export const site = {
  title: `${profile.name} (@${profile.handle})`,
  description: `${profile.name}, ${profile.role} from ${profile.location}. ${profile.bio}`,
  lang: "en",
};
