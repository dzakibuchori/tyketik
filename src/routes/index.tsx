import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PromptInput } from "#/components/PromptInput";
import { TypingPractice } from "#/components/TypingPractice";
import { getPassageById, PASSAGES } from "#/data/library";
import { matchPromptToPassage } from "#/utils/matchPassage";

export const Route = createFileRoute("/")({
	validateSearch: (
		search: Record<string, unknown>,
	): { passageId?: string } => ({
		...(typeof search.passageId === "string"
			? { passageId: search.passageId }
			: {}),
	}),
	component: Home,
});

type View = "prompt" | "typing";

function Home() {
	const { passageId } = Route.useSearch();

	const [view, setView] = useState<View>("prompt");
	const [visible, setVisible] = useState(true);
	const [story, setStory] = useState("");
	const [activePrompt, setActivePrompt] = useState("");
	const [fallbackPassageTitle, setFallbackPassageTitle] = useState<
		string | undefined
	>(undefined);
	// Increments on every new session so TypingPractice remounts and resets cleanly
	const [sessionKey, setSessionKey] = useState(0);

	// If a passageId arrives from the library, jump straight to typing
	useEffect(() => {
		if (!passageId) return;
		const passage = getPassageById(passageId);
		if (!passage) return;
		setStory(passage.text);
		setActivePrompt(passage.title);
		setFallbackPassageTitle(undefined);
		setSessionKey((k) => k + 1);
		setView("typing");
	}, [passageId]);

	// Fade-out → swap state → fade-in
	function transitionTo(
		nextView: View,
		nextStory?: string,
		nextPrompt?: string,
		nextFallback?: string,
	) {
		setVisible(false);
		setTimeout(() => {
			if (nextStory) setStory(nextStory);
			if (nextPrompt !== undefined) setActivePrompt(nextPrompt);
			setFallbackPassageTitle(nextFallback);
			if (nextView === "typing") setSessionKey((k) => k + 1);
			setView(nextView);
			setVisible(true);
		}, 250);
	}

	function handlePromptSubmit(prompt: string) {
		// TODO: call real AI here and pass the generated text as nextStory.
		// On AI failure, fall through to matchPromptToPassage below.
		const matched = matchPromptToPassage(prompt, PASSAGES);
		// Remove fallback banner when AI is wired — it means the text was generated
		transitionTo("typing", matched.text, prompt, matched.title);
	}

	function handleNewPrompt() {
		transitionTo("prompt");
	}

	return (
		<div
			className="transition-opacity duration-[250ms]"
			style={{ opacity: visible ? 1 : 0 }}
		>
			{view === "prompt" ? (
				<PromptInput onSubmit={handlePromptSubmit} />
			) : (
				<TypingPractice
					key={sessionKey}
					story={story}
					prompt={activePrompt}
					onNewPrompt={handleNewPrompt}
					fallbackPassageTitle={fallbackPassageTitle}
				/>
			)}
		</div>
	);
}
