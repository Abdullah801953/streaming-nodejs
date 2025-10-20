// stream k matlab kise video ya audio ko strim karna nahi hota hai stream k aur bhee uses hai video aur audio ko stream karne k ilawa

// agar ham nodejs k andar kam kar rahe hai to ham jane ya anjane me stream ko use kar rahe hai ham nodejs js me jo http server create karte hai usme req aur response jo object hote hai ye stream hote hai ham inhe as stream use kar sakte hai, nodejs me jo tcp socket hote hai wo bhee stream hote hai, jo file k read aur wite hote hai wo bhee stream hai, zlib jo module hai wo bhee stream use karta hai, crypto module hai wo bhee stream use karta hai nodejs me jo stream hai wo heavenly use hota hai.

// ham stream ku use karte hai?
// =>stream ham use karte hai data ko transfer karne k leya
// =>jab bhee big data ho aur unhe agar process karna ho to ham unhe chote chote part me process kar sakte hai
// =>hamara ram jo hota hai wo bahut jyada expensive hota hai to jab big data hota hai unhe agar ham direct ram me load kare ge to hamre ram me memory kam par jaya ga aur performance slow ho jaya ga iss wajah se ham stream use kate hai aur data ko chote chote part me break kar k ram me store karte hai
// => data ko ek place se dusre place efficiently le jane k leya ham stream ka use karte hai

// example
// =>agar ham kise resturant me jate hai khana khane k leya to jab ham order karte hai to waiter k pass to option hai food serve karne k 1. ye to wo sare food ready ho jaya ge tabb ek saath sare food serve kare ge 2. ye to agar jo food ready ho gaya hai use serve kare ga aur jaise jaise food ready hota jaya ga waiter serve karta jaya ga ek ek kar k
// 2 option batter hai ku k agar hamare table par space nahi hai to sara khana ek bar nahi aa raha hai ek ek kar k food aa raha hai

// stream bhee same iss example k trah hai

// bad way=>hamare pass 2 file hai hame first file ko second wale file me copy karna hai iss k leya ham pahle apne first file ko main memory me load kare ge jo first file hai wo bahut big file hai iss wajah se hamre server crash ho jaya ga ye performance ko slow kar de ga.

// good way=> ham apne first file ko stream k madad se chunk me break kar dete hai readable stream k madad se aur iss chunk ko buffer me bhejte hai buffer(ye ek memory space hota jo hamare ram me hota hai jab ham stream create karte hai to nodejs iss hamre memory me automaticaly create karta hai jiss ke space ham fix kar sakte hai aur iss me binery me data store hota hai jaise agar ham ne buffer k space ko 1kb kar deya to iss se jyada data iss me store nahi ho sakta hai agar iss se jyada hua to  stream pause ho jaya ga) aur writablestream k madad se ham chunk by chunk apne file ko dusri file me copy kar dete hai efficient trike se ham direct pure big file nahi store karte

// ===========================================
// STREAMS KE TYPES:
// ===========================================
// 1. Readable Stream: Data read karne ke liye (fs.createReadStream)
// 2. Writable Stream: Data write karne ke liye (fs.createWriteStream)
// 3. Duplex Stream: Dono read/write kar sakte hain (net.Socket)
// 4. Transform Stream: Data modify kar sakte hain (zlib.createGzip)

// ===========================================
// STREAMS KE BENEFITS:
// ===========================================
// ✅ Memory Efficient - Chunks mein process karta hai
// ✅ Time Efficient - Data immediately process start ho jata hai
// ✅ Backpressure Handling - Automatic flow control
// ✅ Composable - Pipe method se multiple streams connect kar sakte hain

// ===========================================
// BACKPRESSURE CONCEPT:
// ===========================================
// Jab readable stream fast data produce kare aur writable stream slow ho
// To automatically pause ho jata hai - system crash nahi hota

// Example:
// readableStream.pipe(writableStream);
// Agar writableStream buffer full ho gaya to readableStream automatically pause ho jayega

