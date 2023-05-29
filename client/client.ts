import type { AppRouter } from "../server/server";

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
  query: (param: number) => number;
};

type OverwriteChildren<T> = {
  [PropertyKey in keyof T]: Query;
};

const createTRPCProxy = <T>() => {
  return createFlatProxy((key: any) => {
    console.log(key); // the name of the route!

    return createRecursiveProxy(({ path, args }: any) => {
      console.log("asd");
      const pathCopy = [key, ...path];
      const procedureType = pathCopy.pop();

      console.log(procedureType);
      return console.log(args);
    });
  }) as unknown as OverwriteChildren<T>;
};

const createTRPCProxyClient = () => createTRPCProxy<AppRouter>();

const t = createTRPCProxyClient();

t.getValues.query(1);
