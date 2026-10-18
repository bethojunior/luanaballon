export default function Balloon({
  color,
  className = '',
  delay = 0,
}: {
  /** nome da variável de tema (pink, sun, aqua, grape) ou cor CSS */
  color: string;
  className?: string;
  delay?: number;
}) {
  const fill = ['pink', 'sun', 'aqua', 'grape'].includes(color) ? `rgb(var(--${color}))` : color;
  return (
    <svg
      viewBox="0 0 60 90"
      className={`floaty pointer-events-none ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden
    >
      <ellipse cx="30" cy="32" rx="26" ry="30" style={{ fill }} />
      <path d="M30 62l-5 7h10z" style={{ fill }} />
      <path d="M30 69q-8 10 0 20" stroke="#8a7a99" strokeWidth="1.5" fill="none" />
      <ellipse cx="20" cy="20" rx="6" ry="10" fill="#fff" opacity=".4" transform="rotate(25 20 20)" />
    </svg>
  );
}
