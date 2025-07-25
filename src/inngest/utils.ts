import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, type Message, TextMessage } from "@inngest/agent-kit";
import { SANDBOX_TIMEOUT } from "./constant";

export const getSandbox = async (sandboxId: string) => {
  if (!sandboxId || typeof sandboxId !== "string" || sandboxId.trim() === "") {
    throw new Error("Invalid sandbox ID provided");
  }

  try {
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.setTimeout(SANDBOX_TIMEOUT);
    return sandbox;
  } catch (error) {
    throw new Error(
      `Failed to connect to sandbox ${sandboxId}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastAssistantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}

export const parseAgentOutput = (value: Message[]) => {
  const output = value[0];
  if (output.type !== "text") {
    return "Fragment";
  }

  if (Array.isArray(output.content)) {
    return output.content.map((text) => text).join("");
  } else {
    return output.content;
  }
};
