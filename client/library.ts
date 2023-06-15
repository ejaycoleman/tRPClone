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
  [PropertyKey in keyof T]: T[PropertyKey] extends Get<infer Input> // is this correct?
    ? Query<Input>
    : T[PropertyKey] extends Post<infer Input>
    ? Mutate<Input>
    : unknown;
};

export const createTRPCProxy = <T>() => {
  return createFlatProxy((routeName: any) => {
    return createRecursiveProxy(({ path, args }: any) => {
      const pathCopy = [routeName, ...path];
      const procedureType = pathCopy.pop();

      if (procedureType === "query") {
        return axios.get(
          `http://localhost:3000/${routeName}?input=${encodeURIComponent(
            JSON.stringify(args[0])
          )}`
        );
      }

      return axios.post(`http://localhost:3000/${routeName}`, args[0]);
    });
  }) as unknown as OverwriteChildren<T>;
};
