import { QueryClient } from "@tanstack/react-query";

const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 минута
        refetchOnWindowFocus: false,
      },
    },
  });

export default getQueryClient;
