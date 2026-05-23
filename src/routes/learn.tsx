import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learn")({ component: Learn });

function Learn() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-16">
			<h1 className="text-3xl font-bold text-gray-900">Learn</h1>
			<p className="mt-4 text-gray-500">Coming soon.</p>
		</div>
	);
}
