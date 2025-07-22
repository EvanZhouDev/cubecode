"use client";

import { useEffect, useState } from "react";
import CubePicker from "../components/CubePicker";
import Cube from "cubejs";
import { decodeCube, encodeCube, generateCornerCache } from "@repo/cubecode";
import Codeblock from "../components/Codeblock";
import { decode } from "punycode";
import Link from "next/link";

type EncodingFormat = "cubecode" | "binary" | "ascii";

export default function EncodePage() {
	const [encodingFormat, setEncodingFormat] = useState<EncodingFormat>("ascii");
	const [inputValue, setInputValue] = useState<string>("");
	const [input, setInput] = useState<bigint>(0n);
	const [encoded, setEncoded] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const MAX_VALUE = 43252003274489856000n - 1n;

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

	// Update input value when encoding format or input text changes
	useEffect(() => {
		try {
			let newInput = 0n;

			if (inputValue === "") {
				newInput = 0n;
			} else if (encodingFormat === "cubecode") {
				const parsed = BigInt(inputValue);
				newInput = parsed >= 0n && parsed <= MAX_VALUE ? parsed : 0n;
			} else if (encodingFormat === "binary") {
				// Parse binary string
				if (/^[01]+$/.test(inputValue)) {
					const parsed = BigInt("0b" + inputValue);
					newInput = parsed <= MAX_VALUE ? parsed : 0n;
				}
			} else if (encodingFormat === "ascii") {
				// Convert ASCII text to number
				const encoder = new TextEncoder();
				const bytes = encoder.encode(inputValue.slice(0, 8)); // Limit to 8 characters
				let result = 0n;
				for (let i = 0; i < bytes.length; i++) {
					result = (result << 8n) | BigInt(bytes[i]!);
				}
				newInput = result <= MAX_VALUE ? result : 0n;
			}

			setInput(newInput);
		} catch (error) {
			setInput(0n);
		}
	}, [inputValue, encodingFormat]);

	// Clear encoded result when input changes
	useEffect(() => {
		setEncoded("");
	}, [input]);

	const getAlgCubingUrl = (algorithm: string): string => {
		// Convert prime moves (') to minus (-)
		const formattedAlg = algorithm.replace(/'/g, "-");
		// Encode for URL
		const encodedAlg = encodeURIComponent(formattedAlg);
		return `https://alg.cubing.net/?alg=${encodedAlg}&view=playback`;
	};

	const handleCubeChange = (newCubeString: string) => {
		setCubeString(newCubeString);
	};

	const handleEncode = () => {
		setIsLoading(true);
		try {
			Cube.initSolver();
			// Note that in the API, "decode" refers to turning a number into a cube state, thus decoding number
			// However, in the context of this app, you "encode" a number into a cube state, so this page is called "encode".
			const cubeContent = decodeCube(input, generateCornerCache());
			console.log(cubeContent);
			const cube = new Cube({ ...cubeContent, center: [0, 1, 2, 3, 4, 5] });
			const solutionResult = cube.solve();
			setEncoded(Cube.inverse(solutionResult));
		} catch (error) {
			console.error("Error encoding cube:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getPlaceholder = () => {
		switch (encodingFormat) {
			case "cubecode":
				return "Enter a number (0 to 43,252,003,274,489,855,999)";
			case "binary":
				return "Enter binary digits (0s and 1s)";
			case "ascii":
				return "Enter text (up to 8 characters)";
		}
	};

	const getInputValidation = () => {
		if (inputValue === "") return true;

		switch (encodingFormat) {
			case "cubecode":
				try {
					const parsed = BigInt(inputValue);
					return parsed >= 0n && parsed <= MAX_VALUE;
				} catch {
					return false;
				}
			case "binary":
				if (!/^[01]+$/.test(inputValue)) return false;
				try {
					const parsed = BigInt("0b" + inputValue);
					return parsed <= MAX_VALUE;
				} catch {
					return false;
				}
			case "ascii":
				return inputValue.length <= 8;
		}
	};

	return (
		<div className="flex flex-col items-center gap-4 px-5">
			<div className="text-black dark:text-white text-center text-xl max-w-2xl">
				Encode a secret message into a Rubik's cube.
			</div>
			<div className="text-gray-500 dark:text-gray-100 text-center max-w-2xl">
				Enter text, binary, or a number to{" "}
				<b>encode it into a Rubik's cube configuration</b>. Choose your input
				format and enter the data you want to encode. Ensure your Rubik's cube
				is solved before using the algorithm. You can use the{" "}
				<Link href="/solve">
					<p className="underline inline">Solve</p>
				</Link>{" "}
				tool.
			</div>

			{/* Encoding Format Toggle */}
			<div className="flex flex-col gap-4 w-full max-w-2xl">
				<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
					Encoding Format:
				</label>
				<div className="flex gap-2">
					<button
						onClick={() => setEncodingFormat("ascii")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							encodingFormat === "ascii"
								? "bg-gray-600 dark:bg-gray-700 text-white"
								: "outline-1 text-gray-700 dark:text-gray-500 hover:bg-gray-800"
						}`}
					>
						Text (ASCII)
					</button>
					<button
						onClick={() => setEncodingFormat("cubecode")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							encodingFormat === "cubecode"
								? "bg-gray-600 dark:bg-gray-700 text-white"
								: "outline-1 text-gray-700 dark:text-gray-500 hover:bg-gray-800"
						}`}
					>
						CubeCode
					</button>
					<button
						onClick={() => setEncodingFormat("binary")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							encodingFormat === "binary"
								? "bg-gray-600 dark:bg-gray-700 text-white"
								: "outline-1 text-gray-700 dark:text-gray-500 hover:bg-gray-800"
						}`}
					>
						Binary
					</button>
				</div>
			</div>

			{/* Input Field */}
			<div className="flex flex-col gap-2 w-full max-w-2xl">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder={getPlaceholder()}
					className={`px-4 py-3 border rounded-lg text-sm ${
						getInputValidation()
							? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							: "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
					} outline-none transition-colors`}
				/>
				{!getInputValidation() && (
					<div className="text-xs text-red-500">
						{encodingFormat === "cubecode" && "Invalid number or out of range"}
						{encodingFormat === "binary" &&
							"Invalid binary format or out of range"}
						{encodingFormat === "ascii" && "Text too long (max 8 characters)"}
					</div>
				)}
				<div className="text-xs text-gray-500">
					Corresponding CubeCode: {input.toString()}
				</div>
			</div>

			{encoded === "" && (
				<button
					onClick={handleEncode}
					disabled={isLoading || !getInputValidation() || input === 0n}
					className={`px-8 py-3 rounded-lg font-medium transition-colors text-black dark:text-white border-1 hover:bg-gray-200 dark:hover:bg-gray-900 disabled:opacity-50 max-w-2xl w-full`}
				>
					{isLoading ? "Encoding..." : "Encode"}
				</button>
			)}

			{encoded !== "" && (
				<div className="max-w-2xl w-full">
					<Codeblock
						text={encoded}
						title="Algorithm"
						description="Algorithm for the encrypted state"
					/>
					<div className="text-md text-center -mt-1 mb-3">
						Do this algorithm with the <b>white center on top</b> and the{" "}
						<b>green center facing towards you</b>.
					</div>
					{/* Interactive visualization */}
					<div className="w-full">
						<iframe
							src={getAlgCubingUrl(encoded)}
							className="w-full h-96 border rounded-lg"
							title="Algorithm Visualization"
						/>
					</div>
					<div className="text-xs text-gray-500 max-w-2xl text-center mt-5">
						Please ensure you have done the algorithm correctly. Any mistake may significantly alter the encoded message.
					</div>
				</div>
			)}
		</div>
	);
}
