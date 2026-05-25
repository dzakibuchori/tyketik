import { createFileRoute } from "@tanstack/react-router";
import { LibraryBrowser } from "#/components/LibraryBrowser";

export const Route = createFileRoute("/library")({ component: Library });

function Library() {
	return <LibraryBrowser />;
}
