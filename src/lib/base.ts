// Sub-path the site is served under (e.g. "/unlocked" on GitHub Pages, "" on a custom domain).
// Next.js <Link> and router add it automatically; plain <a href> and window.location need it explicitly.
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
export const withBase = (href: string) => (href.startsWith('/') ? BASE_PATH + href : href);
