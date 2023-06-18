import { useCallback, useState } from 'react'

import { stringifyError } from '../utils/error'

export function useStatusState<ResultType>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [result, setResult] = useState<ResultType>()

  const wrapPromise = useCallback((call: () => Promise<ResultType>) => {
    return async () => {
      setResult(undefined)
      setError(undefined)
      setIsLoading(true)
      try {
        const result = await call()
        setIsLoading(false)
        setResult(result)
      } catch (err) {
        setError(stringifyError(err))
        setIsLoading(false)
      }
    }
  }, [setIsLoading, setError, setResult])

  return {
    statuses: {
      isLoading,
      error,
      result,
    },
    setIsLoading,
    setError,
    setResult,
    wrapPromise,
  }
}
