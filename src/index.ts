/*
 * index.ts
 * Copyright (C) 2023 Bennett Jann
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

"use strict";

import http = require("node:http");
import net = require("node:net");

interface Form {
  fname: string;
  lname: string;
}

const options: net.ListenOptions = {
  port: 8080,
  host: "localhost"
}

const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse): void => {
  if (req.method === "POST") {
    if (req.headers["content-type"] === "application/json") {
      let body: string = "";

      req.on("data", (chunk: Buffer | string | any): void => {
        body += chunk.toString();
      });

      req.on("end", (): void => {
        const form: Form = JSON.parse(body);

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(`Hello, ${form.fname} ${form.lname}!\n`);
      });

      req.on("error", (err: Error): void => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("500 Internal Server\n");
      });
    } else {
      res.statusCode = 415;
      res.setHeader("Content-Type", "text/plain");
      res.end("415 Unsupported Media Type\n");
    }
  } else {
    res.statusCode = 405;
    res.setHeader("Content-Type", "text/plain");
    res.end("405 Method Not Allowed\n");
  }
});

server.listen(options, (): void => {
  console.log(`Server listening at http://${options.host}:${options.port}/`);
});
