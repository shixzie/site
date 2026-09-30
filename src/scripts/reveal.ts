import { timeScale } from "./motion";

const STAGGER_MS = 70; // keep in sync with --stagger
const MAX_STEPS = 8;

/**
 * Batched scroll reveals. Everything that becomes visible in the same frame is
 * revealed as one choreographed group, staggered in document order — so the
 * first paint cascades top-to-bottom and later sections cascade as they scroll in.
 */
export function initReveal() {
  const root = document.documentElement;
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

  // If this script arrives late (slow network), the CSS failsafe has already
  // shown the content — don't hide it again just to animate it.
  if (performance.now() > 2300) {
    root.classList.add("no-reveal", "motion-ready");
    return;
  }
  root.classList.add("motion-ready");

  let queue: HTMLElement[] = [];
  let scheduled = false;

  const flush = () => {
    scheduled = false;
    queue.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    queue.forEach((element, index) => {
      const offset = Number(element.dataset.revealDelay ?? 0);
      const delay = (Math.min(index, MAX_STEPS) * STAGGER_MS + offset) * timeScale();
      element.style.setProperty("--d", `${delay}ms`);
      element.classList.add("is-in");
    });
    queue = [];
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        queue.push(entry.target as HTMLElement);
      }
      if (queue.length && !scheduled) {
        scheduled = true;
        requestAnimationFrame(flush);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );

  // Give web fonts a moment so split text doesn't reflow mid-animation.
  const fonts = document.fonts?.ready ?? Promise.resolve();
  Promise.race([fonts, new Promise((resolve) => setTimeout(resolve, 700))]).then(() => {
    elements.forEach((element) => observer.observe(element));
  });
}
