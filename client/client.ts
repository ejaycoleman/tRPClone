import type { AppRouter } from "../server/server";
import { createTRPCProxy } from "./library";

const createTRPCProxyClient = () => createTRPCProxy<AppRouter>();

const t = createTRPCProxyClient();

const query = async () => {
  const query = await t.getValues.query("value");
  console.log(query.data);
  const query2 = await t.secondGet.query("unused"); // TODO
  console.log(query2.data);
};

query();

const mutate = async () => {
  const query = await t.postValues.mutate({ name: "value" });
  console.log(query.data);
  const query2 = await t.post.mutate("unused"); // TODO
  console.log(query2.data);
};

mutate();
