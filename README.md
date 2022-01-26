# RingCentral WSG Multiple Connections Test

Try to establish multiple WSG connections in an single process.

Two WSG connections in a single process works: [./src/index.ts](./src/index.ts)

But two WSG connections cannot share the same wsToken: [./src/index2.ts](./src/index2.ts).
