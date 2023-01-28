import http from "http";

import { flow, pipe } from "fp-ts/function";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { prop } from "./utils";

export interface Request {}

export interface Response {
  body: string;
}

export type RequestListener = (req: Request) => TE.TaskEither<Error, Response>;

export interface ServerConfiguration {
  host: string;
  port: number;
}

const requestListener = (req: Request): TE.TaskEither<Error, Response> =>
  TE.tryCatch(
    () =>
      Promise.resolve({
        status: 200,
        headers: [],
        body: "yolo",
      }),
    (reason) => new Error(String(reason))
  );

export const createServer = () =>
  http.createServer((req, res) => {
    pipe(
      req,
      requestListener,
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
