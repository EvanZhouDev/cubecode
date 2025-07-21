"use client";

import { useEffect, useState } from "react";
import CubePicker from "../components/CubePicker";
import Cube from "cubejs";
import { decodeCube, encodeCube, generateCornerCache } from "@repo/cubecode";
import Codeblock from "../components/Codeblock";
import { decode } from "punycode";

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
			<div className="text-gray-600 text-center text-xl max-w-2xl">
				Encode a secret message into a Rubik's cube.
			</div>
			<div className="text-gray-500 text-center max-w-2xl">
				Enter text, binary, or a number to{" "}
				<b>encode it into a Rubik's cube configuration</b>. Choose your input
				format and enter the data you want to encode.
			</div>

			{/* Encoding Format Toggle */}
			<div className="flex flex-col gap-4 w-full max-w-2xl">
				<label className="text-sm font-medium text-gray-700">
					Encoding Format:
				</label>
				<div className="flex gap-2">
					<button
						onClick={() => setEncodingFormat("ascii")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							encodingFormat === "ascii"
								? "bg-gray-600 text-white"
								: "outline-1 text-gray-700 hover:bg-gray-300"
						}`}
					>
						Text (ASCII)
					</button>
					<button
						onClick={() => setEncodingFormat("cubecode")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							encodingFormat === "cubecode"
								? "bg-gray-600 text-white"
								: "outline-1 text-gray-700 hover:bg-gray-300"
						}`}
					>
						CubeCode
					</button>
					<button
						onClick={() => setEncodingFormat("binary")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							encodingFormat === "binary"
								? "bg-gray-600 text-white"
								: "outline-1 text-gray-700 hover:bg-gray-300"
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
					className={`px-8 py-3 rounded-lg font-medium transition-colors text-black border-1 hover:bg-gray-200 disabled:opacity-50 w-2xl`}
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
					{/* Interactive visualization */}
					<div className="w-full">
						<iframe
							src={getAlgCubingUrl(encoded)}
							className="w-full h-96 border rounded-lg"
							title="Algorithm Visualization"
						/>
					</div>
					<div className="text-xs text-gray-500 max-w-2xl text-center mt-5">
						You should do this algorithm with the white center on top and the
						green center facing towards you.
					</div>
				</div>
			)}
		</div>
	);
}
