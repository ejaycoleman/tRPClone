import { Get, Post } from "../server/library";
import axios, { AxiosResponse } from "axios";

const createInnerProxy = (callback: callbackType, path: any[]) => {
  const proxy: unknown = new Proxy(() => {}, {
    get(_obj, key) {
      return createInnerProxy(callback, [...path, key]);
    },
    apply(_1, _2, args) {
      return callback({
        args,
        path,
      });
    },
  });

  return proxy;
};

type callbackType = ({
  path,
  args,
}: {
  path: string[];
  args: string[];
}) => Promise<AxiosResponse<any, any>>;

const createRecursiveProxy = (callback: callbackType) =>
  createInnerProxy(callback, []);

type Query<Input, Response> = {
  query: Input extends "no_input"
    ? () => AxiosResponse<Response>
    : (param: Input) => AxiosResponse<Response>;
};

type Mutate<Input, Response> = {
  mutate: Input extends "no_input"
    ? () => AxiosResponse<Response>
    : (param: Input) => AxiosResponse<Response>;
};

type OverwriteChildren<T> = {
  [PropertyKey in keyof T]: T[PropertyKey] extends Get<
    infer Input,
    infer Response
  >
    ? Query<Input, Response>
    : T[PropertyKey] extends Post<infer Input, infer Response>
    ? Mutate<Input, Response>
    : unknown;
};

export const createTRPCProxy = <T>() => {
  return createRecursiveProxy(
    ({ path, args }: { path: string[]; args: string[] }) => {
      const routeName = path[0];
      const procedureType = path[path.length - 1];

      if (procedureType === "query") {
        const parsedArgs = args[0]
          ? `?input=${encodeURIComponent(JSON.stringify(args[0]))}`
          : "";

        return axios.get(`http://localhost:3000/${routeName}${parsedArgs}`);
      }

      return axios.post(`http://localhost:3000/${routeName}`, args[0]);
    }
  ) as OverwriteChildren<T>;
};
