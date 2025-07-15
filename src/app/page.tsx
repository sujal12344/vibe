import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

/**
 * Server-prefetches data and renders the home page with hydration and suspense support.
 *
 * Initializes a React Query client, prefetches the `hello` query with a preset parameter, and returns a component tree wrapped in a hydration boundary. The client-side content is rendered within a React Suspense boundary to enable smooth loading states.
 */
export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: "namaste!" }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
}
