// Shared motion primitives: preferences, a global time scale, springs and a
// visibility helper. Everything that animates in JS goes through these so the
// whole site respects reduced motion and the footer's slow-mo switch.

const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = matchMedia("(hover: hover) and (pointer: fine)");

export const prefersReducedMotion = () => reducedQuery.matches;
export const hasFinePointer = () => finePointerQuery.matches;

/* ------------------------------------------------------------ time scale */

let scale = 1;

/** Multiplier applied to every duration (1 = normal, >1 = slower). */
export const timeScale = () => scale;

/** Slows (or restores) CSS via --slowmo and JS loops via timeScale(). */
export function setTimeScale(next: number) {
  scale = next;
  document.documentElement.style.setProperty("--slowmo", String(next));
}

/* ------------------------------------------------------------ springs */

/**
 * Damped spring integrated with semi-implicit Euler, sub-stepped so it stays
 * stable on slow frames. Defaults match the CSS `--ease-spring` token.
 */
export class Spring {
  value: number;
  target: number;
  velocity = 0;

  constructor(
    initial = 0,
    public stiffness = 260,
    public damping = 24,
  ) {
    this.value = initial;
    this.target = initial;
  }

  /** Advance by `dt` seconds of real time (already divided by the time scale). */
  step(dt: number) {
    const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
      this.velocity += force * h;
      this.value += this.velocity * h;
    }
  }

  get settled() {
    return Math.abs(this.value - this.target) < 0.01 && Math.abs(this.velocity) < 0.01;
  }

  snap() {
    this.value = this.target;
    this.velocity = 0;
  }
}

/**
 * Runs `tick(dt)` every frame while `tick` returns true, then sleeps until
 * `wake()` is called again. `dt` is in seconds and already time-scaled.
 */
export function createLoop(tick: (dt: number) => boolean) {
  let frame = 0;
  let last = 0;

  const run = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 20) / scale;
    last = now;
    frame = tick(dt) ? requestAnimationFrame(run) : 0;
  };

  return {
    wake() {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(run);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

/* ------------------------------------------------------------ visibility */

/** Calls `callback(true|false)` as `element` enters / leaves the viewport. */
export function watchVisibility(
  element: Element,
  callback: (visible: boolean) => void,
  rootMargin = "0px",
) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) callback(entry.isIntersecting);
    },
    { rootMargin },
  );
  observer.observe(element);
  return () => observer.disconnect();
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
