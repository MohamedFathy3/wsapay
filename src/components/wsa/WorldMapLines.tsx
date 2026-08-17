const NODES: { x: number; y: number }[] = [
  { x: 148, y: 118 },
  { x: 205, y: 96 },
  { x: 262, y: 150 },
  { x: 330, y: 108 },
  { x: 392, y: 168 },
  { x: 452, y: 132 },
  { x: 300, y: 230 },
  { x: 420, y: 262 },
  { x: 190, y: 210 },
];

const LINES: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 5],
  [2, 4],
  [0, 8],
  [8, 6],
  [6, 7],
  [4, 7],
  [2, 3],
];

function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.abs(b.x - a.x) * 0.28;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export function WorldMapLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 340"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="wsa-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.15" fill="white" fillOpacity="0.34" />
        </pattern>
        <linearGradient id="wsa-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.05" />
          <stop offset="50%" stopColor="var(--brand-magenta)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* stylised dotted landmasses */}
      <g fill="url(#wsa-dots)">
        <path d="M60 90 q40-32 96-22 t70 34 q10 42-28 66 t-84 22 q-52-14-58-52 z" />
        <path d="M150 200 q34-16 52 12 t8 74 q-16 32-40 20 t-26-70 z" />
        <path d="M262 78 q56-26 104-8 t62 44 q-6 34-56 42 t-100-16 q-24-32-10-62 z" />
        <path d="M280 178 q40-14 62 14 t6 66 q-28 24-52 4 t-16-84 z" />
        <path d="M424 176 q52-24 96 4 t28 62 q-40 26-88 8 t-36-74 z" />
      </g>

      {LINES.map(([a, b], i) => (
        <path
          key={i}
          d={arc(NODES[a]!, NODES[b]!)}
          fill="none"
          stroke="url(#wsa-line)"
          strokeWidth="1.2"
        />
      ))}

      {NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="8" fill="var(--brand-magenta)" opacity="0.16">
            <animate
              attributeName="r"
              values="6;13;6"
              dur="3.6s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle cx={n.x} cy={n.y} r="2.6" fill="white" opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}