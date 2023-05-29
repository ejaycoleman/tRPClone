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
  query: (param: number) => number;
};

type Mutate = {
  mutate: (param: number) => number;
};

// type Idk = <T>{[PropertyKey in keyof T]: Get | Post}

type OverwriteChildren<T extends AppRouter> = {
  [PropertyKey in keyof T]: T[PropertyKey] extends Post
    ? Query
    : T[PropertyKey] extends Get
    ? Mutate
    : unknown;
};

// type Idk = [PropertyKey in keyof T]: Get

const createTRPCProxy = <T extends AppRouter>() => {
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

// const a: AppRouter
// t.
// a.

// t.

// t.
// t.

// t.
// t.getValues.
// t.
// t.

// t.getValues

// const a: OverwriteChildren<AppRouter> = {} as any;
// a.

// t.getValues.query(1);

// type One = () => void;
// type Two = () => void;

// type Infer<T> = T extends One ? string : T extends Two ? number : unknown;

// const a: Infer<
// t.
// t.postValues
// t.getValues.query();
// t.postValues.mu
// t.
// t.
// t.
// t.getValues.mutate
// t.

// t.
// t.getValues.query();

// t.postValues.
// t.getValues.mutate
// t.
// t.postValues.
// t.
