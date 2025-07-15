"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: ({ success }) =>
        toast.success(success),
      onError: (error) => toast.error(error.message),
    })
  );

  return (
    <Button
      disabled={invoke.isPending || invoke.isError}
      onClick={() => invoke.mutate({ email: "test@gmail.com2" })}
    >
      Invoke trpc
    </Button>
  );
}
