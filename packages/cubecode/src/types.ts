export type CornerCache = {
	evenPerms: number[];
	oddPerms: number[];
	getEvenPermIndex: {
		[factoriadic: number]: number;
	};
	getOddPermIndex: {
		[factoriadic: number]: number;
	};
};
