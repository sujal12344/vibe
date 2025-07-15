'use client';
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;

/**
 * Returns a React Query client instance, creating a new one on the server for each call, or reusing a singleton on the browser to ensure client stability across renders and suspense boundaries.
 *
 * @returns The React Query client instance.
 */
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

/**
 * Returns the base URL for the tRPC API endpoint, resolving to a relative path on the client and an absolute URL on the server.
 *
 * On the server, uses the `NEXT_PUBLIC_APP_URL` environment variable or defaults to `http://localhost:3000`.
 *
 * @returns The full tRPC API endpoint URL.
 */
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}

/**
 * Provides tRPC and React Query context to its child components.
 *
 * Wraps children with both the React Query `QueryClientProvider` and the tRPC `TRPCProvider`, ensuring that a stable tRPC client and query client are available throughout the component tree.
 *
 * @param props - Contains the React children to be rendered within the providers
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}