import { Sandbox } from '@e2b/code-interpreter'

import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { getSandbox } from './utils';

export const inngestFunction = inngest.createFunction(
  { id: "test-id" },
  { event: "test/event" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-sujal-test-2")
      return sandbox.sandboxId
    })


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
    
    
    const sandboxURL = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host= sandbox.getHost(3000)
      return `https://${host}`
    })
    
    
    console.log({ ...output, sandboxURL });
    return { ...output, sandboxURL };
  }
);
