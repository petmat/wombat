import { flow, pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { createServer, listen, Request, Response } from "./server";

const host = "localhost";
const port = 8090;

const start = flow(createServer, listen({ port, host }));

const logServerStarted = () => {
  console.log(`Server is running on http://${host}:${port}`);
};

start()().then(E.fold(console.error, logServerStarted));
