import { prefersReducedMotion, timeScale } from "./motion";

// Two full cycles so every digit spins through at least one turn before landing.
const DIGITS = "01234567890123456789";
const formatter = new Intl.NumberFormat("en-US");

/**
 * Replaces `element`'s content with a slot-machine style number that rolls
 * into place, cascading left to right. Screen readers get the plain value.
 */
export function rollTo(element: HTMLElement, value: number) {
  const text = formatter.format(value);

  const label = document.createElement("span");
  label.className = "sr-only";
  label.textContent = text;

  const visual = document.createElement("span");
  visual.className = "rolling";
  visual.setAttribute("aria-hidden", "true");

  const strips: Array<[HTMLElement, number]> = [];
  for (const char of text) {
    if (!/\d/.test(char)) {
      visual.append(char);
      continue;
    }
    const slot = document.createElement("span");
    slot.className = "rolling-slot";
    const strip = document.createElement("span");
    strip.className = "rolling-strip";
    for (const digit of DIGITS) {
      const cell = document.createElement("span");
      cell.textContent = digit;
      strip.append(cell);
    }
    slot.append(strip);
    visual.append(slot);
    strips.push([strip, Number(char)]);
  }

  element.replaceChildren(label, visual);

  const land = (strip: HTMLElement, digit: number) => {
    strip.style.translate = `0 ${-(10 + digit) * 5}%`;
  };

  if (prefersReducedMotion()) {
    for (const [strip, digit] of strips) {
      strip.style.transition = "none";
      land(strip, digit);
    }
    return;
  }

  // Two frames: let the strips paint at 0 before transitioning.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      strips.forEach(([strip, digit], index) => {
        strip.style.transitionDelay = `${index * 90 * timeScale()}ms`;
        land(strip, digit);
      });
    }),
  );
}
