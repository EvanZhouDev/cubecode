"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Tab({
	title,
	url,
	color,
}: {
	title: string;
	url: string;
	color: string;
}) {
	const pathname = usePathname();
	const isActive = pathname === url;

	return (
		<Link
			href={url}
			className={`flex flex-col items-center justify-center flex-1`}
		>
			<p
				className={`geo text-3xl sm:text-5xl ${isActive ? `opacity-100` : "opacity-40 text-black dark:text-white"}`}
				style={isActive ? { color } : {}}
			>
				{title}
			</p>
		</Link>
	);
}
