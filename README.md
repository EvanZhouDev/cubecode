# CubeCode

> A way to store data in Rubik's cubes

The fundamental idea behind CubeCode is to make a function to somehow take each of the $43,252,003,274,489,856,000$ states on a Rubik's cube and to map it to a single number from $0$ to $43,252,003,274,489,856,000 - 1$. And furthermore, to have an inverse function that takes such a number and maps it back to a Rubik's cube state.

There are various challenges that are associated with this, particularly the fact that the corner permutation and edge permutation must have matching parities, making the encoding and decoding of those two values dependent on each other.