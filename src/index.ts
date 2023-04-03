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
import path = require("node:path");

import handlers = require("./handlers.json");

const options: net.ListenOptions = {
  port: 8080,
  host: "localhost"
}

const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse): void => {
  try {
    if (req.url !== undefined) {
      let handlerPath: string;

      try {
        handlerPath = require.resolve(path.join(__dirname, "handlers", req.url));
      } catch (err: any) {
        if (err.code === "MODULE_NOT_FOUND") {
          res.statusCode = 400;
          res.setHeader("Content-Type", "text/plain");
          res.end("400 Bad Request\n");
          return;
        } else {
          throw err;
        }
      }

      if (handlers.some((element: string): boolean => handlerPath !== path.join(__dirname, "handlers", element))) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/plain");
        res.end("400 Bad Request\n");
        return;
      };

      require(handlerPath)(req, res);
    } else {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end("400 Bad Request\n");
    }
  } catch (err) {
    console.log(err);

    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("500 Internal Server Error\n");
  }
});

server.listen(options, (): void => {
  console.log(`Server listening at http://${options.host}:${options.port}/`);
});
