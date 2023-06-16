import { useEffect, useState } from 'react'

export const useDebouncedValue = <T = any>(value: T, delay: number, initialValue?: T) => {
  const [state, setState] = useState<T | undefined>(initialValue)

  useEffect(() => {
    const timeout = setTimeout(() => setState(value), delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  return state
}
