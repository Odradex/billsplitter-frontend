import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

const handleError = (error: unknown) => {
  let errorMessage = 'Что-то пошло не так';

  // if (error instanceof Error) {
  //   errorMessage = error.message;
  // } else if (typeof error === 'object' && error && 'response' in error) {
  //   const axiosError = error as { response?: { data?: { error?: string } } };
  //   if (axiosError.response?.data?.error) {
  //     errorMessage = axiosError.response.data.error;
  //   }
  // }

  console.error('Query error:', error);
  toast.error(errorMessage);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Global query error:', error);
      handleError(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Global mutation error:', error);
      handleError(error);
    },
  }),
});
