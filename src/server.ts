import http from "http";

import { flow, pipe } from "fp-ts/function";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { prop } from "./utils";

export interface Request {
  url: string;
}

export interface Response {
  body: string;
}

export interface ServerConfiguration {
  host: string;
  port: number;
}

export interface Route {
  url: string;
  handler: (req: Request) => TE.TaskEither<Error, Response>;
}

const requestListener =
  (routes: Route[]) =>
  (req: Request): TE.TaskEither<Error, Response> => {
    const matchingRoute = routes.find((route) => route.url === req.url);
    if (matchingRoute) {
      return matchingRoute.handler(req);
    }
    return TE.tryCatch(
      () => {
        return Promise.resolve({
          status: 200,
          headers: [],
          body: "yolo",
        });
      },
      (reason) => new Error(String(reason))
    );
  };

export const createServer = (routes: Route[]) =>
  http.createServer((req, res) => {
    pipe(
      req,
      requestListener(routes),
      TE.map(prop("body")),
      TE.fold((e) => T.of(e.message), T.of)
    )().then((response) => {
      res.end(response);
    });
  });

export const listen = (config: ServerConfiguration) => (server: http.Server) =>
  TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        server.listen(config.port, config.host, () => {
          resolve();
        });
        server.once("error", (err) => {
          reject(err);
        });
      }),
    (reason) => new Error(String(reason))
  );
