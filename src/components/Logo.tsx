export function LogoMark({ size = 32, title }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <circle cx="50" cy="50" r="50" fill="#2C4271" />
      <path d="M36.5 44 C34 31 39 21.5 52 21.5 C62.5 21.5 70 25.5 70 31" fill="none" stroke="#D5A13C" strokeWidth="8.5" strokeLinecap="round" />
      <rect x="31" y="42" width="38" height="29" rx="5" fill="#D5A13C" />
      <circle cx="50" cy="53.5" r="4" fill="#2C4271" />
      <rect x="48.4" y="54" width="3.2" height="9" rx="1.2" fill="#2C4271" />
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-word">
        <b>SAT</b>
        <span>Unlocked</span>
      </span>
    </span>
  );
}
