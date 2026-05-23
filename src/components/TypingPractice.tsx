import { RotateCcw } from "lucide-react";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

const STORY =
	"A cat named Biscuit decided to become the world's greatest DJ. He spent three weeks learning to scratch records with his paws, only to discover he was shredding vinyl. His owner started selling the shredded pieces as abstract art on eBay for forty dollars each. Biscuit, furious about not getting royalties, launched his revenge: sitting directly on the keyboard whenever his owner worked. The laptop began autocorrecting everything to meow. The owner accidentally published a book titled Meow: A Business Strategy. It sold twelve thousand copies. Biscuit got nothing. He remains bitter to this day.";

function formatTime(secs: number): string {
	const m = Math.floor(secs / 60);
	const s = secs % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TypingPractice() {
	const [typedText, setTypedText] = useState("");
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [now, setNow] = useState(() => performance.now());
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const isComplete = typedText.length >= STORY.length;

	// Tick every second while the test is running
	useEffect(() => {
		if (!startTime || endTime) return;
		const interval = setInterval(() => setNow(performance.now()), 1000);
		return () => clearInterval(interval);
	}, [startTime, endTime]);

	const handleInput = useCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) => {
			if (isComplete) return;
			const value = e.target.value.slice(0, STORY.length);

			if (!startTime) {
				const ts = performance.now();
				setStartTime(ts);
				setNow(ts);
			}

			setTypedText(value);

			if (value.length >= STORY.length) {
				const ts = performance.now();
				setEndTime(ts);
				setNow(ts);
			}
		},
		[startTime, isComplete],
	);

	const restart = useCallback(() => {
		setTypedText("");
		setStartTime(null);
		setEndTime(null);
		setNow(performance.now());
		setTimeout(() => textareaRef.current?.focus(), 0);
	}, []);

	// Derived stats
	const elapsedMs = startTime ? (endTime ?? now) - startTime : 0;
	const elapsedSecs = Math.floor(elapsedMs / 1000);
	const elapsedMins = elapsedMs / 60000;
	const correctChars = [...typedText].filter((ch, i) => ch === STORY[i]).length;
	const wpm =
		startTime && elapsedMins > 0.008
			? Math.round(correctChars / 5 / elapsedMins)
			: 0;
	const progress = (typedText.length / STORY.length) * 100;

	return (
		<section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-16">
			<div className="w-full max-w-3xl">
				{/* Heading */}
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
						Take It for a Spin
					</h1>
					<p className="text-gray-500">
						Type the story below — the clock starts when you do.
					</p>
				</div>

				{/* Stats bar */}
				<div className="mb-4 flex items-center justify-between px-1">
					<div className="flex gap-6">
						<div className="text-center">
							<div className="text-2xl font-bold tabular-nums text-gray-800">
								{wpm}
							</div>
							<div className="text-xs uppercase tracking-wider text-gray-400">
								WPM
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold tabular-nums text-gray-800">
								{formatTime(elapsedSecs)}
							</div>
							<div className="text-xs uppercase tracking-wider text-gray-400">
								Time
							</div>
						</div>
					</div>

					<button
						type="button"
						onClick={restart}
						className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
					>
						<RotateCcw size={14} />
						Restart
					</button>
				</div>

				{/* Typing stage */}
				<label
					htmlFor="typing-input"
					className={[
						"relative block cursor-text rounded-2xl border-2 bg-white p-8 transition-colors",
						isFocused && !isComplete ? "border-gray-800" : "",
						isComplete ? "border-green-500" : "",
						!isFocused && !isComplete
							? "border-gray-200 hover:border-gray-300"
							: "",
					]
						.filter(Boolean)
						.join(" ")}
				>
					{/*
					 * Transparent full-area textarea — covers the entire stage so any
					 * click lands directly on the input and triggers native focus.
					 * Overlays sit on top via z-10; textarea stays behind at default z.
					 */}
					<textarea
						id="typing-input"
						ref={textareaRef}
						value={typedText}
						onChange={handleInput}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						className="absolute inset-0 cursor-text resize-none rounded-2xl bg-transparent opacity-0"
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						spellCheck={false}
						aria-label="Typing input"
					/>

					{/* Story text rendered character by character */}
					<p className="relative select-none font-mono text-xl leading-relaxed">
						{STORY.split("").map((char, i) => {
							const isTyped = i < typedText.length;
							const isCorrect = typedText[i] === char;
							const isCursor = i === typedText.length && !isComplete;

							return (
								<span
									key={i}
									className={[
										isTyped && isCorrect ? "text-green-600" : "",
										isTyped && !isCorrect
											? "rounded bg-red-100 text-red-600"
											: "",
										!isTyped ? "text-gray-400" : "",
										isCursor ? "tyke-cursor" : "",
									]
										.filter(Boolean)
										.join(" ")}
								>
									{char}
								</span>
							);
						})}
					</p>

					{/* Click-to-start overlay — z-10 sits above the transparent textarea.
				    Clicks bubble to the <label>, which natively focuses #typing-input. */}
					{!isFocused && !startTime && (
						<div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
							<p className="text-sm font-medium text-gray-500">
								Click here to start typing
							</p>
						</div>
					)}

					{/* Completion overlay — z-10 sits above the transparent textarea */}
					{isComplete && (
						<div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm">
							<p className="mb-1 text-5xl font-bold text-gray-900">{wpm}</p>
							<p className="mb-1 text-lg text-gray-500">words per minute</p>
							<p className="mb-6 text-sm text-gray-400">
								Finished in {formatTime(elapsedSecs)}
							</p>
							<button
								type="button"
								onClick={restart}
								className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
							>
								<RotateCcw size={14} />
								Try Again
							</button>
						</div>
					)}
				</label>

				{/* Progress bar */}
				<div className="mt-4 h-1 overflow-hidden rounded-full bg-gray-200">
					<div
						className={[
							"h-full rounded-full transition-all duration-150",
							isComplete ? "bg-green-500" : "bg-gray-800",
						].join(" ")}
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		</section>
	);
}
