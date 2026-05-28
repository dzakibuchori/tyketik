import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: About });

const PERSONAS = [
	{ emoji: "👨‍💻", label: "Developer" },
	{ emoji: "🏥", label: "Doctor" },
	{ emoji: "📊", label: "Data Entry" },
	{ emoji: "✍️", label: "Writer" },
	{ emoji: "⚖️", label: "Paralegal" },
	{ emoji: "🎧", label: "Support Agent" },
	{ emoji: "📰", label: "Journalist" },
	{ emoji: "🎓", label: "Student" },
] as const;

const COMING_SOON = [
	{
		emoji: "📖",
		title: "Story mode",
		desc: "Practice inside a real narrative. Your keystrokes move the plot forward. Less treadmill, more page-turner.",
	},
	{
		emoji: "👁️",
		title: "Attention detection",
		desc: "Optional face tracking that notices when you drift. Like a study buddy who catches you scrolling Twitter.",
	},
] as const;

function About() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-16">
			{/* Hero */}
			<div className="mb-12 text-center">
				<h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
					Your words. <span className="text-gray-400">Your speed.</span>
				</h1>
				<p className="text-lg leading-relaxed text-gray-500">
					Typing practice built around what you actually type —
					<br className="hidden sm:block" />
					not random word salad.
				</p>
			</div>

			{/* The problem */}
			<div className="mb-12 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5">
				<p className="leading-relaxed text-gray-700">
					Most typing apps hand you a random paragraph and call it practice.
					That works. But if you're a doctor charting patient notes, a developer
					writing TypeScript, or a journalist racing a deadline —{" "}
					<strong className="text-gray-900">you don't want lorem ipsum.</strong>{" "}
					You want to practice what <em>you</em> actually type.
				</p>
			</div>

			{/* Who it's for */}
			<div className="mb-12">
				<p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400">
					Built for
				</p>
				<div className="flex flex-wrap gap-2">
					{PERSONAS.map(({ emoji, label }) => (
						<span
							key={label}
							className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
						>
							<span>{emoji}</span>
							{label}
						</span>
					))}
					<span className="flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-400">
						+ everyone else
					</span>
				</div>
			</div>

			{/* Coming soon */}
			<div className="mb-12">
				<p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400">
					Coming soon
				</p>
				<div className="grid gap-3 sm:grid-cols-2">
					{COMING_SOON.map(({ emoji, title, desc }) => (
						<div
							key={title}
							className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
						>
							<div className="mb-2 text-2xl">{emoji}</div>
							<h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
							<p className="text-sm leading-relaxed text-gray-500">{desc}</p>
						</div>
					))}
				</div>
			</div>

			{/* CTA */}
			<div className="text-center">
				<p className="mb-4 text-gray-500">Ready to try it?</p>
				<Link
					to="/"
					className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
				>
					Start practicing →
				</Link>
			</div>
		</div>
	);
}
