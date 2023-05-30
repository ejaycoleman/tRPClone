import { createHTTPServer, get, post, router } from "./library";

const appRouter = router({
  getValues: get((input) => {
    console.log("get endpoint hit!");

    return `GET called with the args: ${JSON.stringify(input)}`;
  }),
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
