import { createTRPCRouter } from "./trpc";
import { pollRouter } from "./routers/pollRouter";

export const appRouter = createTRPCRouter({
  poll: pollRouter,
});

export type AppRouter = typeof appRouter;
