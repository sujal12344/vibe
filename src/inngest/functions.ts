import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";

export const inngestFunction = inngest.createFunction(
  { id: "test-id" },
  { event: "test/event" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert next.js developer. You write readable, maintainable, understanable and optimised code. You can write simple Next.js and React code snippets.",
      model: gemini({
        model: "gemini-2.0-flash-lite",
      }),
    });

    const output = await codeAgent.run(
      `Code the following snippet: ${event.data.value}`
    );
    console.log({ ...output });

    return { ...output };
  }
);
