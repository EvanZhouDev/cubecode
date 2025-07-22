import path from "path";
import fs from "fs";
import { test, expect, describe } from "vitest";
import { decodeCube } from "../index";

const expectedCornerCache = JSON.parse(
	fs.readFileSync(path.join(__dirname, "./expectedCornerCache.json"), "utf-8")
);

describe("Decode With Built-in Corner Cache Generation", () => {
	test("Decode Cube w/ State 0", () => {
		expect(decodeCube(0n)).toEqual({
			ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			cp: [0, 1, 2, 3, 4, 5, 6, 7],
			co: [0, 0, 0, 0, 0, 0, 0, 0],
		});
	});

	test("Decode Cube w/ State 43252003274489856000 - 1", () => {
		expect(decodeCube(43252003274489855999n)).toEqual({
			ep: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
			eo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			cp: [7, 6, 5, 4, 3, 2, 1, 0],
			co: [1, 2, 2, 2, 2, 2, 2, 2],
		});
	});
});

describe("Decode With provided Corner Cache", () => {
	test("Decode Cube w/ State 0", () => {
		expect(decodeCube(0n, expectedCornerCache)).toEqual({
			ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			cp: [0, 1, 2, 3, 4, 5, 6, 7],
			co: [0, 0, 0, 0, 0, 0, 0, 0],
		});
	});

	test("Decode Cube w/ State 43252003274489856000 - 1", () => {
		expect(decodeCube(43252003274489855999n, expectedCornerCache)).toEqual({
			ep: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
			eo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			cp: [7, 6, 5, 4, 3, 2, 1, 0],
			co: [1, 2, 2, 2, 2, 2, 2, 2],
		});
	});
});

describe("Decode With Errors", () => {
	test("Decode w/ Negative State", () => {
		expect(() => decodeCube(-1n, expectedCornerCache)).toThrowError(
			"Invalid CubeCode input. All CubeCodes must be between 0 and 43,252,003,274,489,856,000 - 1."
		);
	});

	test("Decode w/ Positive State Over Size Limit", () => {
		expect(() =>
			decodeCube(43252003274489856000n, expectedCornerCache)
		).toThrowError(
			"Invalid CubeCode input. All CubeCodes must be between 0 and 43,252,003,274,489,856,000 - 1."
		);
	});
});