import http from "http";
import fs from "fs";
// import { Transform } from "stream";
import { transformStream } from "./transformAndReplace.js";
import { pipeline } from "stream";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url !== "/") {
    return res.end();
  }
  // downloading big file bad way text file
  // const file = fs.readFileSync("sample.txt"); //Synchronous file read karta hai
  // res.end(file);
  // PROBLEM: Poori file memory mein load hogi, server block hoga

  // downloading big file bad way video file
  //   const file=fs.readFileSync("video.mp4");  //Synchronous file read karta hai
  //   res.writeHead(200,{"content-type":"video/mp4"});
  //   return res.end(file);
  // PROBLEM: Poori video RAM mein load hogi, server crash ho sakta hai

  //   copy big file bad way
  //   const file = fs.readFileSync("sample.txt");  //Synchronous file read karta hai
  //   fs.writeFileSync("output.txt", file);
  //   res.end();
  // PROBLEM: Source aur destination dono files poori memory mein load hongi

  // ================================
  // GOOD WAYS - Using Streams (Memory Efficient)
  // ================================

  // download big file good way using (stream) text file
  //   const readableStream=fs.createReadStream('sample.txt')
  //   readableStream.pipe(res)//pipe jo hai wo hamare data ko write kar deta hai writable stream me ku k ham jante hai k req aur res bhee stream hai req readable stream hai aur res writable stream hai
  // BENEFIT: File chunks mein transfer hogi, low memory usage

  // download big file good way using (stream) video file
  //   const readableStream = fs.createReadStream("video.mp4");
  //   res.writeHead(200, { "content-type": "video/mp4" });
  //   return readableStream.pipe(res);
  // BENEFIT: Video streaming possible, client video play karna start kar sakta hai without waiting for complete download

  //   copy big file good way
  //   const readableStream = fs.createReadStream("sample.txt");
  //   const writableStream = fs.createWriteStream("output.txt");

  //   readableStream.on("data", (chunk) => {
  //     writableStream.write(chunk);
  //   });
  // BENEFIT: Chunks mein copy hogi, memory efficient

  // string processing transformation
  const readableStream = fs.createReadStream("sample.txt");
  const writableStream = fs.createWriteStream("output.txt");

  // readableStream.on("data", (chunk) => {//ham itna sara code nahi likh kar sirf pipe ke madad se writable stream me data write kar sakte hai kuch iss trah readableStream.pipe(writableStream) transform karne k leya data par ham transform built in method import kar k use kare ga
  //   const upperCaseText = chunk.toString().toUpperCase();
  //   const replaceIpsum = upperCaseText.replaceAll(/ipsum/gi, "cool");
  //   writableStream.write(replaceIpsum);
  // });

  // const transformStream = new Transform({
  //   transform(chunk, encoding, callback) {
  //     const upperCaseText = chunk.toString().toUpperCase();
  //     const replaceIpsum = upperCaseText.replaceAll(/ipsum/gi, "cool");
  //     callback(null, replaceIpsum);
  //   },
  // });

  // jo bhee data ham ne read keya use pipe k madad se transformstream ko pass kar deya aur transformstream ko pipe k madad se writestream ko bhej deya
  // pipe ka rule hai k left side wali readable stream ho ge aur left side wali writable stream ho ge jaise readableStream() ye readable stream hai aur .pip(transformstream) ye writable stream hai
  // transform stream readable aur writable dono hai

  // readableStream.pipe(transformStream).pipe(writableStream);

  // ham jo transform module se jo transform create keya hai use ham alag se saperate file me create kar k import kar sakte hai file name transformAndReplace.js

  // readableStream.pipe(transformStream).pipe(writableStream)

  // agar error aa gaya kise bhee stream me to memory leak ho sakta hai to ham har stram par error handling add kar sakte hai

  // par iss ka ek drawback hai agar kise bhee stream me error aa gaya to ham manually jaa kar stream ko close karna pare ga jo keya bahut muskil hai iss leya ham pipeline module use karte hai

  // readableStream
  //   .on("error", (err) => {
  //     console.log(err);
  //   })
  //   .pipe(transformStream)
  //   .on("error", (err) => {
  //     console.log(err);
  //   })
  //   .pipe(writableStream)
  //   .on("error", (err) => {
  //     console.log(err);
  //   });

// pipeline error handling
// pipeline jo hai wo sare stream par error handling add kar de ga aur agar error atta hai kise bhee stream par to to automatically khud he stream process cancle kar de ga hame manually nahi karna ho ga cancle;
pipeline(readableStream,
  transformStream,
  writableStream,
  (err)=>{
    if(err){
      console.log('error handling here..',err);
    }
  }
)

  res.end();
});

server.listen(PORT, () => {
  console.log("server listening on port", PORT);
});
