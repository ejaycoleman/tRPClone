import express from "express";
import bodyParser from "body-parser";
import { z } from "zod";

type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export type Get = {
  callback: () => JSONObject;
  type: "get";
};

export type Post = {
  callback: () => JSONObject;
  type: "post";
};

export const get = (getCallback: () => JSONObject): Get => {
  return {
    callback: () => {
      return getCallback();
    },
    type: "get",
  };
};

export const post = (postCallback: () => JSONObject): Post => {
  return {
    callback: () => {
      return postCallback();
    },
    type: "post",
  };
};

export const t = {
  get,
  post,
};

export const createHTTPServer = ({
  router,
}: {
  router: { [key: string]: Get | Post };
}) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

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
