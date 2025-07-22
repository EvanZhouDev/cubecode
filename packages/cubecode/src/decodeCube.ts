import { decodePermutation } from "./decodePermutation";
import { decodeOrientation } from "./decodeOrientation";
import { CornerCache } from "./types";
import { generateCornerCache } from "./generateCornerCache";

export function decodeCube(index: bigint, cornerCache?: CornerCache) {
	if (!cornerCache) cornerCache = generateCornerCache();

	const CP_MAX = 20160n;
	const EO_MAX = 2048n;
	const CO_MAX = 2187n;

	// unpack in reverse order:
	const coRank = index % CO_MAX;
	const afterCo = index / CO_MAX;

	const eoRank = afterCo % EO_MAX;
	const afterEo = afterCo / EO_MAX;

	const cpIdx = afterEo % CP_MAX;
	const epRank = afterEo / CP_MAX;

	// perms need plain numbers
	const { ep, cp } = decodePermutation({
		ep: Number(epRank),
		cp: Number(cpIdx),
		cornerCache,
	});

	// reconstruct edge‐orientation (11 stored + 1 implied)
	const eoSlice = decodeOrientation(Number(eoRank), 11, 2);
	const eoSum = eoSlice.reduce((s, v) => s + v, 0) % 2;
	const eo0 = (2 - eoSum) % 2;
	const eo = [eo0, ...eoSlice];

	// reconstruct corner‐orientation (7 stored + 1 implied)
	const coSlice = decodeOrientation(Number(coRank), 7, 3);
	const coSum = coSlice.reduce((s, v) => s + v, 0) % 3;
	const co0 = (3 - coSum) % 3;
	const co = [co0, ...coSlice];

	return { ep, cp, eo, co };
}
