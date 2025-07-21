export function encodeOrientation(o: Array<number>, n: number) {
	// where o is an array of the orientations
	// where n is the total number of orientations
	let res = 0;
	for (let i = o.length - 1, pow = 0; i >= 0; i--, pow++) {
		res += o[i] * Math.pow(n, pow);
	}
	return res;
}
