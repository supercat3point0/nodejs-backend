"use strict";
const http = require("http");
const hostname = "localhost";
const port = 8080;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "test/plain");
    res.end("Hello, World!");
});
server.listen(port, hostname, () => {
    console.log(`Server listening at http://${hostname}:${port}/`);
});
