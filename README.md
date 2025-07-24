<picture>
	<source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark.svg">
	<img src="./assets/logo-light.svg" alt="CubeCode Logo" width="300">
</picture>

> Store data on Rubik's cubes.

CubeCode is a proof-of-concept method of storing data in Rubik's cubes, enabled by a one-to-one mapping of every single possible Rubik's cube state to an integer between $0$ and $43,252,003,274,489,856,000 - 1$.

This enables interesting functionality like being able to share a state of a cube with just a (relatively) short number, being able to store a secret message with ASCII on a single 3x3, and even being able to store larger pieces of data on multiple 3x3s.

## Try it Out

> You don't need to know how to solve a Rubik's cube to use the CubeCode demo! Interactive tutorials and a built-in solver will help you use it without any prior knowledge.

You can try CubeCode's functionality right now with the demo at [cubecode.vercel.app](https://cubecode.vercel.app), which allows you to store secret messages in Rubik's cubes with CubeCode.

This demo has the following features:

- **Encode**: Get a custom set of moves which encodes a custom secret message into your Rubik's cube.
- **Decode**: Given a Rubik's cube state, figure out the corresponding CubeCode number and it's secret message.
- **Solve**: An animated Rubik's cube solver to help you solve your cube after you try out CubeCode.

This will help introduce you to some of the nice features of CubeCode.

## NPM Package

The main features of CubeCode, going between a cubestate and an integer between $0$ and $43,252,003,274,489,856,000 - 1$, is available as a NPM package. Install it on NPM, or your favorite package manager:

```bash
npm i cubecode
```

It's built with **TypeScript** and is incredibly easy to use. Read the [documentation](#api-reference) below.

## API Quickstart

```ts
import { decodeCube, encodeCube } from "cubecode";

// Returns a single number representing this cube. (JSON format similar to cubejs, https://github.com/ldez/cubejs, without the `center` property).
encodeCube({
	cp: [0, 1, 2, 3, 4, 5, 6, 7],
	co: [0, 0, 0, 0, 0, 0, 0, 0],
	ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
});

// Returns a JSON with cp, co, ep, and eo similar to above.
decodeCube(1234567n);
```

## API Reference

