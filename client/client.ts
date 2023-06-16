import type { AppRouter } from "../server/server";
import { createTRPCProxy } from "./library";

const t = createTRPCProxy<AppRouter>();

const query = async () => {
  const query = await t.getValues.query("value");
  console.log(query.data);
  const query2 = await t.secondGet.query();
  console.log(query2.data);
};

query();

const mutate = async () => {
  const query = await t.postValues.mutate({ name: "value" });
  console.log(query.data);
  const query2 = await t.post.mutate();
  console.log(query2.data);
};

mutate();
