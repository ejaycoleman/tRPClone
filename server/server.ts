// Example based on https://github.com/trpc/trpc/tree/main/examples/minimal

import { z } from "zod";
import { db } from "./db";
import { createHTTPServer, router, t } from "../library/server";

const appRouter = router({
  userList: t.get(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const users = await db.user.findMany();
    //    ^?
    return users;
  }),
  userById: t.input(z.string()).get(async (input) => {
    // Retrieve the user with the given ID
    const user = await db.user.findById(input);
    return user || "not found";
  }),
  userCreate: t.input(z.object({ name: z.string() })).post(async (input) => {
    // Create a new user in the database
    const user = await db.user.create(input);
    //    ^?
    return user;
  }),
});

// Export type router type signature, NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000, () => console.log("listening"));
