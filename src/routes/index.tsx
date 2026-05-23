import { createFileRoute } from "@tanstack/react-router";
import { TypingPractice } from "#/components/TypingPractice";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return <TypingPractice />;
}
