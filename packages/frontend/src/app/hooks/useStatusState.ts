import { useCallback, useState } from 'react'

import { stringifyError } from '../utils/error'

export function useStatusState<ResultType, Arguments extends any = void>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [result, setResult] = useState<ResultType>()

  const wrapPromise = useCallback((call: (args: Arguments) => Promise<ResultType>) => {
    return async (args: Arguments) => {
      setIsLoading(true)
      setError(undefined)
      setResult(undefined)
      try {
        const result = await call(args)
        setIsLoading(false)
        setResult(result)
        console.log('use status state result', result)

        return result
      } catch (err) {
        setIsLoading(false)
        setError(stringifyError(err))
        throw err
      }
    }
  }, [])

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
