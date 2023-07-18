// Example based on https://github.com/trpc/trpc/tree/main/examples/minimal

import { createTRPCProxy } from "../library/client";
import type { AppRouter } from "../server/server";

const trpc = createTRPCProxy<AppRouter>();

async function main() {
  /**
   * Inferring types
   */
  const users = await trpc.userList.query();

  // trpc.userList.query;
  console.log("Users:", users.data);

  const createdUser = await trpc.userCreate.mutate({ name: "sachinraja" });
  console.log("Created user:", createdUser.data);

  const user = await trpc.userById.query("1");
  console.log("User 1:", user.data);
}

main().catch(console.error);
