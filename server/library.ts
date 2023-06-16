import express from "express";
import bodyParser from "body-parser";
import { z } from "zod";

export const router = <T>(routes: { [K in keyof T]: T[K] }) => {
  return routes;
};

type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export type Get<T> = {
  callback: (input?: T) => JSONObject;
  type: "get";
};

export type Post<T> = {
  callback: (input?: T) => JSONObject;
  type: "post";
};

export const get = <T>(
  getCallback: (input?: T) => JSONObject,
  validate?: z.ZodType<any, any, any>
): Get<T> => {
  return {
    callback: (input) => {
      validate?.parse(input);
      return getCallback(input);
    },
    type: "get",
  };
};

export const post = <T>(
  postCallback: (input?: T) => JSONObject,
  validate?: z.ZodType<any, any, any>
): Post<T> => {
  return {
    callback: (input) => {
      validate?.parse(input);
      return postCallback(input);
    },
    type: "post",
  };
};

export const t = {
  input: <T extends z.ZodType<any, any, any>>(callback: T) => {
    type InputSchema = z.infer<typeof callback>;

    return {
      get: (i: (input: InputSchema) => JSONObject) => {
        return get(i, callback);
      },
      post: (i: (input: InputSchema) => JSONObject) => {
        return post(i, callback);
      },
    };
  },
  get: get<"no_input">,
  post: post<"no_input">,
};

export const createHTTPServer = ({
  router,
}: {
  router: { [key: string]: Get<any> | Post<any> };
}) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  Object.entries(router).map(([routeName, routeFunction]) => {
    if (routeFunction.type == "get") {
      app.get("/" + routeName, (req, res) => {
        if (req?.query.input) {
          const input = decodeURIComponent(req?.query.input as string);
          res.send(routeFunction.callback(JSON.parse(input)));
        } else {
          res.send(routeFunction.callback());
        }
      });
      return;
    }

    if (routeFunction.type == "post") {
      app.post("/" + routeName, (req, res) => {
        res.send(routeFunction.callback(req.body));
      });
      return;
    }
  });

  return app;
};
