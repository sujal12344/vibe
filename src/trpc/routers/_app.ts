import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        email: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          email: input.email,
        },
      });
      return { success: `background job started with ${input.email}` };
    }),
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `"hello" from server and "${opts.input.text}" from client`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
