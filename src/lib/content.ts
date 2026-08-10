export const QUOTES = [
  "Kindness is Christmas magic. ✨",
  "Believe in the impossible. 🌟",
  "Every act of kindness helps Santa. 🎅",
  "The best gift you can give is a smile. 😊",
  "Christmas magic lives in your heart all year long. ❤️",
  "Sharing is the sweetest treat of all. 🍬",
  "A little sparkle of kindness can light up the whole world. 💡",
  "Santa says: being kind is always cool. ⛄",
  "Every snowflake is special — just like you. ❄️",
  "Helping others is the elf way! 🧝",
  "Wonder and joy are the true colors of Christmas. 🎄",
  "The nicest list is the one where you help a friend. 📜",
  "Magic happens when you believe. 🪄",
  "Warm hearts melt the coldest winters. 🔥",
  "Giving is the greatest gift of all. 🎁",
];
export function quoteOfTheDay(): string {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
export type CertDef = {
  key: string;
  title: string;
  description: string;
  emoji: string;
  premium: boolean;
  requirement: string;
};
export const CERTIFICATES: CertDef[] = [
  {
    key: "north-pole-friend",
    title: "Official Friend of the North Pole",
    description: "Awarded for sending your very first letter to your elf!",
    emoji: "🏅",
    premium: false,
    requirement: "Send your first letter",
  },
  {
    key: "elf-best-friend",
    title: "Elf Best Friend Award",
    description: "Awarded for sending 5 letters to your elf pen pal!",
    emoji: "💖",
    premium: false,
    requirement: "Send 5 letters",
  },
  {
    key: "santas-helper",
    title: "Santa's Helper Certificate",
    description: "Awarded for playing your first North Pole mini game!",
    emoji: "🎖️",
    premium: false,
    requirement: "Play a mini game",
  },
  {
    key: "kindness",
    title: "Christmas Kindness Certificate",
    description: "Awarded for earning 3 game achievements!",
    emoji: "🌟",
    premium: false,
    requirement: "Earn 3 achievements",
  },
  {
    key: "nice-list",
    title: "Santa's Nice List Certificate",
    description:
      "The official Nice List certificate, signed by Santa himself! A premium keepsake.",
    emoji: "📜",
    premium: true,
    requirement: "Premium — unlocked by a parent",
  },
];
export type Addon = {
  key: string;
  title: string;
  priceCents: number;
  emoji: string;
  description: string;
};
export const ADDONS: Addon[] = [
  {
    key: "nice-list-cert",
    title: "Nice List Certificate",
    priceCents: 499,
    emoji: "📜",
    description: "Premium printable certificate signed by Santa",
  },
  {
    key: "friendship-cert",
    title: "Friendship Certificate",
    priceCents: 499,
    emoji: "🤝",
    description: "Celebrate your child's elf friendship",
  },
  {
    key: "personal-video",
    title: "Personalized Video Message",
    priceCents: 999,
    emoji: "🎬",
    description: "A magical video from your child's elf using their name",
  },
  {
    key: "birthday-letter",
    title: "Birthday Letter",
    priceCents: 399,
    emoji: "🎂",
    description: "A special birthday letter from the North Pole",
  },
  {
    key: "christmas-eve-letter",
    title: "Christmas Eve Letter",
    priceCents: 399,
    emoji: "🎄",
    description: "Delivered on the most magical night of the year",
  },
  {
    key: "printed-letter",
    title: "Printed Letter Mailed Home",
    priceCents: 799,
    emoji: "📬",
    description: "A real letter with North Pole postmark, mailed to your door",
  },
  {
    key: "gift-box",
    title: "Gift Box Upgrade",
    priceCents: 2499,
    emoji: "🎁",
    description: "A magical North Pole gift box with elf goodies",
  },
];
export const PLANS = [
  {
    key: "monthly",
    title: "Monthly Magic",
    priceCents: 799,
    period: "/month",
    emoji: "✉️",
    perks: [
      "Unlimited letters to your elf",
      "AI elf replies with memory",
      "All free games & achievements",
      "New videos every week",
    ],
  },
  {
    key: "annual",
    title: "Annual Wonderland",
    priceCents: 4999,
    period: "/year",
    emoji: "🎄",
    perks: [
      "Everything in Monthly Magic",
      "2 premium certificates included",
      "Birthday letter included",
      "Priority elf replies",
    ],
  },
  {
    key: "lifetime",
    title: "Lifetime Believer",
    priceCents: 12999,
    period: " one time",
    emoji: "⭐",
    perks: [
      "Everything in Annual Wonderland",
      "All premium certificates forever",
      "Christmas Eve letter every year",
      "Founding Family badge",
    ],
  },
];
