import express from "express";

export const router = <T>(routes: { [K in keyof T]: T[K] }) => {
  return routes;
};

export type Get = { callback: () => string | string[]; type: "get" };
export type Post = { callback: () => string | string[]; type: "post" };

export const get = (getCallback: () => string | string[]): Get => {
  return { callback: getCallback, type: "get" };
};

export const post = (getCallback: () => string | string[]): Post => {
  return { callback: getCallback, type: "post" };
};

export const createHTTPServer = ({
  router,
}: {
  router: { [key: string]: Get | Post };
}) => {
  const app = express();

  Object.entries(router).map(([routeName, routeFunction]) => {
    if (routeFunction.type == "get") {
      app.get("/" + routeName, (req, res) => {
        res.send(routeFunction.callback());
      });
      return;
    }

    if (routeFunction.type == "post") {
      app.post("/" + routeName, (req, res) => {
        res.send(routeFunction.callback());
      });
      return;
    }
  });

  return app;
};
