"use client";

import { useState, useEffect } from "react";

type FaceColor = "U" | "R" | "F" | "D" | "L" | "B" | "E";

const COLORS = {
	U: "#ffffff", // White (Up)
	R: "#ff0000", // Red (Right)
	F: "#03FF33", // Green (Front)
	D: "#FFFB00", // Yellow (Down)
	L: "#FF9500", // Orange (Left)
	B: "#1A31FF", // Blue (Back)
	E: "#cccccc", // Empty/Gray
};

const COLOR_NAMES = {
	U: "White",
	R: "Red",
	F: "Green",
	D: "Yellow",
	L: "Orange",
	B: "Blue",
	E: "Empty",
};

interface CubePickerProps {
	cubeString: string;
	onCubeChange: (cubeString: string) => void;
	storageKey?: string;
}

export default function CubePicker({
	cubeString,
	onCubeChange,
	storageKey,
}: CubePickerProps) {
	const [selectedColor, setSelectedColor] = useState<FaceColor>("U");
	const [hasLoaded, setHasLoaded] = useState(false);

	// Load from localStorage on component mount
	useEffect(() => {
		if (storageKey && typeof window !== "undefined" && !hasLoaded) {
			const savedCube = localStorage.getItem(storageKey);
			if (savedCube) {
				onCubeChange(savedCube);
			}
			setHasLoaded(true);
		}
	}, [storageKey, onCubeChange, hasLoaded]);

	// Save to localStorage whenever cubeString changes (but not on initial load)
	useEffect(() => {
		if (storageKey && typeof window !== "undefined" && hasLoaded) {
			localStorage.setItem(storageKey, cubeString);
		}
	}, [cubeString, storageKey, hasLoaded]);

	// Convert URFDLB string to ULFRBD for visual display
	const convertToVisual = (urfdlbString: string): string => {
		if (urfdlbString.length !== 54) return urfdlbString;

		const U = urfdlbString.slice(0, 9); // U stays at 0
		const R = urfdlbString.slice(9, 18); // R moves to position 3
		const F = urfdlbString.slice(18, 27); // F moves to position 2
		const D = urfdlbString.slice(27, 36); // D moves to position 5
		const L = urfdlbString.slice(36, 45); // L moves to position 1
		const B = urfdlbString.slice(45, 54); // B moves to position 4

		return U + L + F + R + B + D; // ULFRBD order for visual
	};

	// Convert ULFRBD visual string back to URFDLB
	const convertFromVisual = (ulfrdbString: string): string => {
		if (ulfrdbString.length !== 54) return ulfrdbString;

		const U = ulfrdbString.slice(0, 9); // U stays at 0
		const L = ulfrdbString.slice(9, 18); // L moves to position 4
		const F = ulfrdbString.slice(18, 27); // F moves to position 2
		const R = ulfrdbString.slice(27, 36); // R moves to position 1
		const B = ulfrdbString.slice(36, 45); // B moves to position 5
		const D = ulfrdbString.slice(45, 54); // D moves to position 3

		return U + R + F + D + L + B; // URFDLB order for CubeJS
	};

	// Convert string back to array for internal manipulation
	const visualCubeState = convertToVisual(cubeString).split("") as FaceColor[];

	const updateSquare = (index: number) => {
		// Check if it's a center square (position 4 in each face)
		const positionInFace = index % 9;
		if (positionInFace === 4) {
			// Don't allow changing center squares
			return;
		}

		const newVisualState = [...visualCubeState];
		newVisualState[index] = selectedColor;
		const newCubeString = convertFromVisual(newVisualState.join(""));
		onCubeChange(newCubeString);
	};

	const setSolvedCube = () => {
		// URFDLB format with all faces solved
		const solved = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
		onCubeChange(solved);
	};

	const setEmptyCube = () => {
		// URFDLB format with centers only
		let empty = "";
		empty += "EEEEUEEEE"; // U face
		empty += "EEEEREEEE"; // R face
		empty += "EEEEFEEEE"; // F face
		empty += "EEEEDEEEE"; // D face
		empty += "EEEELEEEE"; // L face
		empty += "EEEEBEEEE"; // B face
		onCubeChange(empty);
	};

	const renderFace = (
		startIndex: number,
		className: string = "",
		isMobile: boolean = false
	) => {
		const squareSize = isMobile ? "w-6 h-6" : "w-8 h-8";
		const gap = isMobile ? "gap-0.5" : "gap-1";

		return (
			<div className={`grid grid-cols-3 ${gap} ${className}`}>
				{Array.from({ length: 9 }, (_, i) => {
					const index = startIndex + i;
					const faceColor = visualCubeState[index];
					const isCenter = i === 4; // Center square of each face
					return (
						<button
							key={index}
							className={`${squareSize} border border-gray-400 transition-colors rounded-xs ${
								isCenter
									? "cursor-not-allowed"
									: "hover:border-gray-600 cursor-pointer"
							}`}
							style={{
								backgroundColor: faceColor ? COLORS[faceColor] : COLORS.U,
							}}
							onClick={() => updateSquare(index)}
							disabled={isCenter}
						/>
					);
				})}
			</div>
		);
	};

	return (
		<div className="flex flex-col items-center gap-6">
			{/* Desktop layout */}
			<div className="hidden md:flex flex-row items-center justify-center gap-10 p-5 relative">
				<div className="flex gap-3 flex-col absolute bottom-0 right-0 p-5">
					<button
						onClick={setSolvedCube}
						className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
					>
						Load Solved Cube
					</button>
					<button
						onClick={setEmptyCube}
						className="px-4 py-2 text-black border border-gray-500 rounded-lg hover:border-black transition-colors text-sm"
					>
						Load Empty Cube
					</button>
				</div>
				<div className="flex gap-2 flex-col">
					{(Object.keys(COLORS).filter((x) => x != "E") as FaceColor[]).map(
						(color) => (
							<button
								key={color}
								className={`w-12 h-12 rounded-full border-2 ${
									selectedColor === color
										? "border-grey-500"
										: "border-gray-300"
								} hover:border-gray-500 transition-colors`}
								style={{ backgroundColor: COLORS[color] }}
								onClick={() => setSelectedColor(color)}
								title={COLOR_NAMES[color]}
							/>
						)
					)}
				</div>
				<div className="flex flex-col items-center gap-4">
					{/* Top face (U) with spacer */}
					<div className="flex gap-4">
						{renderFace(0)}
						<div className="w-26 h-24"></div>{" "}
						{/* Spacer to align with L face */}
					</div>

					{/* Middle row: L, F, R, B */}
					<div className="flex gap-4">
						{renderFace(9)} {/* L */}
						{renderFace(18)} {/* F */}
						{renderFace(27)} {/* R */}
						{renderFace(36)} {/* B */}
					</div>

					{/* Bottom face (D) with spacer */}
					<div className="flex gap-4">
						{renderFace(45)}
						<div className="w-26 h-24"></div>{" "}
						{/* Spacer to align with L face */}
					</div>
				</div>
			</div>

			{/* Mobile layout */}
			<div className="md:hidden flex flex-col items-center gap-4 p-2">
				{/* Smaller cube for mobile */}
				<div className="flex flex-col items-center gap-2">
					{/* Top face (U) with spacer */}
					<div className="flex gap-2">
						{renderFace(0, "", true)}
						<div className="w-18 h-16"></div> {/* Smaller spacer for mobile */}
					</div>

					{/* Middle row: L, F, R, B */}
					<div className="flex gap-2">
						{renderFace(9, "", true)} {/* L */}
						{renderFace(18, "", true)} {/* F */}
						{renderFace(27, "", true)} {/* R */}
						{renderFace(36, "", true)} {/* B */}
					</div>

					{/* Bottom face (D) with spacer */}
					<div className="flex gap-2">
						{renderFace(45, "", true)}
						<div className="w-18 h-16"></div> {/* Smaller spacer for mobile */}
					</div>
				</div>

				{/* Horizontal color picker for mobile */}
				<div className="flex gap-2 flex-row flex-wrap justify-center px-4">
					{(Object.keys(COLORS).filter((x) => x != "E") as FaceColor[]).map(
						(color) => (
							<button
								key={color}
								className={`w-10 h-10 rounded-full border-2 ${
									selectedColor === color
										? "border-grey-500"
										: "border-gray-300"
								} hover:border-gray-500 transition-colors`}
								style={{ backgroundColor: COLORS[color] }}
								onClick={() => setSelectedColor(color)}
								title={COLOR_NAMES[color]}
							/>
						)
					)}
				</div>

				{/* Load buttons underneath color picker for mobile */}
				<div className="flex gap-2 flex-row justify-center px-4">
					<button
						onClick={setSolvedCube}
						className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
					>
						Load Solved Cube
					</button>
					<button
						onClick={setEmptyCube}
						className="px-3 py-2 text-black border border-gray-500 rounded-lg hover:border-black transition-colors text-sm"
					>
						Load Empty Cube
					</button>
				</div>
			</div>
		</div>
	);
}
