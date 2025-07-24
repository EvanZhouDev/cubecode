import type { Metadata } from "next";
import "./globals.css";
import { Inter, Geo } from "next/font/google";
import Image from "next/image";
import Tab from "./components/Tab";
import * as Icon from "react-feather";

export const metadata: Metadata = {
	title: "CubeCode Demo",
	description: "Store data in Rubik's cubes.",
	icons: {
		icon: [
			{ url: "/favicon-light.ico", media: "(prefers-color-scheme: light)" },
			{ url: "/favicon-dark.ico", media: "(prefers-color-scheme: dark)" },
		],
	},
	openGraph: {
		images: "/og-image.png",
	},
};

const inter = Inter({
	weight: "variable",
	variable: "--font-inter",
	subsets: ["latin"],
});
const geo = Geo({
	weight: "400",
	variable: "--font-geo",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${geo.variable} ${inter.className}`}>
				<div className="flex flex-col w-screen min-h-screen justify-center items-center gap-5 overflow-auto overflow-x-hidden p-4">
					<Image
						src="/logo.svg"
						width={300}
						height={100}
						alt="CubeCode Logo"
						className="dark:invert"
						priority
					/>
					<div className="inter opacity-50 text-xs md:text-sm text-center">
						Encode & Decode Secret Messages with Rubik's Cubes
					</div>
					<div className="flex flex-row md:gap-10 gap-5">
						<Tab url="/" title="about" color="orange" />
						<Tab url="/decode" title="decode" color="green" />
						<Tab url="/encode" title="encode" color="red" />
						<Tab url="/solve" title="solve" color="blue" />
					</div>
					<div className="w-full max-w-4xl border-1 border-black/40 dark:border-white/40 rounded-2xl py-8">
						{children}
					</div>
					<div className="flex flex-col items-center gap-3 mt-4 opacity-50">
						<p className="text-center text-sm md:text-base">
							Lean more about CubeCode, and how it works.
						</p>
						<div className="flex flex-row gap-6 items-center">
							<a
								href="https://github.com/evanzhoudev/cubecode"
								className="flex flex-row items-center gap-1 text-sm md:text-base"
							>
								<Icon.GitHub className="w-4 h-4" />
								<span>GitHub</span>
							</a>
							<a
								href="https://youtube.com"
								className="flex flex-row items-center gap-1 text-sm md:text-base"
							>
								<Icon.Youtube className="w-4 h-4" />
								<span>YouTube (Coming Soon)</span>
							</a>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
