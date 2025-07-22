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
