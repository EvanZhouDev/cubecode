import { CornerCache } from "./types";
import { generateCornerCache } from "./generateCornerCache";

export class GlobalCache {
	static cornerCache: CornerCache;

	static getCornerCache() {
		if (!GlobalCache.cornerCache) {
			GlobalCache.cornerCache = generateCornerCache();
		}
		return GlobalCache.cornerCache;
	}
}
