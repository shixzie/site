import { Spring, createLoop, hasFinePointer, prefersReducedMotion } from "./motion";

/** Cards with [data-spotlight] get a soft glow that follows the cursor. */
export function initSpotlight() {
  if (!hasFinePointer()) return;

  document.addEventListener(
    "pointermove",
    (event) => {
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
}

/**
 * [data-magnetic="0.3"] elements lean toward the cursor and spring back when it
 * leaves. Uses the individual `translate` property so it composes with the
 * `scale` press states defined in CSS.
 */
export function initMagnetic() {
  if (!hasFinePointer() || prefersReducedMotion()) return;

  for (const element of document.querySelectorAll<HTMLElement>("[data-magnetic]")) {
    const strength = Number(element.dataset.magnetic) || 0.3;
    const max = 10;
    const x = new Spring(0, 220, 16);
    const y = new Spring(0, 220, 16);

    const loop = createLoop((dt) => {
      x.step(dt);
      y.step(dt);
      const settled = x.settled && y.settled;
      if (settled) {
        x.snap();
        y.snap();
      }
      element.style.translate =
        x.value === 0 && y.value === 0 ? "" : `${x.value.toFixed(2)}px ${y.value.toFixed(2)}px`;
      return !settled;
    });

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      // Measure from the element's resting position, not its displaced one.
      const cx = rect.left - x.value + rect.width / 2;
      const cy = rect.top - y.value + rect.height / 2;
      x.target = Math.max(-max, Math.min(max, (event.clientX - cx) * strength));
      y.target = Math.max(-max, Math.min(max, (event.clientY - cy) * strength));
      loop.wake();
    });

    element.addEventListener("pointerleave", () => {
      x.target = 0;
      y.target = 0;
      loop.wake();
    });
  }
}
