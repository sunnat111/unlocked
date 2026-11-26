export function ScrollBadge({ text }: { text: string }) {
  return (
    <svg className="scroll-badge" viewBox="0 0 100 100" aria-hidden>
      <defs>
        <path id="sb-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
      </defs>
      <text fontSize="9.2" letterSpacing="1.6" fill="currentColor">
        <textPath href="#sb-circle">{text.toUpperCase()}</textPath>
      </text>
      <path d="M50 38 v22 m-7 -7 l7 7 l7 -7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
