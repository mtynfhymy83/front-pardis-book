import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../shared/api/client'

function shouldRetry(failureCount: number, error: Error) {
  if (failureCount >= 2) return false
  if (!(error instanceof ApiError)) return false
  return error.status === 0 || error.status >= 500
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
