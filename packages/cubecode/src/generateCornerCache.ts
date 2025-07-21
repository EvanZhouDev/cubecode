import { permutation } from "js-combinatorics";
import { getFactoradic, getParity } from "./util";

export function generateCornerCache() {
	const evenPerms: Array<number> = []; // array of the factoradic number representation of EVEN permutations in order
	const oddPerms: Array<number> = []; // array of the factoradic number representation of ODD permutations in order
	const getEvenPermIndex: {
		[factoriadic: number]: number;
	} = {}; // map from the factoradic number representation to the index of that factoradic number in the evenPerms array
	const getOddPermIndex: {
		[factoriadic: number]: number;
	} = {}; // map from the factoradic number representation to the index of that factoradic number in the oddPerms array

	let it = permutation(new Array(8).fill(null).map((x, i) => i)).toArray();
	for (const elem of it) {
		const parity = getParity(elem);
		const factoradic = getFactoradic(elem);
		if (parity == 0) {
			evenPerms.push(factoradic);
			getEvenPermIndex[factoradic] = evenPerms.length - 1;
		} else if (parity == 1) {
			oddPerms.push(factoradic);
			getOddPermIndex[factoradic] = oddPerms.length - 1;
		}
	}

	return { evenPerms, oddPerms, getEvenPermIndex, getOddPermIndex };
}
