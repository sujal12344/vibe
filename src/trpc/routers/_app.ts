import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/event",
        data: {
          value: input.value,
        },
      });
      return { success: `background job started` };
    }),
});

export type AppRouter = typeof appRouter;
