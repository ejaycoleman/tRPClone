import { createHTTPServer, router, t } from "./library";
import { z } from "zod";

const appRouter = router({
  getValues: t.input(z.string()).get((input) => ({
    res: `GET called with the args: ${JSON.stringify(input)}`,
  })),
  secondGet: t.get(() => ({ res: `GET!` })),
  post: t.post(() => {
    console.log("post endpoint hit!");
    return { ret: "POST hit" };
  }),
  postValues: t.input(z.object({ name: z.string() })).post((input) => {
    console.log("post endpoint hit!");
    return { res: `POST hit with ${input.name}` };
  }),
});

export type AppRouter = typeof appRouter; // for client

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000, () => console.log("listening"));
