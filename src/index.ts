import { flow, pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { createServer, listen, Request, Response } from "./server";

const host = "localhost";
const port = 8090;

const routes = [
  { url: "hello", handler: (req: Request) => TE.of({ body: "HELLO" }) },
];

const start = () => pipe(routes, createServer, listen({ port, host }));

start()().then(
  E.fold(console.error, () =>
    console.log(`Server is running on http://${host}:${port}`)
  )
);
