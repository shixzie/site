/**
 * Edge entry point. The site itself is static (Astro → ./dist); this Worker only:
 *   1. 301-redirects www.shixzie.com → https://shixzie.com (path and query kept)
 *   2. adds security headers to the pages it serves
 *   3. marks non-canonical hosts (*.workers.dev, preview URLs) as noindex
 *
 * Hashed build assets under /_astro/* skip the Worker entirely (see
 * `run_worker_first` in wrangler.jsonc) and are cached for a year via public/_headers.
 *
 * HTTP → HTTPS is left to Cloudflare's "Always Use HTTPS" zone setting: under
 * `wrangler dev` requests arrive as http://shixzie.com, so redirecting on the
 * protocol here would loop locally.
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const CANONICAL_HOST = "shixzie.com";
const REDIRECT_HOSTS = new Set(["www.shixzie.com"]);

const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (REDIRECT_HOSTS.has(url.hostname)) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
    if (url.hostname !== CANONICAL_HOST) headers.set("X-Robots-Tag", "noindex");

    // The 404 page is also reachable at /404 — keep its status honest there too.
    const status = url.pathname === "/404" ? 404 : response.status;

    return new Response(response.body, {
      status,
      statusText: status === response.status ? response.statusText : "Not Found",
      headers,
    });
  },
};
