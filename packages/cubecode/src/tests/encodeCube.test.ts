import path from "path";
import fs from "fs";
import { test, expect, describe } from "vitest";
import { encodeCube } from "../encodeCube";

const expectedCornerCache = JSON.parse(
	fs.readFileSync(path.join(__dirname, "./expectedCornerCache.json"), "utf-8")
);

describe("Encode With Built-in Corner Cache Generation", () => {
	test("Encode Cube w/ State 0", () => {
		expect(
			encodeCube({
				ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				cp: [0, 1, 2, 3, 4, 5, 6, 7],
				co: [0, 0, 0, 0, 0, 0, 0, 0],
			})
		).toEqual(0n);
	});

	test("Encode Cube w/ State 43252003274489856000 - 1", () => {
		expect(
			encodeCube({
				ep: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
				eo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				cp: [7, 6, 5, 4, 3, 2, 1, 0],
				co: [1, 2, 2, 2, 2, 2, 2, 2],
			})
		).toEqual(43252003274489855999n);
	});
});

describe("Encode With provided Corner Cache", () => {
	test("Encode Cube w/ State 0", () => {
		expect(
			encodeCube(
				{
					ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
					eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					cp: [0, 1, 2, 3, 4, 5, 6, 7],
					co: [0, 0, 0, 0, 0, 0, 0, 0],
				},
				expectedCornerCache
			)
		).toEqual(0n);
	});

	test("Encode Cube w/ State 43252003274489856000 - 1", () => {
		expect(
			encodeCube(
				{
					ep: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
					eo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
					cp: [7, 6, 5, 4, 3, 2, 1, 0],
					co: [1, 2, 2, 2, 2, 2, 2, 2],
				},
				expectedCornerCache
			)
		).toEqual(43252003274489855999n);
	});
});

describe("Encode with Errors", () => {
	test("Invalid EP", () => {
		expect(() =>
			encodeCube(
				{
					ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 11],
					eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					cp: [0, 1, 2, 3, 4, 5, 6, 7],
					co: [0, 0, 0, 0, 0, 0, 0, 0],
				},
				expectedCornerCache
			)
		).toThrowError("ep must contain exactly the numbers 0 to 11");
	});
	test("Invalid CP", () => {
		expect(() =>
			encodeCube(
				{
					ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
					eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					cp: [0, 1, 2, 3, 4, 5, 7, 7],
					co: [0, 0, 0, 0, 0, 0, 0, 0],
				},
				expectedCornerCache
			)
		).toThrowError("cp must contain exactly the numbers 0 to 7");
	});
	test("Invalid CO", () => {
		() =>
			expect(
				encodeCube(
					{
						ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
						eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						cp: [0, 1, 2, 3, 4, 5, 6, 7],
						co: [100, 0, 0, 0, 0, 0, 0, 0],
					},
					expectedCornerCache
				)
			).toThrowError("co must contain exactly 8 numbers between 0 and 2");
	});
	test("Invalid EO", () => {
		() =>
			expect(
				encodeCube(
					{
						ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
						eo: [123, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						cp: [0, 1, 2, 3, 4, 5, 6, 7],
						co: [0, 0, 0, 0, 0, 0, 0, 0],
					},
					expectedCornerCache
				)
			).toThrowError("eo must contain exactly 12 numbers between 0 and 1");
	});
	test("Invalid CO Parity", () => {
		() =>
			expect(
				encodeCube(
					{
						ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
						eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						cp: [0, 1, 2, 3, 4, 5, 6, 7],
						co: [1, 0, 0, 0, 0, 0, 0, 0],
					},
					expectedCornerCache
				)
			).toThrowError("Corner Orientation Parity is incorrect");
	});
	test("Invalid EO Parity", () => {
		() =>
			expect(
				encodeCube(
					{
						ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
						eo: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						cp: [0, 1, 2, 3, 4, 5, 6, 7],
						co: [0, 0, 0, 0, 0, 0, 0, 0],
					},
					expectedCornerCache
				)
			).toThrowError("Edge Orientation Parity is incorrect");
	});

	test("Invalid EP/CP Parity", () => {
		() =>
			expect(
				encodeCube(
					{
						ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 10],
						eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						cp: [0, 1, 2, 3, 4, 5, 6, 7],
						co: [0, 0, 0, 0, 0, 0, 0, 0],
					},
					expectedCornerCache
				)
			).toThrowError("Edge and Corner Permutation Parities do not match");
	});
});
