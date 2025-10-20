import { Transform } from "stream";

  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        // transformStream.emit('error',new Error('someting went wrong'))
      const upperCaseText = chunk.toString().toUpperCase();
      const replaceIpsum = upperCaseText.replaceAll(/ipsum/gi, "cool");
      callback(null, replaceIpsum);
    },
  });

  export {transformStream};