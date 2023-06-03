import express, { Request } from "express";
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
  callback: (input?: T) => string | string[];
  type: "get";
};
export type Post = {
  callback: (req?: JSONValue) => string | string[];
  type: "post";
};

// export const get = (
//   getCallback: (req?: JSONValue) => string | string[]
// ): Get => {
//   return { callback: getCallback, type: "get" };
// };

export const get = <T>(
  getCallback: (input?: T) => string | string[],
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

export const post = (
  getCallback: (req?: JSONValue) => string | string[]
): Post => {
  return { callback: getCallback, type: "post" };
};

// const get = () => 'get'

const mySchema = z.string();

export const t = {
  input: <T extends z.ZodType<any, any, any>>(callback: T) => {
    type InputSchema = z.infer<typeof callback>;

    return {
      get: (i: (input: InputSchema) => string) => {
        // console.log(i);
        // callback.parse(i);
        return get(i, callback);
      },
    };
  },
  get,
};

// const idk = t.input(z.string()).getFunction(() => "asssdd");

export const createHTTPServer = ({
  router,
}: {
  router: { [key: string]: Get<any> | Post };
}) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  Object.entries(router).map(([routeName, routeFunction]) => {
    if (routeFunction.type == "get") {
      app.get("/" + routeName, (req, res) => {
        const input = decodeURIComponent(req?.query.input as string);
        res.send(routeFunction.callback(JSON.parse(input)));
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
