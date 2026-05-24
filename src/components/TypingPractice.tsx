import { RotateCcw, Wand2 } from "lucide-react";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

const DURATION_SECS = 60;

function formatTime(secs: number): string {
	const m = Math.floor(secs / 60);
	const s = secs % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

interface TypingPracticeProps {
	story: string;
	prompt: string;
	onNewPrompt: () => void;
}

export function TypingPractice({
	story,
	prompt,
	onNewPrompt,
}: TypingPracticeProps) {
	const [typedText, setTypedText] = useState("");
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [now, setNow] = useState(() => performance.now());
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	// Keystroke counters — mutable refs so they never cause stale-closure issues
	// in handleInput. Accuracy is derived from these on every render.
	const keystrokesRef = useRef({ correct: 0, incorrect: 0 });
	// Tracks the last committed typedText so handleInput can diff the delta
	// without needing typedText in its dependency array.
	const prevTypedRef = useRef("");

	// Derived time values — computed early so isComplete can use them
	const elapsedMs = startTime ? (endTime ?? now) - startTime : 0;
	const elapsedSecs = Math.floor(elapsedMs / 1000);
	const remainingSecs = Math.max(0, DURATION_SECS - elapsedSecs);
	const timeExpired = startTime !== null && elapsedSecs >= DURATION_SECS;
	const finishedPassage = typedText.length >= story.length;
	const isComplete = finishedPassage || timeExpired;

	// Tick every second while the test is running; auto-end after DURATION_SECS
	useEffect(() => {
		if (!startTime || endTime) return;
		const interval = setInterval(() => {
			const currentNow = performance.now();
			setNow(currentNow);
			if (currentNow - startTime >= DURATION_SECS * 1000) {
				setEndTime(currentNow);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [startTime, endTime]);

	const handleInput = useCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) => {
			if (isComplete) return;
			const value = e.target.value.slice(0, story.length);
			const prev = prevTypedRef.current;

			if (!startTime) {
				const ts = performance.now();
				setStartTime(ts);
				setNow(ts);
			}

			// Only count added characters — backspaces are invisible to accuracy,
			// exactly as MonkeyType does it.
			if (value.length > prev.length) {
				const added = value.slice(prev.length);
				for (let j = 0; j < added.length; j++) {
					if (added[j] === story[prev.length + j]) {
						keystrokesRef.current.correct++;
					} else {
						keystrokesRef.current.incorrect++;
					}
				}
			}

			prevTypedRef.current = value;
			setTypedText(value);

			if (value.length >= story.length) {
				const ts = performance.now();
				setEndTime(ts);
				setNow(ts);
			}
		},
		[startTime, isComplete, story],
	);

	const restart = useCallback(() => {
		setTypedText("");
		setStartTime(null);
		setEndTime(null);
		setNow(performance.now());
		keystrokesRef.current = { correct: 0, incorrect: 0 };
		prevTypedRef.current = "";
		setTimeout(() => textareaRef.current?.focus(), 0);
	}, []);

	// Derived stats
	const elapsedMins = elapsedMs / 60000;
	const correctChars = [...typedText].filter((ch, i) => ch === story[i]).length;
	const wpm =
		startTime && elapsedMins > 0.008
			? Math.round(correctChars / 5 / elapsedMins)
			: 0;
	// Time progress: fills left-to-right as the 60 s window elapses
	const timeProgress = startTime ? (elapsedSecs / DURATION_SECS) * 100 : 0;
	// Accuracy — identical formula to MonkeyType: correct / (correct + incorrect)
	const { correct: correctKs, incorrect: incorrectKs } = keystrokesRef.current;
	const totalKs = correctKs + incorrectKs;
	const accuracy =
		totalKs > 0 ? Math.round((correctKs / totalKs) * 1000) / 10 : 100;

	return (
		<section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-16">
			<div className="w-full max-w-3xl">
				{/* Heading */}
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
						Take It for a Spin
					</h1>
					<p className="text-gray-500">
						Type the story below — you have 1 minute from your first keystroke.
					</p>
				</div>

				{/* Prompt badge */}
				<div className="mb-5 flex justify-center">
					<span className="inline-flex max-w-md items-center gap-1.5 truncate rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
						<Wand2 size={11} className="shrink-0 text-gray-400" />
						<span className="truncate">
							Topic: <span className="font-medium text-gray-700">{prompt}</span>
						</span>
					</span>
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
								{accuracy.toFixed(1)}%
							</div>
							<div className="text-xs uppercase tracking-wider text-gray-400">
								Acc
							</div>
						</div>
						<div className="text-center">
							<div
								className={[
									"text-2xl font-bold tabular-nums",
									remainingSecs <= 10 && startTime && !isComplete
										? "text-red-500"
										: "text-gray-800",
								].join(" ")}
							>
								{formatTime(remainingSecs)}
							</div>
							<div className="text-xs uppercase tracking-wider text-gray-400">
								Left
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={onNewPrompt}
							className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
						>
							<Wand2 size={14} />
							New prompt
						</button>
						<button
							type="button"
							onClick={restart}
							className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
						>
							<RotateCcw size={14} />
							Restart
						</button>
					</div>
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
						{story.split("").map((char, i) => {
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
							<p className="mb-3 text-lg text-gray-500">
								{timeExpired && !finishedPassage
									? "time's up!"
									: "words per minute"}
							</p>
							<div className="mb-6 flex gap-6 text-center">
								<div>
									<p className="text-2xl font-semibold text-gray-800">
										{accuracy.toFixed(1)}%
									</p>
									<p className="text-xs uppercase tracking-wider text-gray-400">
										Accuracy
									</p>
								</div>
								<div>
									<p className="text-2xl font-semibold text-gray-800">
										{formatTime(elapsedSecs)}
									</p>
									<p className="text-xs uppercase tracking-wider text-gray-400">
										Time
									</p>
								</div>
							</div>
							<div className="flex gap-3">
								<button
									type="button"
									onClick={onNewPrompt}
									className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
								>
									<Wand2 size={14} />
									New prompt
								</button>
								<button
									type="button"
									onClick={restart}
									className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
								>
									<RotateCcw size={14} />
									Try Again
								</button>
							</div>
						</div>
					)}
				</label>

				{/* Progress bar — tracks time elapsed against the 1-minute window */}
				<div className="mt-4 h-1 overflow-hidden rounded-full bg-gray-200">
					<div
						className={[
							"h-full rounded-full transition-all duration-150",
							isComplete ? "bg-green-500" : "bg-gray-800",
						].join(" ")}
						style={{ width: `${isComplete ? 100 : timeProgress}%` }}
					/>
				</div>
			</div>
		</section>
	);
}
