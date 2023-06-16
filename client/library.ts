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

const createFlatProxy = (callback: (routeName: string) => unknown) => {
  return new Proxy(() => {}, {
    get(_obj, name) {
      return callback(name as any);
    },
  });
};

type Query<T> = {
  query: T extends "no_input"
    ? () => AxiosResponse
    : (param: T) => AxiosResponse;
};

type Mutate<T> = {
  mutate: T extends "no_input"
    ? () => AxiosResponse
    : (param: T) => AxiosResponse;
};

type OverwriteChildren<T> = {
  [PropertyKey in keyof T]: T[PropertyKey] extends Get<infer Input>
    ? Query<Input>
    : T[PropertyKey] extends Post<infer Input>
    ? Mutate<Input>
    : unknown;
};

export const createTRPCProxy = <T>() => {
  return createFlatProxy((routeName: string) => {
    return createRecursiveProxy(
      ({ path, args }: { path: string[]; args: string[] }) => {
        const pathCopy = [routeName, ...path];
        const procedureType = pathCopy.pop();
        if (procedureType === "query") {
          const parsedArgs = args[0]
            ? `?input=${encodeURIComponent(JSON.stringify(args[0]))}`
            : "";

          return axios.get(`http://localhost:3000/${routeName}${parsedArgs}`);
        }

        return axios.post(`http://localhost:3000/${routeName}`, args[0]);
      }
    );
  }) as unknown as OverwriteChildren<T>;
};
