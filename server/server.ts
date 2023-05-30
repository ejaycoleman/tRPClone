import { createHTTPServer, get, post, router } from "./library";

const appRouter = router({
  getValues: get((req) => {
    console.log("get endpoint hit!");

    const arg = req?.query.args;

    return `GET called with the args: ${arg}`;
  }),
  postValues: post((req) => {
    console.log("post endpoint hit!");

    const obj = JSON.stringify(req?.body);

    return `POST request with body: ${obj}`;
  }),
});

export type AppRouter = typeof appRouter; // for client

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000, () => console.log("listening"));
