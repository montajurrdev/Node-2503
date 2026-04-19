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

http.createServer((req,res)=>{
    if(req.method === "POST" && req.url === "/books"){
        
    }

}).listen(3000,"localhost")