import express from "express";
import bodyParser from "body-parser";
import { z } from "zod";

type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export type Get<Input, Response extends Promise<JSONValue> | JSONValue> = {
  callback: (input?: Input) => Response;
  type: "get";
};

export type Post<Input, Response extends Promise<JSONValue> | JSONValue> = {
  callback: (input?: Input) => Response;
  type: "post";
};

export const get = <T, O extends Promise<JSONValue> | JSONValue>(
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

export const post = <T, O extends Promise<JSONValue> | JSONValue>(
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
  input: <T extends z.ZodType<any, any, any>>(inputValidation: T) => {
    type InputSchema = z.infer<typeof inputValidation>;

    return {
      get: <T extends JSONValue>(i: (input: InputSchema) => Promise<T> | T) => {
        return get(i, inputValidation);
      },
      post: <T extends JSONValue>(
        i: (input: InputSchema) => Promise<T> | T
      ) => {
        return post(i, inputValidation);
      },
    };
  },
  get: <T extends JSONValue>(getCallback: () => Promise<T> | T) =>
    get<"no_input", Promise<T> | T>(getCallback),
  post: <T extends JSONValue>(postCallback: () => Promise<T> | T) =>
    post<"no_input", Promise<T> | T>(postCallback),
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
      app.get("/" + routeName, async (req, res) => {
        if (req?.query.input) {
          const input = decodeURIComponent(req?.query.input as string);
          res.send(await routeFunction.callback(JSON.parse(input)));
        } else {
          res.send(await routeFunction.callback());
        }
      });
      return;
    }

    if (routeFunction.type == "post") {
      app.post("/" + routeName, async (req, res) => {
        res.send(await routeFunction.callback(req.body));
      });
      return;
    }
  });

  return app;
};
