import { createHTTPServer, t } from "./library";

const appRouter = {
  getValues: t.get(() => {
    console.log("get endpoint hit!");
    return { res: `GET called` };
  }),
  post: t.post(() => {
    console.log("post endpoint hit!");
    return { ret: "POST hit" };
  }),
};

export type AppRouter = typeof appRouter; // for client

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000, () => console.log("listening"));
