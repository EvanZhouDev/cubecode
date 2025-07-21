export function decodeOrientation(
	code: number,
	length: number,
	n: number
): number[] {
	const o = new Array<number>(length);
	for (let i = length - 1; i >= 0; i--) {
		o[i] = code % n;
		code = Math.floor(code / n);
	}
	return o;
}
