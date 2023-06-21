import type { AppRouter } from "../server/server";
import { createTRPCProxy } from "./library";

const t = createTRPCProxy<AppRouter>();

const query = async () => {
  const query = await t.getValues.query();
  console.log(query.data);
};

query();

const mutate = async () => {
  const query = await t.post.mutate();
  console.log(query.data);
};

mutate();
