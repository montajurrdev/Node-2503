import { log } from "node:console";
import http from "node:http";

// accept data from client through post request
// http module requires manual parsing of request bodies, which are received as streams.
// POST req bodies arrive as a streams. not all at once
// it comes in chunks

// So, need to collect all chunks/data first,  then parse JSON

// http
//   .createServer((req, res) => {
// in raw node, req.body does not exist automatically. Because node's native http module gives a low-level request stream, not a parsed body object.
// The request is a Readable Stream. So body data arrives over time in chunks.
// we need to read the request and combines chunks, parses JSON, then create req.body

// Because node is low-level and flexible.

// express make this complex process inside when we run app.use(express.json())

// req is an EventEmitter + Stream
// req.on()   can access stream data   it's http.IncomingMessage

// if (req.method === "POST" && req.url === "/register") {
//   let body = ""; // need to make body

//   req.on("data", (chunk) => {
//     body += chunk.toString();
//   });

//   req.on("end", () => {
//     const data = JSON.parse(body); // now body is complete to use
//     log(data);

//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(
//       JSON.stringify({
//         message: "USer Registered",
//         user: data,
//       }),
//     );
//   });
// }

//   })
//   .listen(3000, "localhost");

//
//
// validate, parse, error handle, and post handle

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url === "/books") {
      const MAX_BODY = 1 * 1024 * 1024; // 1MB limit prevent memory exhaustion
      return new Promise((resolve, reject) => {
        let body = "";
        let received = 0;

        // validate content type before processing → req content
        const contentType = req.headers["content-type"] || "";
        if (!contentType.startsWith("application/json")) {
          res.writeHead(415, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Unsupported Content-Type" }));
          return reject(new Error("Unsupported Content-Type"));
        }

        // Collect data chunks
        req.on("data", (chunk) => {
          received += chunk.length;

          // Prevent memory exhaustion from huge payloads
          if (received > MAX_BODY) {
            res.writeHead(413, { "COntent-Type": "application/json" });
            res.end(JSON.stringify({ error: "Payload too large" }));
            req.destroy(); // stop receiving more data
            return reject(new Error("Payload too large"));
          }
          body += chunk.toString(); // convert Buffer to string
        });

        //
        // All chunks received, Now parse
        req.on("end", () => {
          try {
            if (!body) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Empty request body" }));
              return reject(new Error("Empty request body"));
            }
            const data = JSON.parse(body);

            // Validate it's an object (not a string, number, etc)
            if(typeof data !== 'object' || data === null || Array.isArray(data)){   // Array.isArray(data)  is a js method used to determine whether the passed value is an Array or not. if it's an Array, it return true, otherwise false.
              res.writeHead(400, {'Content-Type': 'application/json'});
              return res.end(JSON.stringify({error: "Invalid JSON object"}))
              return reject(new Error('Invalid JSON object'))

            }
            resolve(data);
            log(data)

          } catch (parseError) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Malformed JSON" }));
            console.error("JSON parse error:", parseError.message);
          }
        });

        req.on('error', (error)=>{
          console.error('Request error:', error.message);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Request error" }));

        })
      });
    }
  })
  .listen(3000, "localhost");

  
