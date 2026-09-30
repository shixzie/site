# shixzie.com

Personal site of Juan Alvarez ([@shixzie](https://github.com/shixzie)). It's a static [Astro](https://astro.build) build with a hand-rolled motion system and no UI framework. It's served by a Cloudflare Worker on `shixzie.com`, and `www.shixzie.com` redirects to it.

## Quick start

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in ./dist
npm run preview   # build + run the production Worker locally (wrangler dev)
npm run check     # type-check .astro/.ts files
```

Requires Node 22.12+.

## Editing content

Almost everything lives in **`src/config.ts`**: name, role, bio, location and time zone, email, the rolling words in the intro, the featured project, other works, the toolbox marquee, the timeline and social links. Entries marked ✏️ are starter content, so swap them for your own.

- **Featured project.** Set `repo: "owner/name"` to show live GitHub stars and forks. They're fetched in the browser, cached per session, and roll into place like a slot machine.
- **Avatar.** `src/assets/avatar-base.png` is the GitHub avatar with the eyes painted out. The eyes are redrawn as SVG so they can follow the cursor, blink, and smile on hover. To use a photo instead, point `avatar.image` at it and set `avatar.eyes` to `null`. `src/assets/avatar.png` is the untouched original.
- **Ask an AI.** The prompt is built from your profile, featured project and socials in `src/components/AskAI.astro`, so it stays in sync with the config.
- **Social images.** `public/og.png` (1200×630), `public/favicon.svg`, `public/favicon.ico` and `public/apple-touch-icon.png` are static files. If you change your name or tagline, replace `og.png` too.

## Motion system

The goal was motion that feels crafted but stays cheap. The whole site ships about 15 kB of JS, split per component. It needs no animation library and never animates layout on scroll.

| Piece | Where |
| --- | --- |
| Tokens: easing curves, durations, stagger | `src/styles/tokens.css` |
| Spring easings (`--ease-spring`, `--ease-bounce`) | generated as CSS `linear()` curves from a damped-spring simulation by `scripts/spring-easing.mjs` (`node scripts/spring-easing.mjs 300 16` prints a custom one) |
| Scroll reveals | `[data-reveal]` (`up`, `fade`, `blur`, `pop`, `line`, `chars`, `words`) in `src/styles/global.css` + `src/scripts/reveal.ts`: elements entering together are staggered as one batch |
| Springs, loops, visibility, time scale | `src/scripts/motion.ts` |
| Magnetic buttons, cursor spotlight | `src/scripts/pointer.ts` (`data-magnetic`, `data-spotlight`) |

Signature moments:

- **Hero.** The name rises out of per-letter masks, the intro words blur in, and a rolling word springs into place with its width gliding to fit.
- **Avatar.** The eyes track the cursor on springs, blink at random (sometimes twice), turn into happy `^ ^` on hover, and squash and stretch on click.
- **Topbar clock.** Colombia's local time. Digits roll odometer-style when the minute changes.
- **Featured card.** A canvas dot field breathes on two interfering waves, and the cursor acts as a lens. It only animates while on screen.
- **Toolbox marquee.** It drifts on its own, speeds up with scroll velocity and follows your scroll direction.
- **Timeline.** A scroll-linked progress rail lights up each milestone as it passes.
- **Theme toggle.** A sun ⇄ moon morph, with the new theme revealed as a circle growing out of the button (View Transitions API).
- **Footer wordmark.** Each letter's variable-font weight swells as the cursor gets near.
- **Slow motion.** The footer switch multiplies every duration by 5, CSS (`--slowmo`) and JS alike, so you can inspect the choreography.
- **Ask an AI.** A floating button, fronted by a mini version of the avatar, slides in after the first scroll. It opens a popover with ChatGPT, Claude, Gemini (via Google AI Mode) and Perplexity, each prefilled with a question about you that points at `/llms.txt`, plus a "copy the prompt" fallback. It's built on the native Popover API, so it works without JavaScript.

Accessibility: everything respects `prefers-reduced-motion`. Reveals become plain fades, and ambient loops (marquee, dot field, rolling words, blinking) stop. Split or duplicated text is hidden from screen readers in favour of the plain copy. If JavaScript never loads, a CSS failsafe shows all content after 2.5 s.

## Deploying to Cloudflare Workers

The site deploys as a Worker with [static assets](https://developers.cloudflare.com/workers/static-assets/). Configuration is in `wrangler.jsonc`:

- `./dist` is served from Cloudflare's edge. Unknown paths get `404.html` with a real 404 status.
- `worker/index.ts` runs in front of the pages only. It 301-redirects `www.shixzie.com` → `https://shixzie.com` (keeping path and query), adds security headers, and marks `*.workers.dev` and preview hosts `noindex`.
- Fingerprinted files in `/_astro/*` skip the Worker and are cached for a year (`public/_headers`).
- `shixzie.com` and `www.shixzie.com` are attached as [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/). Cloudflare creates the DNS records and certificates on deploy.

### One-time setup

1. Make sure the `shixzie.com` zone is on your Cloudflare account.
2. Delete any existing `A`, `AAAA` or `CNAME` records for `shixzie.com` and `www.shixzie.com`. Custom Domains need to create their own.
3. In **SSL/TLS → Edge Certificates**, turn on **Always Use HTTPS**. The Worker leaves http→https to Cloudflare.

### Deploy from your machine

```sh
npx wrangler login
npm run deploy
```

### Or deploy on every push (Workers Builds)

In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository** and pick this repo. Then use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

> Prefer to keep the www redirect out of the Worker? Remove `www.shixzie.com` from `routes`, add a proxied DNS record for `www`, and create a **Redirect Rule** (www → apex) instead. The Worker's redirect then simply never runs.

## Project structure

```
├── public/                 static files copied as-is (_headers, icons, og.png, robots.txt)
├── scripts/
│   └── spring-easing.mjs   spring physics → CSS linear() easing generator
├── src/
│   ├── assets/             avatar (optimised by astro:assets at build time)
│   ├── components/         one .astro file per section / interaction (markup, styles, script)
│   ├── layouts/Base.astro  <head>, fonts, theme bootstrap, global scripts
│   ├── pages/              index, 404, llms.txt, sitemap.xml
│   ├── scripts/            shared motion primitives
│   ├── styles/             tokens.css + global.css
│   └── config.ts           ← your content
├── worker/index.ts         edge Worker (www redirect + headers)
├── astro.config.mjs        site URL + self-hosted fonts (Geist, Geist Mono, Instrument Serif)
└── wrangler.jsonc          Cloudflare Worker config
```
