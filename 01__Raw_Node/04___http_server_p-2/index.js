import { log } from "node:console";
import http from "node:http";

const host = "localhost";
const port = 3000;

// managing routes, different routes response different data

// two data books and author
const books = JSON.stringify([
  { title: "the Alchemist", author: "Poulo Coelho", year: 1988 },
  { title: "The Prophet", author: "Kahlil Gibran", year: 1923 },
]);

const authors = JSON.stringify([
  { name: "Paulo Coelho", countryOfBirth: "Brazil", yearOfBirth: 1947 },
  { name: "Kahlil Gibran", countryOfBirth: "Lebanon", yearOfBirth: 1883 },
]);

const requestListener = function (req, res) {
  // normally it's root dir
  //   res.end("hello");

  // header is sent first, then data, write before sending data
  res.setHeader("Content-Type", "application/json");

  // switch(req.url){
  //     case "/":
  //         res.writeHead(200);
  //         res.end("Hello")
  //         break;

  //     case "/books":
  //         res.writeHead(200);
  //         res.end(books);
  //         break;
  //     case "/authors":
  //         res.writeHead(200);
  //         res.end(authors)
  //         break;

  //     default:
  //         res.writeHead(404);
  //         res.end(JSON.stringify({error: "resource not found"}));
  //         break;
  // }

  // there is issue. req.url is a raw string that includes everything after that domain - path, query string, and fragment. /books?id=123 - it break routing.
  // it's a string matching method

  // we can solve this issue with url api.

  const host = req.headers.host || "localhost:3000";
  const url = new URL(req.url, `http://${host}`);

  switch (url.pathname) {
    case "/books":
      // Validate http method
      if (req.method !== "GET") {
        res.writeHead(405, { Allow: "GET" });
        return res.end(JSON.stringify({ error: "Method not allowed" }));
      }

      res.writeHead(200);
      return res.end(books);

    case '/authors':
      if(req.method !== 'GET'){
        res.writeHead(405, {"allow": 'GET'});
        return res.end(JSON.stringify({error: 'Method not allowed'}))
      }
      res.writeHead(200);
      res.end(authors)

    default:
      res.writeHead(404);
      return res.end(JSON.stringify({error: 'Resource not found'}));
  }
};

// create server and start
http.createServer(requestListener).listen(port, host);
