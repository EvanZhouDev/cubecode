import { factoradicToPerm, getParity } from "./util";
import fs from "fs";
import { CornerCache } from "./types";

export function decodePermutation({
	cp,
	ep,
	cornerCache,
}: {
	cp: number;
	ep: number;
	cornerCache: CornerCache;
}) {
	const epPerm = factoradicToPerm(ep, 12);

	const parity = getParity(epPerm);

	if (parity == 0) {
		return { ep: epPerm, cp: factoradicToPerm(cornerCache.evenPerms[cp], 8) };
	} else {
		return { ep: epPerm, cp: factoradicToPerm(cornerCache.oddPerms[cp], 8) };
	}
}
