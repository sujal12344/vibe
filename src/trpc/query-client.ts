import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';
/**
 * Creates and returns a `QueryClient` instance with custom serialization and hydration using `superjson`.
 *
 * The returned client is configured with a 30-second query stale time and enhanced support for serializing and deserializing complex data types during dehydration and hydration. Queries with a `'pending'` status are also included in the dehydration process.
 *
 * @returns A configured `QueryClient` instance for use with `@tanstack/react-query`
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}