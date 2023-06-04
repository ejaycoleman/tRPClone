import type { AppRouter } from "../server/server";
import { createTRPCProxy } from "./library";

const createTRPCProxyClient = () => createTRPCProxy<AppRouter>();

const t = createTRPCProxyClient();

const query = async () => {
  const query = await t.getValues.query("value");
  console.log(query.data);
};

query();

const mutate = async () => {
  const query = await t.postValues.mutate({ name: "value" });
  console.log(query.data);
};

mutate();
