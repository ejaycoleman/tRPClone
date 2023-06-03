import { createHTTPServer, get, post, router, t } from "./library";
import { z } from "zod";

const appRouter = router({
  // getValues: get((input) => {
  //   console.log("get endpoint hit!");

  //   return `GET called with the args: ${JSON.stringify(input)}`;
  // }),
  getValues: t
    .input(z.string())
    .get((input) => `GET called with the args: ${JSON.stringify(input)}`),
  secondGet: t.get((a) => `GET!`),
  postValues: post((input) => {
    console.log("post endpoint hit!");

    return `POST request with body: ${JSON.stringify(input)}`;
  }),
});

export type AppRouter = typeof appRouter; // for client

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000, () => console.log("listening"));
