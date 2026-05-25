import type { Passage } from "#/data/library";

// ─── Synonym expansion table ──────────────────────────────────────────────────
// Maps canonical tag words to related variants so user prompts like
// "cosmos" still match passages tagged "space".

const SYNONYMS: Record<string, string[]> = {
	space: [
		"cosmos",
		"universe",
		"galaxy",
		"celestial",
		"orbit",
		"astronomical",
		"nasa",
		"rocket",
		"planet",
		"alien",
		"astronaut",
	],
	science: [
		"physics",
		"biology",
		"chemistry",
		"experiment",
		"research",
		"discovery",
		"lab",
		"scientific",
		"scientist",
	],
	nature: [
		"animal",
		"plant",
		"environment",
		"wildlife",
		"ocean",
		"forest",
		"climate",
		"earth",
		"wild",
		"ecosystem",
		"natural",
	],
	code: [
		"programming",
		"software",
		"developer",
		"coding",
		"digital",
		"tech",
		"computer",
		"algorithm",
		"script",
	],
	technology: [
		"tech",
		"digital",
		"computer",
		"internet",
		"software",
		"hardware",
		"device",
		"app",
		"web",
		"online",
	],
	history: [
		"historical",
		"ancient",
		"past",
		"century",
		"era",
		"war",
		"empire",
		"civilization",
		"medieval",
		"vintage",
		"old",
	],
	travel: [
		"journey",
		"trip",
		"adventure",
		"explore",
		"destination",
		"abroad",
		"foreign",
		"visit",
		"wander",
		"tour",
		"vacation",
		"holiday",
	],
	food: [
		"cuisine",
		"recipe",
		"dish",
		"cooking",
		"meal",
		"eat",
		"restaurant",
		"chef",
		"flavor",
		"taste",
		"kitchen",
		"ingredient",
	],
	sport: [
		"sports",
		"athletic",
		"game",
		"competition",
		"player",
		"team",
		"championship",
		"race",
		"fitness",
		"exercise",
		"training",
	],
	art: [
		"artistic",
		"painting",
		"creative",
		"design",
		"culture",
		"theater",
		"film",
		"cinema",
		"gallery",
		"draw",
		"illustration",
	],
	music: [
		"song",
		"melody",
		"instrument",
		"band",
		"concert",
		"rhythm",
		"beat",
		"sound",
		"musical",
	],
	business: [
		"startup",
		"company",
		"entrepreneur",
		"market",
		"money",
		"investment",
		"brand",
		"product",
		"corporate",
		"commerce",
		"economy",
	],
	funny: [
		"humor",
		"comedy",
		"laugh",
		"joke",
		"amusing",
		"silly",
		"absurd",
		"ridiculous",
		"hilarious",
		"witty",
	],
	psychology: [
		"mind",
		"behavior",
		"mental",
		"brain",
		"emotion",
		"feeling",
		"human",
		"social",
		"cognitive",
		"thinking",
	],
};

// ─── Core matching function ───────────────────────────────────────────────────

/**
 * Matches a free-text user prompt to the most relevant passage in the library
 * using tag overlap + synonym expansion.
 *
 * Algorithm:
 * 1. Tokenise the prompt (lowercase, split on non-word chars)
 * 2. Expand each token through the synonym table
 * 3. Score each passage: count how many of its tags are in the expanded set
 * 4. Return the highest-scoring passage
 * 5. On a tie or zero score, return a random Humor passage (most universally accessible)
 */
export function matchPromptToPassage(
	prompt: string,
	passages: Passage[],
): Passage {
	// Step 1 — tokenise
	const tokens = prompt
		.toLowerCase()
		.split(/\W+/)
		.filter((t) => t.length > 2);

	// Step 2 — expand with synonyms
	const expanded = new Set(tokens);
	for (const token of tokens) {
		for (const [canonical, synonyms] of Object.entries(SYNONYMS)) {
			if (token === canonical || synonyms.includes(token)) {
				expanded.add(canonical);
				for (const s of synonyms) expanded.add(s);
			}
		}
	}

	// Step 3 — score passages
	let bestScore = -1;
	let bestPassage: Passage | null = null;

	for (const passage of passages) {
		const score = passage.tags.filter((tag) => expanded.has(tag)).length;
		if (score > bestScore) {
			bestScore = score;
			bestPassage = passage;
		}
	}

	// Step 4 — return best match if any tags matched
	if (bestScore > 0 && bestPassage) return bestPassage;

	// Step 5 — zero matches: random Humor passage (lightest, universally appealing)
	const humor = passages.filter((p) => p.category === "humor");
	return humor[Math.floor(Math.random() * humor.length)];
}
