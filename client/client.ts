import type { AppRouter, Get, Post } from "../server/server";

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
  query: (param: string) => void;
};

type Mutate = {
  mutate: (param: string) => string;
};

type OverwriteChildren<T> = {
  [PropertyKey in keyof T]: T[PropertyKey] extends Get
    ? Query
    : T[PropertyKey] extends Post
    ? Mutate
    : unknown;
};

const createTRPCProxy = <T>() => {
  return createFlatProxy((routeName: any) => {
    return createRecursiveProxy(({ path, args }: any) => {
      const pathCopy = [routeName, ...path];
      const procedureType = pathCopy.pop();

      if (procedureType === "query") {
        return console.log(
          "GET ",
          `localhost:3000/${routeName}?args=${args[0]}`
        );
      }

      return console.log(
        "POST ",
        `localhost:3000/${routeName} with {args: ${args[0]}}`
      );
    });
  }) as unknown as OverwriteChildren<T>;
};

const createTRPCProxyClient = () => createTRPCProxy<AppRouter>();

const t = createTRPCProxyClient();

t.getValues.query("test");
t.postValues.mutate("Two");
