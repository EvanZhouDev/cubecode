"use client";

import { useEffect, useState } from "react";
import CubePicker from "../components/CubePicker";
import Cube from "cubejs";
import { decodeCube, encodeCube, generateCornerCache } from "@repo/cubecode";
import Codeblock from "../components/Codeblock";

export default function SolvePage() {
	// Initialize with solved cube string - each face has its own color in center, empty elsewhere
	// CubeJS expects faces in order: U R F D L B
	const [cubeString, setCubeString] = useState<string>(() => {
		let state = "";
		// U face (9 squares) - center is always U (White)
		for (let i = 0; i < 9; i++) state += i === 4 ? "U" : "E";
		// R face (9 squares) - center is always R (Red)
		for (let i = 0; i < 9; i++) state += i === 4 ? "R" : "E";
		// F face (9 squares) - center is always F (Green)
		for (let i = 0; i < 9; i++) state += i === 4 ? "F" : "E";
		// D face (9 squares) - center is always D (Yellow)
		for (let i = 0; i < 9; i++) state += i === 4 ? "D" : "E";
		// L face (9 squares) - center is always L (Orange)
		for (let i = 0; i < 9; i++) state += i === 4 ? "L" : "E";
		// B face (9 squares) - center is always B (Blue)
		for (let i = 0; i < 9; i++) state += i === 4 ? "B" : "E";
		return state;
	});

	const [decoded, setDecoded] = useState<bigint>(-1n);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Convert algorithm to alg.cubing.net URL format
	const getAlgCubingUrl = (algorithm: string): string => {
		// Convert prime moves (') to minus (-)
		const formattedAlg = algorithm.replace(/'/g, "-");
		// Encode for URL
		const encodedAlg = encodeURIComponent(formattedAlg);
		return `https://alg.cubing.net/?alg=${encodedAlg}&view=playback`;
	};

	// Clear solution when cube changes
	useEffect(() => {
		setDecoded(-1n);
	}, [cubeString]);

	const handleCubeChange = (newCubeString: string) => {
		setCubeString(newCubeString);
		// Solution will be cleared by the useEffect above
	};

	const getAlgorithm = () => {
		setIsLoading(true);
		try {
			const cube = Cube.fromString(cubeString);
			// Note that in the API, "encode" means to turn a cube into a single number
			// However, in the context of storing a secret message on a Rubik's cube, turning a cube into a number (and/or ASCII) actually means to "decode" it.
			setDecoded(
				encodeCube({
					...cube.toJSON(),
					cornerCache: generateCornerCache(),
				})
			);
		} catch (error) {
			console.error("Error solving cube:", error);
			// setDecoded(
			// 	"Error: Unable to solve cube. Please check the cube configuration."
			// );
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center gap-4 px-5">
			<div className="text-black dark:text-white text-center text-xl max-w-2xl">
				See what secret message a Rubik's cube contains.
			</div>
			<div className="text-gray-500 dark:text-gray-100 text-center max-w-2xl">
				Enter the colors <b>exactly as they are on your Rubik's cube</b> below
				to get the secret message on your cube. Turn your cube to face each side
				you are coloring in. The direction that is facing up in the diagram
				should face up in real life.
			</div>

			<CubePicker
				cubeString={cubeString}
				onCubeChange={handleCubeChange}
				storageKey="solveCube"
			/>

			<button
				onClick={getAlgorithm}
				disabled={isLoading}
				className={`px-8 py-3 rounded-lg font-medium transition-colors text-black dark:text-white border-1 hover:bg-gray-200 dark:hover:bg-gray-900 disabled:opacity-50 max-w-2xl w-full`}
			>
				Decode Cube
			</button>

			{decoded != -1n && (
				<div className="max-w-2xl w-full">
					<Codeblock
						text={decoded.toString()}
						title="CubeCode"
						description="Unique number for this cube's state"
					/>
					<Codeblock
						text={decoded.toString(2)}
						title="Binary"
						description="Binary representation of the CubeCode"
					/>
					<Codeblock
						text={(() => {
							try {
								const bytes = [];
								let num = decoded;
								while (num > 0n) {
									bytes.unshift(Number(num & 0xffn));
									num = num >> 8n;
								}
								return new TextDecoder().decode(new Uint8Array(bytes));
							} catch {
								return "Invalid ASCII";
							}
						})()}
						title="Text (ASCII)"
						description="ASCII representation of the CubeCode"
					/>
					<div className="text-xs text-gray-500 max-w-2xl text-center mt-5">
						Note that the ASCII may not have real content if it wasn't encoded
						with ASCII.
					</div>
				</div>
			)}
		</div>
	);
}
