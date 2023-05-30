import { createHTTPServer, get, post, router } from "./library";

const appRouter = router({
  getValues: get(() => {
    console.log("get endpoint hit!");
    return ["get res"];
  }),
  postValues: post(() => {
    console.log("post endpoint hit!");
    return ["post res"];
  }),
});

export type AppRouter = typeof appRouter; // for client

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000, () => console.log("listening"));
