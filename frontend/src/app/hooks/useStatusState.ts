import { useCallback, useState } from 'react'
import { stringifyError } from '../utils/error/stringifyError'

export function useStatusState<ResultType>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [result, setResult] = useState<ResultType>()
  const wrapPromise = useCallback(async (call: () => Promise<ResultType>) => {
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
  }, [setIsLoading, setError, setResult])
  return {
    statuses: {
      isLoading,
      error,
      result
    },
    setIsLoading,
    setError,
    setResult,
    wrapPromise
  }
}
