import express from "express";

// type RouteType = () => string | string[]; // any valid route response

const router = <T>(routes: { [K in keyof T]: T[K] }) => {
  return routes;
};

// export type Get = <T>(V: T) => T;
export type Get = () => string | string[]; // any valid route response
export type Post = () => string | string[]; // any valid route response

const get = (getCallback: Get) => {
  return getCallback;
};

// export type Post = <T>(V: T) => T;

const post = (getCallback: Post) => {
  return getCallback;
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

// appRouter.

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
