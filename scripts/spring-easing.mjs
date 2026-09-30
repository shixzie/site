// Generates CSS `linear()` easing curves from a damped spring simulation.
//
//   node scripts/spring-easing.mjs            → prints the presets used in src/styles/tokens.css
//   node scripts/spring-easing.mjs 300 16     → prints a custom spring (stiffness, damping[, mass])
//
// The curve is sampled until the spring settles, then simplified (Ramer–Douglas–Peucker)
// so the resulting `linear()` stays short while tracking the physics within ~0.2%.

const presets = {
  spring: { stiffness: 260, damping: 24 }, // snappy, ~3% overshoot
  bounce: { stiffness: 300, damping: 16 }, // playful, ~20% overshoot
};

function simulate({ stiffness, damping, mass = 1 }) {
  const dt = 1 / 1000;
  let x = 0;
  let v = 0;
  let t = 0;
  const samples = [[0, 0]];
  let restFor = 0;
  while (t < 5) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt;
    x += v * dt;
    t += dt;
    samples.push([t, x]);
    restFor = Math.abs(x - 1) < 0.0015 && Math.abs(v) < 0.02 ? restFor + dt : 0;
    if (restFor > 0.05) break;
  }
  samples[samples.length - 1][1] = 1;
  return { duration: t, samples };
}

function rdp(points, epsilon) {
  if (points.length < 3) return points;
  const [x1, y1] = points[0];
  const [x2, y2] = points[points.length - 1];
  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const d =
      Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) /
      Math.hypot(y2 - y1, x2 - x1);
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }
  if (maxDist <= epsilon) return [points[0], points[points.length - 1]];
  return [
    ...rdp(points.slice(0, index + 1), epsilon).slice(0, -1),
    ...rdp(points.slice(index), epsilon),
  ];
}

function toLinear(config) {
  const { duration, samples } = simulate(config);
  const normalized = samples.map(([t, x]) => [t / duration, x]);
  const points = rdp(normalized, 0.002);
  const stops = points.map(([p, x], i) => {
    const value = +x.toFixed(4);
    if (i === 0 || i === points.length - 1) return String(value);
    return `${value} ${+(p * 100).toFixed(2)}%`;
  });
  return { duration: Math.round(duration * 1000), easing: `linear(${stops.join(", ")})` };
}

const [stiffness, damping, mass] = process.argv.slice(2).map(Number);
const entries = stiffness
  ? [["custom", { stiffness, damping, mass }]]
  : Object.entries(presets);

for (const [name, config] of entries) {
  const { duration, easing } = toLinear(config);
  console.log(`/* ${name}: stiffness ${config.stiffness}, damping ${config.damping} */`);
  console.log(`--ease-${name}: ${easing};`);
  console.log(`--dur-${name}: ${duration}ms;\n`);
}
