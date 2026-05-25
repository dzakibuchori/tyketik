import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
	{ label: "Home", to: "/" as const },
	{ label: "Library", to: "/library" as const },
	{ label: "About", to: "/about" as const },
	{ label: "Learn", to: "/learn" as const },
	{ label: "Test", to: "/test" as const },
] as const;

export function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex shrink-0 items-center">
						<img src="/logo.svg" alt="Tyketik" className="h-9 w-auto" />
					</Link>

					{/* Desktop nav links */}
					<div className="hidden items-center gap-8 md:flex">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								activeOptions={link.to === "/" ? { exact: true } : undefined}
								className="text-sm font-medium transition-colors"
								activeProps={{ className: "text-gray-900 font-semibold" }}
								inactiveProps={{
									className: "text-gray-500 hover:text-gray-900",
								}}
							>
								{link.label}
							</Link>
						))}
					</div>

					{/* Mobile hamburger */}
					<button
						type="button"
						aria-label="Toggle navigation menu"
						className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
						onClick={() => setOpen((prev) => !prev)}
					>
						{open ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>

				{/* Mobile dropdown */}
				{open && (
					<div className="border-t border-gray-100 py-3 md:hidden">
						<div className="flex flex-col gap-1">
							{NAV_LINKS.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									activeOptions={link.to === "/" ? { exact: true } : undefined}
									className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
									activeProps={{
										className: "bg-gray-100 text-gray-900 font-semibold",
									}}
									inactiveProps={{
										className:
											"text-gray-600 hover:bg-gray-50 hover:text-gray-900",
									}}
									onClick={() => setOpen(false)}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
