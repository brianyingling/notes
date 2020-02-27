var numbers = {
	// ..
	[Symbol.iterator]({ start = 0, stop = 100, increment = 1} = {}) {
		// var index = 0;
		return {
			next: () => {
				const value = start;
				start = start + increment;
				return (value <= stop) 
					? { done: false, value}
					: { done: true, value: undefined}
			}
		}
	}
};

// should print 0..100 by 1s
for (let num of numbers) {
	console.log(num);
}

// should print 6..30 by 4s
console.log("My lucky numbers are: ____");

// Hint:
//     [...numbers[Symbol.iterator]( ?? )]
const result = [...numbers][Symbol.iterator]({start: 6, stop: 30, increment: 4});
console.log('result:', result.next());
for (let res of result) {
	console.log(res);
}