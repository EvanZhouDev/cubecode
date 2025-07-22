import path from "path";
import { generateCornerCache } from "../index";
import fs from "fs";
import { test, expect } from "vitest";

const expectedCornerCache = JSON.parse(
	fs.readFileSync(path.join(__dirname, "./expectedCornerCache.json"), "utf-8")
);

test("Corner Cache Generation", () => {
	expect(generateCornerCache()).toStrictEqual(expectedCornerCache);
});
