import Link from "next/link";
import * as Icon from "react-feather";
const Card = ({
	title,
	description,
	href,
}: {
	title: string;
	description: string;
	href: string;
}) => (
	<div className="border border-gray-400 rounded-lg p-3">
		<Link href={href}>
			<h3 className="font-bold text-2xl mb-2 geo flex items-center">
				{title}
				<Icon.Link className="w-4 h-4 ml-2" />
			</h3>
		</Link>
		<p className="text-gray-600 dark:text-gray-100">{description}</p>
	</div>
);

export default function Home() {
	return (
		<div className="flex flex-col items-center gap-4 px-5">
			<p className="max-w-2xl">
				CubeCode is a proof-of-concept method of storing secret messages in
				Rubik's cubes, by being able to convert every single Rubik's cube state
				into a integer in sequence between 0 and 43,252,003,274,489,856,000 - 1.
				This website allows you to:
			</p>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
				<Card
					href="/decode"
					title="decode"
					description="Figure out what secret message a Rubik's cube is currently storing."
				/>
				<Card
					href="/encode"
					title="encode"
					description="Get a custom algorithm which encodes a custom secret message."
				/>
				<Card
					href="/solve"
					title="solve"
					description="An animated Rubik's Cube solver to help you solve your cube."
				/>
			</div>
			<p className="max-w-2xl">
				CubeCode is easy to use with interactive visualizations and more so you
				can encode and decode messages{" "}
				<b>even if you don't know how to solve a Rubik's cube</b>
			</p>
			<h1 className="text-6xl geo">tips and tricks</h1>
			<div className="w-full space-y-2 max-w-2xl">
				<div className=" rounded-lg p-2">
					<div className="flex items-start">
						<Icon.Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
						<p>
							All algorithms should be executed with{" "}
							<span className="font-semibold text-blue-700 dark:text-blue-300">
								the white center on top, and the green center in front
							</span>
						</p>
					</div>
				</div>

				<div className="rounded-lg p-2">
					<div className="flex items-start">
						<Icon.Code className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
						<p>
							CubeCode, Binary, and Text (ASCII) all{" "}
							<span className="font-semibold text-green-700 dark:text-green-300">
								encode the same data
							</span>{" "}
							onto your Rubik's cube. They're just different ways to interpret
							the data.
						</p>
					</div>
				</div>

				<div className="rounded-lg p-2">
					<div className="flex items-start">
						<Icon.Package className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
						<p>
							CubeCode is{" "}
							<span className="font-semibold text-purple-700 dark:text-purple-300">
								available as a JS library
							</span>{" "}
							so you can use it's abilities to turn a cubestate into a number
							for any purpose!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