There are only 2 main functions in CubeCode (as well as an extra function meant for caching). If you want to learn more about the detailed math, check out [the section below](#cubecodes-math).

> As a warning, `CubeCode` is always must be provided and will always be returned as a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). See the [corresponding section below](#bigint-return-format) for more information.

### Cube Format

With CubeCode, we will always be representing the cube in a simple format (referred to hereon just as "Cube Format") consisting of:

- `cp` (Corner Permutation): An array of only numbers from 0 to 7 (inclusive), in some arbitrary order
- `ep` (Edge Permutation): An array of only numbers from 0 to 11 (inclusive), in some arbitrary order
- `co` (Corner Orientation): An array of 8 numbers, each from 0 to 2 (inclusive)
- `eo` (Edge Orientation): An array of 12 numbers, each from 0 to 1 (inclusive)

This data is very arbitrarily defined. CubeCode itself does not say what number each piece or orientation is assigned to. However, we recommend the convention from [Cube.js](https://github.com/ldez/cubejs).

In essence, for **permutation** each number is assigned a specific piece (either corner or edge) and their orders represents the order of the corners/edges around the cube.

For **orientation**, each of the numbers represents how each piece is "rotated" or oriented at a specific slot in the cube. Again, the orientation is defined arbitrarily, but you can use the [Cube.js](https://github.com/ldez/cubejs) standard.

Here is an example of a solved cube:

```js
{
	cp: [0, 1, 2, 3, 4, 5, 6, 7],
	co: [0, 0, 0, 0, 0, 0, 0, 0],
	ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}
```

### `encodeCube`

This function takes a Rubik's cube in the standard [Cube Format](#cube-format), and returns a single number representing that state's CubeCode. Here's what it looks like in action:

```js
encodeCube({
	cp: [0, 1, 2, 3, 4, 5, 6, 7],
	co: [0, 0, 0, 0, 0, 0, 0, 0],
	ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
});
```

`encodeCube` does numerous checks to ensure the input is valid before giving you the CubeCode, including ensuring the [Cube Format](#cube-format) is done correctly, and that the Parity of the Orientations and Permutations are valid (that is, no "corner twists" or illegal states in general).

Then, it simply does a calculation which will yield you a single BigInt integer between $0$ and $43,252,003,274,489,856,000 - 1$.

> Note on Semantics: When we say `encodeCube`, we mean literally encoding a Rubik's cube state into a number. This is different from "encoding a message" as is seen in the [Demo Website](https://cubecode.vercel.app/), in which case it refers to encoding a message _into_ a Rubik's cube. Thus, the `encodeCube` function is actually used in the [Decode](https://cubecode.vercel.app/decode) page of the website (since it "decodes the message from the Rubik's cube"). A similar idea can be applied to `decodeCube`

`encodeCube` also supports explicitly passing in a cache with its second parameter. Learn more in the [dedicated section below](#generatecornercache-and-caching).

### `decodeCube`

This function takes a BigInt ([learn more about that below](#bigint-return-format)) as the CubeCode and returns the corresponding cubestate, in the [Cube Format](#cube-format). Here's what it looks like in action:

```js
decodeCube(1234567n);
```

Remembers that CubeCodes are always between $0$ and $43,252,003,274,489,856,000 - 1$, inclusive. `decodeCube` will reject anything outside these bounds.

Then, `decodeCube` will take that CubeCode and turn it into a valid [Cube Format](#cube-format) to return to you.

`decodeCube` also supports explicitly passing in a cache with its second parameter. Learn more in the [dedicated section below](#generatecornercache-and-caching).

### `generateCornerCache` and Caching

Under the hood, both `decodeCube` and `encodeCube` require a special cache to speed up the conversion of the CubeCode to the [Cube Format](#cube-format) and vice versa (You can learn more about why this is in the [CubeCode's Math section below](#cubecodes-math)).

However, since this cache is not very big, by default, the first time either encode or decode are called, the cache will be newly generated and stored in-memory (so the next time the same process calls the method, it'll just use the existing cache). But if you need to optimize for performance and fractions of seconds matter (sometimes that happens!), CubeCode provides a easy way to "actually cache" the data. Here's what it looks like:

```js
let cornerCache = generateCornerCache();

decodeCube(1234567n, cornerCache);
encodeCube(
	{
		cp: [0, 1, 2, 3, 4, 5, 6, 7],
		co: [0, 0, 0, 0, 0, 0, 0, 0],
		ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	cornerCache
);
```

The `generateCornerCache` function will create the necessary cache. That cache can then be passed as a optional second parameter to both decode and encode. Of course, it wouldn't make much sense to regenerate the cache every single time. Instead, it is recommended to store the cache in the proper location depending on your environment (i.e. a JSON file, or in `localStorage`) and use the cache from that instead of regenerating.

### BigInt Return Format

Due to the insanely large number of states on a Rubik's cube, the CubeCode must be stored in a BigInt. For the sake of consistency and the Principle of Least Astonishment, this BitInt rule is enforced in both input and output. This means that:

- `decodeCube` _must_ take a BigInt
- `encodeCube` returns a BitInt

Attempts to use a normal `number` may lead to literal runtime/compile time errors, or just incorrect values.

## CubeCode's Math

> This section serves as a deep dive into the math behind CubeCode and how it works. Note that this reading is not necessary if you are simply using CubeCode, but you may find it interesting.

CubeCode is a proof-of-concept method that is able to encode a Rubik's cube into a single number in a consecutive integer sequence, and turn that number back into a Rubik's cube. Here are the requirements:

- The possible CubeCodes must be exactly between $0$ and $43,252,003,274,489,856,000 - 1$, inclusive. That is, the CubeCodes of all states are all consecutive in this sequence.
- All CubeCodes must be unique, and CubeCode to cubestate must be a 1-to-1 bijective mapping
- No illegal cubestates are in the sequence
- This computation should be relatively cheap and not incredibly intensive/slow to run

Keep those key ideas in mind. But before we start, let's go over some prerequisites.

- **General Rubik's Cube Lingo**: You don't have to be a pro cuber, but ensure you understand phrases like:
  - **Corner Permutation** (CP): The way the corners on the cube are "arranged" around the cube
  - **Edge Permutation** (EP): The way the edges on the cube are "arranged" around the cube
  - **Corner Orientation** (CO): The way the corners on the cube are "turned" or oriented
  - **Edge Orientation** (EO): The way the edges on the cube are "turned" or oriented
- [**Lehmer Codes**](https://en.wikipedia.org/wiki/Lehmer_code): A way to encode a permutation of $n$ numbers into a sequence of $n$ numbers, and by interpreting that number in a [**Factorial Number System**](https://en.wikipedia.org/wiki/Factorial_number_system#Permutations), a way to assign indicies to permutations.
  - We will generally refer to a single permutation as $\sigma$
  - The **Lehmer Code** of that permutation as a list of numbers will be $L(\sigma)$
  - Let's call the Lehemer Code interpreted through the factorial number system $N(\sigma)$, or the **Index** of the permutation
- [**Permutation Parities**](https://en.wikipedia.org/wiki/Parity_of_a_permutation): Simply put, if the number of transpositiosn in the permutation is odd or even.
  - We can define the parity of a permutation as the parity of $\Sigma L(\sigma)$, or the parity of the sum of the Lehmer code of permutation $\sigma$
  - Remember that **exactly half** of the permutations are odd, and **exactly half** of the permutations are even.
  - It is highly recommended you familiarize yourself with what this means in the context of Rubik's cubes; that is, the fact that the **parity of the Corner Permutation must be equal to the parity of the Edge Permutation**

### Calculating the Possibilities on a Rubik's Cube

First, let's figure out how we defined the range of $0$ and $43,252,003,274,489,856,000 - 1$—in other words, how we get to $43,252,003,274,489,856,000$ cubestates. There are some good sources online, but we will go over the basics of the calculation here. The total number of cubestates is reasonably just the product of CP, EP, CO, and EO, so let's calculate each one.

- **Corner Orientation**: There are a total of 8 corners, each possibly oriented in 3 ways. However, the orientation of the last corner is determined by the orientation of the other 7 (the _sum of their orientations must equal 0, modulo 3_). Thus, we have a total of $3^7$ options here.
- **Edge Orientation**: There are a total of 12 edges, each possibly oriented in 2 ways. However, the orientation of the last edge is determined by the orientation of the other 11 (the _sum of their orientations must equal 0, modulo 2_). Thus, we have a total of $2^{11}$ options here.
- **Corner Permutation**: There are a total of 8 corners, which can be permutated in any way in 8 slots. Thus, we have a total of $8!$ options here.
- **Edge Permutation**: There are a total of 12 edges, which can be permutated in any way in 12 slots. Thus, we have a total of $12!$ options here.

Now, if we do the math: $3^7 * 2^{11} * 8! * 12! = 86,504,006,548,979,712,000$. Strange. That seems to be exactly 2 times our expected value. What happened?

Well, we forgot to address the Edge/Corner Permutation Parity. Put simply, the **parity of the Corner Permutation** must equal the **parity of the Edge Permutation**. This is because every turn on the Rubik's cube maintains this equivalence.

Thus, for every single Edge Permutation, you can only choose the even _or_ the odd Corner Permutations(and vice versa) which cuts down the total number of possibilities by half. So, our final result is:

```math
3^7 * 2^{11} * \frac{8! * 12!}{2} = 43,252,003,274,489,856,000
```

### Going from cubestate to CubeCode

Now, let's shift our focus to figuring out how to translate a cubestate to a CubeCode. We will approach this similarly to calculating the total number of possibilities. We will (mostly) figure out how to encode CO, EO, CP, EP separately, and then combine them all with a single multi-radix number as our final CubeCode. Let's start with the easy ones.

- **Corner Orientation**: There are a total of 7 corners that matter (as explained above). We will arbitrarily select one corner to always ignore. We simply will write the orientations of those 7 corners as a base-3 number.
  - ex. A corner orientation that can be represented as `[0,1,2,0,2,1,1,2]` would be written as $01202112_3$ (subscript meaning "base 3"). This can be converted into the base 10 number $1283$.
- **Edge Orientation**: Almost exactly the same as Corner Orientation. We will arbitrarily select one edge to always ignore, then write the orientation of the remaining 11 edges as a base-2 number.
- **Corner Permutation**: In order to encode corner permutation, we simply get a length-8 array of where all the corners are at, and encode it with it's Lehmer Code. Then, we can get it's Index as described above.
  - ex. A corner permutation may look like `[4,5,2,1,3,6,7,0]`. Then, we can obtain it's Lehmer Code and it's Index.
- **Edge Permutation**: Almost exactly the same as Corner Permutation. We will get the permutation of the edges as a length-12 array and encode it with the Lehmer Code to get its Index.

But once again, we forgot about Permutation Parity. However, in this case, it's not as simple to handle as it is before, by just dividing by 2. In this case, we have to carefully ensure each number we're encoding is valid and we still get a number between $0$ and $43,252,003,274,489,856,000 - 1$ with no duplicates.

The key observation that we have to make is that relative to the final answer, we can simply choose either Edge or Corner Permutation to handle normally. Then, we can use a special operation on the remaining choice (either Corner or Edge) to ensure that the remaining choice is only valid.

Let's choose the Edges to set arbitrarily and then use the Corners to ensure the edge/corner pair is valid. This choice will be [justified later](#why-do-we-cache-corners).

So, again, we have a permutation of just edges—an array of numbers from 0 to 11 (inclusive). With these numbers, we can determine the **parity** of this permutation. In our case, the easiest way is through Lehmer Codes as described above. We can assert that the parity of the Corners matches the parity we have just obtained for the Edges (since the input cubestate _should_ be valid).

So, instead of directly getting the Index of the Corner Permutation, we actually want to say, given the parity of the Edge Permutation, which index is the given Corner Permutation in the list of all permutations (ordered by their Index) with the _same parity_?

As an example, let's say we have a edge parity of even. Let's first get a list of all the Corner Permutations ordered by their Index. We will extract all the Permutations with that same parity of even. Now, we ask what is the index of our current corner permutation in that list?

This ensures that For every single Edge Permutation, we get a number for their Corner Permutation exactly between $0$ and $\frac{8!}{2} - 1$ instead of up to $8! - 1$ (which would give us numbers out of bound for the final cubestate _and_ a ton of invalid cubestates in those extra inflated numbers). Thus, by making this adjustment, we correctly adjusted for the fact that corner and edge parties have to match.

Now, we have 4 numbers. Let's call them $\text{CO}$, $\text{EO}$, $\text{CP}$, and $\text{EP}$ for the proper number we calculated above for each. In order to "combine" them into one number, we'll simply use a mixed-radix number for our final CubeCode to ensure it's losslessly unpackable later. Let's first define the maximums for each index since we'll need those as the radix.

```math
\text{CO}_\text{max} = 3^7 \\
\text{EO}_\text{max} = 2^{11} \\
\text{EP}_\text{max} = 12! \\
\text{CP}_\text{max} = \frac{8!}{2} \\
```

Note that we arbitrarily choose divide CP to divide by 2. The [programmatic reason is explained below](#why-do-we-cache-corners).

```math
\text{CubeCode} = (((((\text{EP} * \text{CP}_\text{max}) + \text{CP}) * \text{EO}_\text{max}) + \text{EO}) * \text{CO}_\text{max})+ \text{CO}
```

Note that the order in which we "encode" the variables is completely arbitrary.

And now, we have a perfect bijective CubeCode that is guaranteed to be between $0$ and $43,252,003,274,489,856,000 - 1$.

### Why do we Cache Corners?

You might be wondering how we are figuring out the index of a certain permutation in all the even permutations or the odd permutations. In order to do this, we will actually be caching every single possibility. We will use a forward map (an array of all even permutations and odd permutations in order) so we can quickly get the `i`th even or odd permutation (explained later in decoding) as well as a reverse map (a map of the index of the corner permutation of the corresponding parity). And in order to save space, we will store the Index of each permutation instead of the permutation itself since it's easily recoverable.

And now, it might be clearer why we are caching corners. Since $8!$ entries for each corner is **significantly** (in fact, 11,880 times smaller) than $12!$ entries for the edges, it's much more optimal to cache the corners! (Since the actual calculation of the Lehmer Index, parity, and so on is O(1) given the constant number of pieces). By having a forward and reverse map, both encoding and decoding can be O(1) too even with the parity issue.

### Going from CubeCode to cubestate

Now, let's tackle the reverse question, one known as "decoding" the CubeCode number back into a cubestate. Now, with all the heavy parity issues out of the way, this is rather simple. We will start by recovering the $\text{CO}$, $\text{EO}$, $\text{CP}$, and $\text{EP}$ variables. This can be done trivially by modding out and dividing in the reverse order that we "encoded" the variables.

Now, let's first handle the Orientations.

For Corner Orientation, we had stored it as a 7 digit base-3 number. We can easily recover those first 7 digits. However, we actually have 8 corners. Remember that the sums of the orientations of the corners is equal to 0 mod 3. With this, we can easily recover the last corner orientation.

Similarly for Edge Orientation, we can recover the 11 digit base-2 number and restore the last digit with the fact that the sum of all digits equals 0 mod 2.

Now, let's handle the Permutations.

Recall that the Edge Orientation is untampered with. Thus, we can restore the Lehmer Code from the Index and restore the permutation from the Lehmer code directly. During this process, let's take note of the parity of the EO through the parity of the sum of the Lehmer Code digits.

Note that the parity of the EO is the same as the parity of the CO.

Now, we have the Index for the Corner Orientation (let's call it `i` temporarily), as well as the parity of the CO. Recall that we encoded it as the index of the given Corner Permutation in the list of all permutations (ordered by their Index) with the _same parity_. Thus, we can simply find the correct Permutation by finding the $i$th permutation in the list of all Corner Permutations with the given parity. This can be done in O(1) with the forward map we made [above](#why-do-we-cache-corners). Since that permutation is stored as an Index, we can turn it back into a Lehmer Code and a Permutation.

Now, we have recovered the CO, EO, CP, and EP from our CubeCode.

### Summary

The process of encoding and decoding CubeCode and cubestates is not too difficult other than managing the parities of the permutations. While the current system is O(1) with caching, it does technically take O(N!) to generate said cache. If anyone wishes to contribute a constant time solution to this without caching, it would be very interesting to see.

Furthermore, it would be interesting to see how this could be applied to higher-order Rubik's cubes i.e. 4x4, 5x5, and so on. Likely, the former problem would have to be solved first before this could be done, so that the speed could be faster.