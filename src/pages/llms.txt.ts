import type { APIRoute } from "astro";
import { featured, profile, socials, timeline, works } from "../config";

// Plain-text summary for LLM crawlers (https://llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const lines = [
    `# ${profile.name} (@${profile.handle})`,
    "",
    `> ${profile.role} based in ${profile.location}. ${profile.bio}`,
    "",
    "## Featured",
    "",
    `- [${featured.title}](${featured.href}): ${featured.description}`,
    "",
    "## Other works",
    "",
    ...works.map((work) => `- [${work.title}](${work.href}): ${work.description}`),
    "",
    "## Background",
    "",
    ...timeline.map((item) => `- ${item.when}: ${item.what}`),
    "",
    "## Links",
    "",
    `- Website: ${site?.href ?? ""}`,
    `- Email: ${profile.email}`,
    ...socials.map((social) => `- ${social.label}: ${social.href}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
