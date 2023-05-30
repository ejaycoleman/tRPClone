import type { AppRouter } from "../server/server";
import { createTRPCProxy } from "./library";

const createTRPCProxyClient = () => createTRPCProxy<AppRouter>();

const t = createTRPCProxyClient();

const query = async () => {
  const query = await t.getValues.query("test");
  console.log(query.data);
};

// query();
// t.postValues.mutate("Two");

const mutate = async () => {
  const query = await t.postValues.mutate("test");
  console.log(query.data);
};

mutate();
