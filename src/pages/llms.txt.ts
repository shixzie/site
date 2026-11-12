import type { APIRoute } from "astro";
import { experience, featured, profile, socials, timeline, toolbox, works } from "../config";

const source = (href: string, repo?: string) => {
  const url = repo && `https://github.com/${repo}`;
  return url && url !== href ? ` Source: ${url}` : "";
};

// Plain-text summary for LLM crawlers (https://llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const lines = [
    `# ${profile.name} (@${profile.handle})`,
    "",
    `> ${profile.role} based in ${profile.location}. ${profile.bio}`,
    "",
    "## Featured",
    "",
    `- [${featured.title}](${featured.href}): ${featured.description}${source(featured.href, featured.repo)}`,
    "",
    "## Other works",
    "",
    ...works.map((work) => `- [${work.title}](${work.href}): ${work.description}${source(work.href, work.repo)}`),
    "",
    "## Experience",
    "",
    ...experience.flatMap((job) => [
      `### ${job.role}, [${job.company}](${job.href}) (${job.period})`,
      "",
      job.about,
      "",
      ...job.highlights.map((highlight) => `- ${highlight}`),
      "",
    ]),
    "## Toolbox",
    "",
    toolbox.join(", "),
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
