import { encodeOrientation } from "./encodeOrientation";
import { encodePermutation } from "./encodePermutation";
import { CornerCache } from "./types";
import { generateCornerCache } from "./generateCornerCache";

export function encodeCube(
	{
		ep,
		cp,
		eo,
		co,
	}: {
		ep: number[];
		cp: number[];
		eo: number[];
		co: number[];
	},
	cornerCache?: CornerCache
): bigint {
	// Validate input arrays
	if (
		ep.length !== 12 ||
		!ep.every((val, idx) => ep.indexOf(val) === idx && val >= 0 && val <= 11)
	) {
		throw new Error("ep must contain exactly the numbers 0 to 11");
	}
	if (
		cp.length !== 8 ||
		!cp.every((val, idx) => cp.indexOf(val) === idx && val >= 0 && val <= 7)
	) {
		throw new Error("cp must contain exactly the numbers 0 to 7");
	}
	if (co.length !== 8 || !co.every((val) => val >= 0 && val <= 2)) {
		throw new Error("co must contain exactly 8 numbers between 0 and 2");
	}
	if (eo.length !== 12 || !eo.every((val) => val >= 0 && val <= 1)) {
		throw new Error("eo must contain exactly 12 numbers between 0 and 1");
	}
	// Validate orientation sums (must be valid cube state)
	const coSum = co.reduce((sum, val) => sum + val, 0);
	if (coSum % 3 !== 0) {
		throw new Error("Corner Orientation Parity is incorrect");
	}
	const eoSum = eo.reduce((sum, val) => sum + val, 0);
	if (eoSum % 2 !== 0) {
		throw new Error("Edge Orientation Parity is incorrect");
	}

	if (!cornerCache) cornerCache = generateCornerCache();
	// first pack ep & cp, note that parity is automatically handled by encodePermutation
	const { ep: epFac, cp: cpFac } = encodePermutation({ ep, cp, cornerCache });
	// then orientations (drop the first piece in each, since it's orientation is determined by the rest of the pieces)
	const eoRank = encodeOrientation(eo.slice(1), 2);
	const coRank = encodeOrientation(co.slice(1), 3);

	// radices for mixed‐radix:
	const CP_MAX = 20160n; // 8!/2
	const EO_MAX = 2048n; // 2^11
	const CO_MAX = 2187n; // 3^7

	// (((epFac * CP_MAX + cpFac) * EO_MAX + eoRank) * CO_MAX + coRank)
	const p1 = BigInt(epFac) * CP_MAX + BigInt(cpFac);
	const p2 = p1 * EO_MAX + BigInt(eoRank);
	return p2 * CO_MAX + BigInt(coRank);
}
