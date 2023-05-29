import express from "express";

const router = <T>(routes: { [K in keyof T]: T[K] }) => {
  return routes;
};

export type Get = { callback: () => string | string[]; type: "get" }; // any valid route response
export type Post = { callback: () => string | string[]; type: "post" }; // any valid route response

const get = (getCallback: () => string | string[]): Get => {
  return { callback: getCallback, type: "get" };
};

const post = (getCallback: () => string | string[]): Post => {
  return { callback: getCallback, type: "post" };
};

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

const createHTTPServer = ({ router }: { router: { [key: string]: any } }) => {
  const app = express();

  Object.entries(router).map(([routeName, routeFunction]) => {
    app.get("/" + routeName, (req, res) => {
      res.send(routeFunction());
    });
  });

  return app;
};

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000, () => console.log("listening"));
