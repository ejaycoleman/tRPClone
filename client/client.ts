import type { AppRouter } from "../server/server";
import { createTRPCProxy } from "./library";

const createTRPCProxyClient = () => createTRPCProxy<AppRouter>();

const t = createTRPCProxyClient();

const query = async () => {
  const query = await t.getValues.query({ get: "value" });
  console.log(query.data);
};

query();

const mutate = async () => {
  const query = await t.postValues.mutate({ post: "value" });
  console.log(query.data);
};

mutate();
