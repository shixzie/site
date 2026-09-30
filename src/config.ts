// Everything you'd want to edit about the site lives here.
// Items marked ✏️ are starter content — swap them for your own.

import avatarBase from "./assets/avatar-base.png";

export const profile = {
  name: "Juan Alvarez",
  handle: "shixzie",
  role: "Software engineer", // ✏️
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
  words: ["thoughtful interfaces", "fast backends", "developer tools", "tiny experiments"], // ✏️
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
  // ✏️ Your best project. `repo` (owner/name) enables live GitHub stars & forks.
  title: "shixzie.com",
  description:
    "This very site. Astro, a hand-tuned motion system with no UI framework, served from Cloudflare's edge.",
  href: "https://github.com/shixzie/site",
  repo: "shixzie/site",
  tags: ["Astro", "TypeScript", "Cloudflare Workers"],
};

export const works = [
  // ✏️
  {
    title: "Gists",
    description: "Snippets, experiments and notes-to-self.",
    href: "https://gist.github.com/shixzie",
    meta: "GitHub Gist",
  },
  {
    title: "Open source",
    description: "Everything else I've published lives here.",
    href: "https://github.com/shixzie?tab=repositories",
    meta: "GitHub",
  },
];

/** Scrolling marquee between sections. */
export const toolbox = [
  // ✏️
  "TypeScript",
  "Go",
  "Astro",
  "Cloudflare",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "Figma",
  "Linux",
  "Git",
];

export const timeline = [
  // ✏️ Newest first.
  { when: "Now", what: "Writing code, sweating the details, learning something new every week." },
  { when: "2026", what: "Launched shixzie.com — a small home on the internet." },
  { when: "2016", what: "Opened a GitHub account and started building in public." },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/shixzie", icon: "github" },
  { label: "X", href: "https://x.com/shixzie", icon: "x" },
  { label: "Gists", href: "https://gist.github.com/shixzie", icon: "code" },
] as const;

export const site = {
  title: `${profile.name} (@${profile.handle})`,
  description: `${profile.name} — ${profile.role.toLowerCase()} from ${profile.location}. ${profile.bio}`,
  lang: "en",
};
