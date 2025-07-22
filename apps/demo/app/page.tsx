export default function Home() {
	return (
		<div className="flex flex-col items-center gap-4 px-5">
			<p>
				CubeCode is a proof-of-concept method of storing secret messages in
				Rubik's cubes, by being able to convert every single Rubik's cube state
				into a integer in sequence between 0 and 43,252,003,274,489,856,000 - 1.
				This website allows you to:
			</p>
			<ul className="list-disc list-inside w-full">
				<li>
					<b>Encode</b> secret messages into a Rubik's cube state
				</li>
				<li>
					<b>Decode</b> secret messages given a Rubik's cube
				</li>
				<li>
					<b>Solve</b> Rubik's cubes
				</li>
			</ul>
			<p>
				This website is designed to be user-friendly for everyone, even if you
				don't know how to solve a Rubik's cube or how to use Rubik's cube
				notation, with interactive visualizations and other tools to help you.
			</p>
			<h1 className="text-4xl">Tips and Tricks</h1>
			<ul className="list-disc list-inside w-full">
				<li>
					All algorithms should be executed with{" "}
					<b>the white center on top, and the green center in front</b>
				</li>
				<li>
					CubeCode, Binary, and Text (ASCII) all <b>encode the same data</b>{" "}
					onto your Rubik's cube. They're just different ways to interpret the
					data.
				</li>
			</ul>
		</div>
	);
}
