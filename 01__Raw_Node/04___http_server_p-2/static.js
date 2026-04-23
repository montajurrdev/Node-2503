// Many web applications need to serve static assets like images, CSS files, Js files, or other resources.
// While http module doesn't have built-in static file serving tools like express's (express.static)

// we can implement it using the fs and path modules.

// if we use it without validation, attacker can access any file. So need validation

// VULNERABLE - Allows directory traversal
// const filePath = path.join(__dirname, 'public', req.url);
// Request: /../../../etc/passwd
// path = "/home/user/app/public/../../../etc/pass"

// Resolves to: /home/etc/passwd (outside public directory! in the system root folder)

// //  ../ mean go one folder up,  ./ mean stay hera

// path.resolve(), solve this problem.  removes all ../

// const safePath = path.resolve(publicDir, "." + reqPath);
// if (!safePath.startsWith(publicDir)) {
//   res.writeHead(403);
//   res.end("Forbidden");
//   return;
// }
// Starts with publicDir? "NO"  SO blocked

// why need ./   // Rule of path.resolve():
// If any argument starts with /, it becomes the root — everything before it is ignored.

// without "." , it become just req.url, an absolute path, not relative path.
// that just "/" is dangerous - it means start from system root. ignores publicDir
// that"s why need to add "."
// means stay inside public folder
// convert absolute → relative

// '.'+ reqPath  →  convert to relative path. string concatenation
// publicDir, '.' , reqPath → two argument. last one start with "/" . everything before ignored.
// it's a rules of path.resolve()

import { log } from "node:console";
import path from "node:path";
import fs from "node:fs";

import http from "http";

const publicDir = path.resolve(import.meta.dirname, "public");
// log(publicDir)

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf'
}


http
  .createServer((req, res) => {
    // Normalize the request path
    let reqPath = req.url === "/" ? "/index.html" : req.url; // ternary operator → short if-else

    // Strip query string - ?id=123 shouldn't affect file path
    reqPath = reqPath.split("?")[0]; // it breaks the string into parts: before ? and after ? .  result in array - ["/index.html", "id=123"], then we take first one [0]

    // resolve path and check it stays within publicDir
    const safePath = path.resolve(publicDir, "./" + reqPath); // string concatenation
    // log(safePath)

    // critical security check: ensure resolved path is within publicDir
    if (!safePath.startsWith(publicDir)) {
      res.writeHead(403, { "X-Content-Type-Options": "nosniff" }); // it's a js object. keys can be string. while json is a string entire
      res.end("Forbidden");
      return;
    }

    // CHeck if file exists and is actually a file(not a directory)

    // fs.stat() checks information about a file or path
    // it answers questions like, does this path exist?, is it a file?, is it a folder?, what is its size?
    fs.stat(safePath, (err, stat) => {
      // fs.stat(path, callback), callback have two argu error and stat=info
      if (err || !stat.isFile()) {
        // some err or even if path exists, but it is not a file. it's folder. result false
        res.writeHead(404, { "X-Content-Type-Options": "nosniff" });
        res.end("File not found");
        return;
      }

      // determine MIME type/content type from file extension
      const ext = path.extname(safePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      res.setHeader("Content-Type", contentType);
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.writeHead(200);

      // Stream file instead of loading into memory

      // if we use fs.readFile() → it load entire file into memory. big file crash server
      // that's why we use fs.createReadStream() → it read file chunk by chunk

      const stream = fs.createReadStream(safePath); // open file and start reading gradually
      stream.pipe(res);
      // what .pipe() does:  FIle → stream → res → browser
      // internally process stream.on('data'), and stream.on('end')

      // .pipe() does it automatically

      stream.on('error', ()=>{
        // File might be deleted between stat() and createReadStream()
        res.writeHead(500, { "X-Content-Type-Options": "nosniff" });
        res.end("Server error");
      })

    });
  })
  .listen(3000, "localhost");
