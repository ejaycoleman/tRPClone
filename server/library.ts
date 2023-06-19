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

export type Get<Input, Response extends JSONObject> = {
  callback: (input?: Input) => Response;
  type: "get";
};

export type Post<Input, Response extends JSONObject> = {
  callback: (input?: Input) => Response;
  type: "post";
};

export const get = <T, O extends JSONObject>(
  getCallback: (input?: T) => O,
  validate?: z.ZodType<any, any, any>
): Get<T, O> => {
  return {
    callback: (input) => {
      validate?.parse(input);
      return getCallback(input);
    },
    type: "get",
  };
};

export const post = <T, O extends JSONObject>(
  postCallback: (input?: T) => O,
  validate?: z.ZodType<any, any, any>
): Post<T, O> => {
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
      get: <T extends JSONObject>(i: (input: InputSchema) => T) => {
        return get(i, callback);
      },
      post: <T extends JSONObject>(i: (input: InputSchema) => T) => {
        return post(i, callback);
      },
    };
  },
  get: <T extends JSONObject>(getCallback: () => T) =>
    get<"no_input", T>(getCallback),
  post: <T extends JSONObject>(postCallback: () => T) =>
    post<"no_input", T>(postCallback),
};

export const createHTTPServer = ({
  router,
}: {
  router: { [key: string]: Get<any, any> | Post<any, any> };
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
