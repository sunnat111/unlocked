export function AccBar({ label, acc, meta }: { label: string; acc: number; meta?: string }) {
  const tone = acc >= 75 ? 'good' : acc >= 50 ? 'mid' : 'low';
  return (
    <div className="accbar">
      <div className="accbar-top">
        <span>{label}</span>
        <b>{acc}%</b>
      </div>
      <div className={`accbar-track tone-${tone}`}><span style={{ width: `${Math.max(3, acc)}%` }} /></div>
      {meta && <small>{meta}</small>}
    </div>
  );
}
