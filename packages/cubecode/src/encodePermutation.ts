import { CornerCache } from "./types";
import { getLehmerCode, getFactoradic, getParity } from "./util";
import fs from "fs";

export function encodePermutation({
	ep,
	cp,
	cornerCache,
}: {
	ep: number[];
	cp: number[];
	cornerCache: CornerCache;
}): {
	ep: number;
	cp: number;
} {
	let epFactoradic = getFactoradic(ep);
	let epParity = getParity(ep);

	let cpFactoradic = getFactoradic(cp);
	let cpParity = getParity(cp);

	if (cpParity != epParity) throw new Error("Parities do not match");

	// console.log(epFactoradic);
	if (cpParity == 0) {
		return {
			ep: epFactoradic,
			cp: cornerCache.getEvenPermIndex[cpFactoradic],
		};
	} else {
		return {
			ep: epFactoradic,
			cp: cornerCache.getOddPermIndex[cpFactoradic],
		};
	}
}
