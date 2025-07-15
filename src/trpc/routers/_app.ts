import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `"hello" from server and "${opts.input.text}" from client`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;