import { Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

const EXAMPLE_CHIPS = [
	"A funny short story",
	"A tech blog intro",
	"A recipe for disaster",
	"A space explorer's log",
	"A detective's first clue",
];

interface PromptInputProps {
	onSubmit: (prompt: string) => void;
}

export function PromptInput({ onSubmit }: PromptInputProps) {
	const [value, setValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus the input on mount without triggering the a11y autoFocus rule
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

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

	function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") handleSubmit();
	}

	function fillChip(chip: string) {
		if (isLoading) return;
		setValue(chip);
		inputRef.current?.focus();
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
					<div className="flex items-center gap-2">
						<input
							ref={inputRef}
							type="text"
							value={value}
							onChange={(e) => setValue(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={isLoading}
							placeholder="A story about a cat who became a DJ…"
							className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
						/>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!canSubmit}
							className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
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
						<span>Press Enter to generate</span>
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
								key={chip}
								type="button"
								onClick={() => fillChip(chip)}
								disabled={isLoading}
								className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
							>
								{chip}
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
