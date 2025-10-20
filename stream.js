import { Readable, Writable } from "stream";

// custom writable stream
// const writableStream = new Writable({
//   write(s) {
//     console.log("writing", s.toString());
//   },
// });

// custom readable stream
// const readableStream = new Readable({
//   highWaterMark: 2,
//   read() {},
// });

// readableStream.on("data", (chunk) => {
//   writableStream.write(chunk);
//   console.log("reading",chunk.toString());
// });

// readableStream.push("hello from coder gyan");
