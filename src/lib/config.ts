// Central business config. Everything a non-developer may need to change lives here.
// Values marked TODO are placeholders that must be replaced before launch.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://unlockedsat.uz').replace(/\/$/, '');

export const site = {
  name: 'Unlocked SAT',
  city: 'Tashkent, Uzbekistan',
  telegram: 'https://t.me/unlockedsat', // TODO: real Telegram channel/bot
  telegramHandle: '@unlockedsat', // TODO
  email: 'hello@unlockedsat.uz', // TODO
  phone: '+998 00 000 00 00', // TODO
};

// Prices in UZS (so'm). Yearly = price per month when billed yearly.
export const pricing = {
  premiumMonthly: 149000, // TODO confirm
  premiumYearly: 119000, // TODO confirm (≈20% off)
  usdRate: 12700, // approximate, only for the small USD hint
};

// Official SAT administrations available to international test takers (College Board 2026–27 calendar).
// regDeadline = regular registration deadline. Verify each year on satsuite.collegeboard.org.
export const satDates: { date: string; regDeadline: string }[] = [
  { date: '2026-10-03', regDeadline: '2026-09-18' },
  { date: '2026-11-07', regDeadline: '2026-10-23' },
  { date: '2026-12-05', regDeadline: '2026-11-20' },
  { date: '2027-03-06', regDeadline: '2027-02-19' },
  { date: '2027-05-01', regDeadline: '2027-04-16' },
  { date: '2027-06-05', regDeadline: '2027-05-21' },
];

export function upcomingSatDates(now = new Date()) {
  const today = new Date(now.toISOString().slice(0, 10));
  return satDates.filter((d) => new Date(d.date) >= today);
}

export function formatSom(n: number) {
  return n.toLocaleString('en-US').replace(/,/g, ' ');
}
