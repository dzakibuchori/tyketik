import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import {
	CATEGORIES,
	type Category,
	getCategoryMeta,
	PASSAGES,
} from "#/data/library";

export function LibraryBrowser() {
	const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
	const navigate = useNavigate();

	const filtered =
		activeCategory === "all"
			? PASSAGES
			: PASSAGES.filter((p) => p.category === activeCategory);

	function handleSelect(passageId: string) {
		navigate({ to: "/", search: { passageId } });
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="mb-10 text-center">
				<h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
					The Library
				</h1>
				<p className="mx-auto max-w-xl text-base text-gray-500">
					100 hand-picked passages across 10 topics — always ready to type.
				</p>
			</div>

			{/* Category filter pills */}
			<div className="mb-8 flex flex-wrap justify-center gap-2">
				<button
					type="button"
					onClick={() => setActiveCategory("all")}
					className={[
						"rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
						activeCategory === "all"
							? "bg-gray-900 text-white"
							: "border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900",
					].join(" ")}
				>
					All ({PASSAGES.length})
				</button>
				{CATEGORIES.map((cat) => {
					const count = PASSAGES.filter((p) => p.category === cat.id).length;
					const isActive = activeCategory === cat.id;
					return (
						<button
							key={cat.id}
							type="button"
							onClick={() => setActiveCategory(cat.id)}
							className={[
								"rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
								isActive
									? "bg-gray-900 text-white"
									: "border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900",
							].join(" ")}
						>
							{cat.label} ({count})
						</button>
					);
				})}
			</div>

			{/* Passage card grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filtered.map((passage) => {
					const meta = getCategoryMeta(passage.category);
					const preview =
						passage.text.length > 110
							? `${passage.text.slice(0, 110)}…`
							: passage.text;

					return (
						<div
							key={passage.id}
							className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
						>
							{/* Category badge */}
							<span
								className={`mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.color}`}
							>
								{meta.label}
							</span>

							{/* Title */}
							<h2 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
								{passage.title}
							</h2>

							{/* Preview */}
							<p className="mb-4 flex-1 text-xs leading-relaxed text-gray-500">
								{preview}
							</p>

							{/* CTA */}
							<button
								type="button"
								onClick={() => handleSelect(passage.id)}
								className="flex items-center gap-1.5 self-end rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
							>
								Type this
								<ArrowRight size={12} />
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
