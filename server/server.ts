import express from "express";

type RouteType = () => string | string[]; // any valid route response

const router = <T>(routes: { [K in keyof T]: RouteType }) => {
  return routes;
};

const get = <T>(getCallback: T) => {
  return getCallback;
};

const appRouter = router({
  getValues: get(() => {
    console.log("get endpoint hit!");
    return ["get res"];
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
