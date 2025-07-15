"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.hello.queryOptions({ text: "namaste!" })
  );
  return <div className="h-screen">{JSON.stringify(data)}</div>;
};
