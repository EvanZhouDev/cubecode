export function factorial(n: number) {
	let res = 1;
	for (let i = 2; i <= n; i++) res *= i;
	return res;
}

export function getLehmerCode(perm: Array<number>) {
	const n = perm.length;
	const lehmer = Array(n).fill(0);
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			if (perm[j] < perm[i]) lehmer[i]++;
		}
	}
	return lehmer;
}

function lehmerToFactoradic(lehmer: Array<number>) {
	let total = 0;
	for (let i = 0; i < lehmer.length; i++) {
		total += lehmer[i] * factorial(lehmer.length - 1 - i);
	}
	return total;
}

export function getFactoradic(perm: Array<number>) {
	return lehmerToFactoradic(getLehmerCode(perm));
}

export function getParity(perm: Array<number>) {
	const sum = getLehmerCode(perm).reduce((acc, val) => acc + val, 0);
	return sum % 2; // 0 = even, 1 = odd
}

/**
 * Convert a factoradic integer into a Lehmer code of length n
 */
export function factoradicToLehmer(code: number, n: number): Array<number> {
	const lehmer = new Array<number>(n);
	let remainder = code;
	for (let i = 0; i < n; i++) {
		const f = factorial(n - 1 - i);
		lehmer[i] = Math.floor(remainder / f);
		remainder %= f;
	}
	return lehmer;
}

/**
 * Convert a Lehmer code into the corresponding permutation [0..n-1]
 */
export function lehmerToPerm(lehmer: Array<number>): Array<number> {
	const n = lehmer.length;
	const elements = Array.from({ length: n }, (_, i) => i);
	return lehmer.map((l) => {
		// pick the l-th smallest remaining element
		return elements.splice(l, 1)[0];
	});
}

/**
 * Convenience: direct from factoradic code to permutation
 */
export function factoradicToPerm(code: number, n: number): Array<number> {
	const lehmer = factoradicToLehmer(code, n);
	return lehmerToPerm(lehmer);
}
