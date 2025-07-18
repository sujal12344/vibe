import { Sandbox } from "@e2b/code-interpreter";

export const getSandbox = (sandboxId: string) => Sandbox.connect(sandboxId);
