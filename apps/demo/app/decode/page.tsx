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
		<div className="flex flex-col items-center gap-8 px-5">
			<div className="text-gray-600 max-w-2xl text-center">
				Enter the current state of the Rubik's cube to decode it. Ensure the
				colors in the center of each side of your cube are matching with the
				digital cube.
			</div>

			<CubePicker
				cubeString={cubeString}
				onCubeChange={handleCubeChange}
				storageKey="solveCube"
			/>

			<div className="text-xs text-gray-500 max-w-2xl text-center">
				The decoding <b>will not work</b> if your colors are not exactly
				matching.
			</div>
			{decoded == -1n && (
				<button
					onClick={getAlgorithm}
					disabled={isLoading}
					className={`px-6 py-3 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700`}
				>
					{"Decode Cube"}
				</button>
			)}

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
						title="ASCII"
						description="ASCII representation of the CubeCode"
					/>
					<div className="text-xs text-gray-500 max-w-2xl text-center mt-5">
						Change the colors on the cube above to decode another cube. Note
						that the ASCII may not have real content if it wasn't encoded with
						ASCII.
					</div>
				</div>
			)}
		</div>
	);
}
