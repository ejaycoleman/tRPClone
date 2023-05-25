// import { stripVTControlCharacters } from "util";
// import type { AppRouter } from "../server/server";

// const handler = {
//   get() {
//     return "world";
//   },
// };

// const proxy2 = new Proxy(() => {}, handler);

// const wrapFunctions = <T>() => proxy2;

// const t = wrapFunctions<AppRouter>;

// const main = () => {};

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

const createTRPCProxy = () => {
  return createFlatProxy((key: any) => {
    console.log(key); // the name of the route!

    return createRecursiveProxy(({ path, args }: any) => {
      console.log("asd");
      const pathCopy = [key, ...path];
      const procedureType = pathCopy.pop();

      console.log(procedureType);

      // const fullPath = pathCopy.join(".");

      // return procedureType(fullPath, ...args);
      return console.log(args);
    });
  });
};

const createTRPCProxyClient = () => createTRPCProxy();

const t = createTRPCProxyClient() as any;

t.idk.letgo("asd");
