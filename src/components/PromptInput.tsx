import { Link } from "@tanstack/react-router";
import { Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

const EXAMPLE_CHIPS = [
	{
		label: "Why we do dumb things",
		prompt:
			"Something funny or fascinating about human psychology, why we make bad decisions, or how our brain fools us",
	},
	{
		label: "When nature surprises you",
		prompt:
			"A surprising or mind-blowing story about animals, nature, ecosystems, or the natural world",
	},
	{
		label: "Getting gloriously lost",
		prompt:
			"A vivid travel story about exploring a city, remote place, or unforgettable destination",
	},
	{
		label: "A meal with a backstory",
		prompt:
			"A fascinating story about food, cooking, or how a beloved dish or culinary tradition came to be",
	},
	{
		label: "Nobody saw that coming",
		prompt:
			"A surprising twist in history, sports, or business — an underdog moment or unexpected outcome nobody predicted",
	},
];

interface PromptInputProps {
	onSubmit: (prompt: string) => void;
}

export function PromptInput({ onSubmit }: PromptInputProps) {
	const [value, setValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Focus on mount without triggering the a11y autoFocus rule
	useEffect(() => {
		textareaRef.current?.focus();
	}, []);

	// Auto-grow: re-measure the DOM whenever the text changes.
	// `value` is the trigger — after React flushes the new text to the DOM,
	// el.scrollHeight reflects the actual content height. Biome can't infer
	// this DOM→state relationship, so we suppress the false-positive below.
	// biome-ignore lint/correctness/useExhaustiveDependencies: value triggers DOM resize; not read in callback body
	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		// Reset to "auto" first so the element can shrink when text is deleted
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, [value]);

	const trimmed = value.trim();
	const canSubmit = trimmed.length > 0 && !isLoading;

	function handleSubmit() {
		if (!canSubmit) return;
		setIsLoading(true);
		// Mock 1.5s "AI generation" delay — swap in real AI call later
		setTimeout(() => {
			onSubmit(trimmed);
		}, 1500);
	}

	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		// Enter alone → submit; Shift+Enter → allow natural newline
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	function fillChip(prompt: string) {
		if (isLoading) return;
		setValue(prompt);
		textareaRef.current?.focus();
	}

	return (
		<section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-16">
			<div className="w-full max-w-2xl">
				{/* Icon + heading */}
				<div className="mb-10 text-center">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white">
						<Sparkles size={22} />
					</div>
					<h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
						Type anything.
					</h1>
					<p className="text-base text-gray-500">
						Describe what you'd like to type — we'll generate it for you.
					</p>
				</div>

				{/* Input card */}
				<div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
					{/* items-end keeps the send button pinned to the bottom as the textarea grows */}
					<div className="flex items-end gap-2">
						<textarea
							ref={textareaRef}
							rows={1}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={isLoading}
							placeholder="A story about a cat who became a DJ…"
							className="min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 text-base leading-normal text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
							style={{ maxHeight: "8rem" }}
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
						/>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!canSubmit}
							className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
							aria-label="Generate passage"
						>
							{isLoading ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<SendHorizonal size={16} />
							)}
						</button>
					</div>
				</div>

				{/* Status text under input */}
				<div className="mt-3 h-5 text-center text-sm text-gray-400">
					{isLoading ? (
						<span className="animate-pulse">Generating your passage…</span>
					) : (
						<span>
							Press{" "}
							<kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-500">
								Enter
							</kbd>{" "}
							to generate &nbsp;·&nbsp;
							<kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-500">
								Shift+Enter
							</kbd>{" "}
							for a new line
						</span>
					)}
				</div>

				{/* Example chips */}
				<div className="mt-8">
					<p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
						Try one of these
					</p>
					<div className="flex flex-wrap justify-center gap-2">
						{EXAMPLE_CHIPS.map((chip) => (
							<button
								key={chip.label}
								type="button"
								onClick={() => fillChip(chip.prompt)}
								disabled={isLoading}
								className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
							>
								{chip.label}
							</button>
						))}
					</div>
				</div>

				{/* Library secondary CTA */}
				<div className="mt-6 text-center">
					<Link
						to="/library"
						className="text-xs text-gray-400 transition-colors hover:text-gray-600"
					>
						or browse our library of 100 curated passages →
					</Link>
				</div>
			</div>
		</section>
	);
}
