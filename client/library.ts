import { Get, Post } from "../server/library";
import axios, { AxiosResponse } from "axios";

const createInnerProxy = (callback: any, path: any[]) => {
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

const createRecursiveProxy = (callback: any) => createInnerProxy(callback, []);

const createFlatProxy = (callback: any) => {
  return new Proxy(() => {}, {
    get(_obj, name) {
      return callback(name as any);
    },
  });
};

type Query = {
  query: (param: string) => AxiosResponse;
};

type Mutate = {
  mutate: (param: string) => AxiosResponse;
};

type OverwriteChildren<T> = {
  [PropertyKey in keyof T]: T[PropertyKey] extends Get
    ? Query
    : T[PropertyKey] extends Post
    ? Mutate
    : unknown;
};

export const createTRPCProxy = <T>() => {
  return createFlatProxy((routeName: any) => {
    return createRecursiveProxy(({ path, args }: any) => {
      const pathCopy = [routeName, ...path];
      const procedureType = pathCopy.pop();

      if (procedureType === "query") {
        return axios.get(`http://localhost:3000/${routeName}?args=${args[0]}`);
      }

      return axios.post(`http://localhost:3000/${routeName}`, {
        args: args[0],
      });
    });
  }) as unknown as OverwriteChildren<T>;
};
