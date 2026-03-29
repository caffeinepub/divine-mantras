interface MalaBeadsProps {
  total?: number;
  completed: number;
  size?: number;
}

export default function MalaBeads({
  total = 108,
  completed,
  size = 280,
}: MalaBeadsProps) {
  const cx = size / 2;
  const cy = size / 2;
  const rx = size * 0.42;
  const ry = size * 0.38;
  const beadRadius = size * 0.028;

  const beads = Array.from({ length: total }, (_, i) => {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    const isCompleted = i < completed;
    const isCurrent = i === completed - 1 || i === completed;
    return { x, y, isCompleted, isCurrent, index: i };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      className="mx-auto"
    >
      <title>
        Mala bead counter: {completed} of {total}
      </title>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke="#d4a574"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {beads.map((bead) => (
        <circle
          key={`bead-${bead.index}`}
          cx={bead.x}
          cy={bead.y}
          r={bead.isCurrent ? beadRadius * 1.4 : beadRadius}
          fill={
            bead.isCompleted
              ? "oklch(0.782 0.175 74)"
              : bead.isCurrent
                ? "oklch(0.694 0.168 162)"
                : "oklch(0.921 0.003 264)"
          }
          stroke={
            bead.isCompleted || bead.isCurrent
              ? "oklch(0.65 0.15 74)"
              : "oklch(0.85 0.003 264)"
          }
          strokeWidth="0.5"
          opacity={bead.isCurrent ? 1 : bead.isCompleted ? 0.9 : 0.6}
        />
      ))}

      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize={size * 0.12}
        fontFamily="'Noto Sans Devanagari', sans-serif"
        fill="oklch(0.782 0.175 74)"
        fontWeight="700"
      >
        {completed}
      </text>
      <text
        x={cx}
        y={cy + size * 0.07}
        textAnchor="middle"
        fontSize={size * 0.055}
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fill="oklch(0.511 0.013 264)"
      >
        of {total}
      </text>
    </svg>
  );
}
