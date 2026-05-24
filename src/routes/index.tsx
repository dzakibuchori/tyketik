import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PromptInput } from "#/components/PromptInput";
import { TypingPractice } from "#/components/TypingPractice";

// Hardcoded passage — swap this out when real AI is wired up
const FALLBACK_STORY =
	"A cat named Biscuit decided to become the world's greatest DJ. He spent three weeks learning to scratch records with his paws, only to discover he was shredding vinyl. His owner started selling the shredded pieces as abstract art on eBay for forty dollars each. Biscuit, furious about not getting royalties, launched his revenge: sitting directly on the keyboard whenever his owner worked. The laptop began autocorrecting everything to meow. The owner accidentally published a book titled Meow: A Business Strategy. It sold twelve thousand copies. Biscuit got nothing. He remains bitter to this day.";

export const Route = createFileRoute("/")({ component: Home });

type View = "prompt" | "typing";

function Home() {
	const [view, setView] = useState<View>("prompt");
	const [visible, setVisible] = useState(true); // drives opacity for fade
	const [story, setStory] = useState(FALLBACK_STORY);
	const [activePrompt, setActivePrompt] = useState("");
	// Increments on every new session so TypingPractice remounts and resets cleanly
	const [sessionKey, setSessionKey] = useState(0);

	// Fade-out → swap state → fade-in
	function transitionTo(
		nextView: View,
		nextStory?: string,
		nextPrompt?: string,
	) {
		setVisible(false);
		setTimeout(() => {
			if (nextStory) setStory(nextStory);
			if (nextPrompt !== undefined) setActivePrompt(nextPrompt);
			if (nextView === "typing") setSessionKey((k) => k + 1);
			setView(nextView);
			setVisible(true);
		}, 250); // matches the CSS transition duration below
	}

	function handlePromptSubmit(prompt: string) {
		// TODO: replace FALLBACK_STORY with actual AI-generated text
		transitionTo("typing", FALLBACK_STORY, prompt);
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
				/>
			)}
		</div>
	);
}
