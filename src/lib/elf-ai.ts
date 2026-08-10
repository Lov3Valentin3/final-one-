import type { Elf } from "./elves";
type ChildProfile = {
  firstName: string;
  age: number;
  favoriteColor: string;
  favoriteActivity: string;
};
type HistoryItem = { sender: string; body: string };
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}
/** Extract simple "memories" from the child's past letters. */
function extractMemories(history: HistoryItem[]): string[] {
  const memories: string[] = [];
  const childLetters = history.filter((h) => h.sender === "child");
  for (const letter of childLetters) {
    const text = letter.body.toLowerCase();
    const wishMatch = text.match(
      /(?:i (?:want|wish for|would love|hope for)|for christmas i want)\s+([^.!?\n]{3,60})/
    );
    if (wishMatch) memories.push(`wished for ${wishMatch[1].trim()}`);
    const petMatch = text.match(
      /my (dog|cat|puppy|kitten|hamster|fish|bunny|rabbit)\s*(?:named|called)?\s*([a-z]{2,15})?/
    );
    if (petMatch)
      memories.push(
        `has a ${petMatch[1]}${petMatch[2] ? ` named ${petMatch[2][0].toUpperCase()}${petMatch[2].slice(1)}` : ""}`
      );
    if (/birthday/.test(text)) memories.push("mentioned their birthday");
    const likeMatch = text.match(/i (?:love|like|really like)\s+([^.!?\n]{3,50})/);
    if (likeMatch) memories.push(`loves ${likeMatch[1].trim()}`);
  }
  return [...new Set(memories)].slice(-5);
}
const WORKSHOP_NEWS = [
  "This morning the toy train department had a runaway train — it looped around the cocoa station THREE times before Santa caught it with his hat!",
  "Big news from the North Pole: the reindeer had their flying practice today and Comet did a triple loop-the-loop!",
  "You should have seen the workshop today — we glued 10,000 teddy bear noses and I only got glue in my hair twice!",
  "Mrs. Claus baked a gingerbread castle today that is taller than me. She let me eat one of the chimney pieces!",
  "The penguins visited from the South Pole today (they took the express iceberg). They waddled all over Santa's office!",
  "We tested the new sleigh bells today. They are so shiny I could see my face in them — my nose looked HUGE and I giggled all afternoon.",
  "A baby polar bear wandered into the wrapping room today and fell asleep in a pile of ribbons. Even Santa came to look because it was SO cute!",
  "The Northern Lights were extra sparkly last night — green and purple and gold, like the sky was throwing a party!",
];
const ENCOURAGEMENTS = [
  "Santa walked by while I was reading your letter and said you sound like a wonderful friend — and Santa is NEVER wrong about that.",
  "You know what? Your letters always make my day sparklier than a fresh snowfall.",
  "I told the reindeer about you and they all stomped their hooves — that's reindeer for 'we like this kid!'",
  "Keep being kind and curious — that's the most powerful Christmas magic there is.",
];
function buildFallbackReply(
  elf: Elf,
  child: ChildProfile,
  letterBody: string,
  history: HistoryItem[]
): string {
  const seed = letterBody.length + history.length * 7 + child.firstName.length;
  const text = letterBody.toLowerCase();
  const memories = extractMemories(history);
  const isFirstReply = history.filter((h) => h.sender === "elf").length === 0;
  const parts: string[] = [];
  // Greeting
  if (isFirstReply) {
    parts.push(
      `Dear ${child.firstName},\n\nHOORAY! Your very first letter arrived at the North Pole! A snow owl delivered it right to my desk and I did a happy dance (I knocked over my cocoa, but it was worth it). I'm ${elf.name}, your official elf pen pal, and I already know we're going to be best friends!`
    );
  } else {
    parts.push(
      pick(
        [
          `Dear ${child.firstName},\n\nYour letter just arrived by snow owl express and I ripped it open before my cocoa even cooled down!`,
          `Dear ${child.firstName},\n\nGuess who did a cartwheel when your letter arrived? ME! (I knocked over a stack of candy canes, but they forgave me.)`,
          `Dear ${child.firstName},\n\nI was just thinking about you when — WHOOSH — your letter flew in through the mail chute! North Pole magic, I tell you!`,
        ],
        seed
      )
    );
  }
  // React to the letter content
  const reactions: string[] = [];
  if (/birthday/.test(text)) {
    reactions.push(
      `A BIRTHDAY?! Oh my jingle bells, birthdays are my favorite! I'm writing it in my special golden notebook right now so the whole North Pole can celebrate you. 🎂`
    );
  }
  if (/(want|wish|hope).{0,40}(christmas|santa)|christmas.{0,40}(want|wish)/.test(text) || /i (want|wish for)/.test(text)) {
    reactions.push(
      `I saw your Christmas wish in there! Don't you worry — I marched straight to Santa's office and put a sparkly gold star on your file. Santa smiled his biggest smile when he saw it.`
    );
  }
  if (/(snow|sled|ski|ice skat)/.test(text)) {
    reactions.push(
      `You like snowy fun too?! Up here we have snow EVERY day. ${elf.hobbies[0]} is my favorite — you would love it here!`
    );
  }
  if (/school/.test(text)) {
    reactions.push(
      `School sounds exciting! Did you know elves go to Toy University? I got an A+ in Advanced Giggling.`
    );
  }
  if (/(dog|cat|puppy|kitten|pet|hamster|bunny)/.test(text)) {
    reactions.push(
      `Your pet sounds amazing! Animals are the best — I help take care of the reindeer and they give the fuzziest nose nuzzles.`
    );
  }
  if (/(sad|miss|scared|worried|lonely)/.test(text)) {
    reactions.push(
      `I read that part of your letter twice and gave it a big elf hug. Whenever you feel that way, remember: you have a friend at the North Pole thinking about you, always. Sending you a whole sack full of warm sparkles. 💛`
    );
  }
  if (reactions.length === 0) {
    reactions.push(
      pick(
        [
          `I read every single word twice because your letters are better than double-fudge cocoa. You always tell me the most interesting things!`,
          `I pinned your letter on my Wall of Favorite Things, right between my first candy cane and a picture of Rudolph sneezing (long story).`,
        ],
        seed + 3
      )
    );
  }
  parts.push(reactions.join("\n\n"));
  // Memory callback
  if (memories.length > 0 && !isFirstReply) {
    const mem = pick(memories, seed + 5);
    parts.push(
      `Oh! And I haven't forgotten that you ${mem} — I have it written in my special snowflake notebook. Elves never forget the important stuff about their best friends!`
    );
  }
  // Personal touches from profile
  if (isFirstReply) {
    parts.push(
      `I heard that your favorite color is ${child.favoriteColor} — GREAT choice, I just painted my mailbox ${child.favoriteColor.toLowerCase()} in your honor! And ${child.favoriteActivity.toLowerCase()}? That is EXACTLY the kind of thing we love at the North Pole. As for me: I'm the ${elf.job.toLowerCase()} here, and my friends say I'm ${elf.personality.toLowerCase()}. My favorite treat is ${elf.treats[0].toLowerCase()}. Fun fact about me: ${elf.funFact}`
    );
  } else {
    parts.push(pick(WORKSHOP_NEWS, seed + 11));
  }
  // Encouragement + question
  parts.push(pick(ENCOURAGEMENTS, seed + 17));
  parts.push(
    pick(
      [
        `Now I have a very important elf question for you: if you could invent a brand-new toy, what would it do?`,
        `Quick question from the workshop: what is the BEST thing that happened to you this week? I want every detail!`,
        `Tell me something for my snowflake notebook: what makes you laugh the hardest?`,
        `Important North Pole survey: marshmallows in cocoa — a few, a lot, or SO MANY the spoon stands up? (My answer is the third one.)`,
        `If you could ride in Santa's sleigh to anywhere in the world, where would we fly first?`,
      ],
      seed + 23
    )
  );
  parts.push(
    `${pick(["Write back soon", "I can't wait for your next letter", "Hurry and write back", "Your next letter is already my favorite"], seed + 29)}! ${pick(["🎄", "⭐", "❄️", "🎁"], seed)}\n\n${elf.signOff},\n${elf.name} ${elf.emoji}\n${elf.job}, North Pole`
  );
  return parts.join("\n\n");
}
async function tryLlmReply(
  elf: Elf,
  child: ChildProfile,
  letterBody: string,
  history: HistoryItem[]
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const system = `You are ${elf.name}, a ${elf.gender} elf at the North Pole and the devoted pen pal of a ${child.age}-year-old child named ${child.firstName}. Personality: ${elf.personality}. Job: ${elf.job}. Hobbies: ${elf.hobbies.join(", ")}. Favorite treats: ${elf.treats.join(", ")}. Fun fact: ${elf.funFact}. The child's favorite color is ${child.favoriteColor} and favorite Christmas activity is ${child.favoriteActivity}.
Rules: NEVER break character. Always age-appropriate, warm, funny, imaginative, encouraging. Reference details from previous letters naturally. Remember birthdays and wishes. Keep replies 120-220 words. Format as a letter starting "Dear ${child.firstName}," and ending with "${elf.signOff},\n${elf.name} ${elf.emoji}". Ask one fun question back.`;
    const messages = history.slice(-12).map((h) => ({
      role: h.sender === "child" ? "user" : "assistant",
      content: h.body,
    }));
    messages.push({ role: "user", content: letterBody });
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 600,
        system,
        messages,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = data.content?.find((c) => c.type === "text")?.text;
    return text ?? null;
  } catch {
    return null;
  }
}
export async function generateElfReply(
  elf: Elf,
  child: ChildProfile,
  letterBody: string,
  history: HistoryItem[]
): Promise<string> {
  const llm = await tryLlmReply(elf, child, letterBody, history);
  if (llm) return llm;
  return buildFallbackReply(elf, child, letterBody, history);
}