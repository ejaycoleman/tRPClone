import type { AppRouter } from "../server/server";
import { createTRPCProxy } from "./library";

const createTRPCProxyClient = () => createTRPCProxy<AppRouter>();

const t = createTRPCProxyClient();

t.getValues.query("test");
t.postValues.mutate("Two");
