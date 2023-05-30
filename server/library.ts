import express, { Request } from "express";

export const router = <T>(routes: { [K in keyof T]: T[K] }) => {
  return routes;
};

export type Get = {
  callback: (req?: Request) => string | string[];
  type: "get";
};
export type Post = {
  callback: (req?: Request) => string | string[];
  type: "post";
};

export const get = (getCallback: (req?: Request) => string | string[]): Get => {
  return { callback: getCallback, type: "get" };
};

export const post = (
  getCallback: (req?: Request) => string | string[]
): Post => {
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
        res.send(routeFunction.callback(req));
      });
      return;
    }

    if (routeFunction.type == "post") {
      app.post("/" + routeName, (req, res) => {
        console.log(req);
        res.send(routeFunction.callback(req));
      });
      return;
    }
  });

  return app;
};
