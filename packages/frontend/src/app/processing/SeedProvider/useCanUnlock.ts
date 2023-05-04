import { useCallback, useEffect, useState } from 'react'

import { useSeedProvider } from './useSeedProvider'

export function useCanUnlock(account: string | undefined): boolean {
  const [canUnlock, setCanUnlock] = useState(false)
  const { seedProvider } = useSeedProvider(account)
  const updateCanUnlock = useCallback(() => {
    setCanUnlock(seedProvider?.canUnlock() || false)
  }, [setCanUnlock, seedProvider])
  useEffect(() => {
    updateCanUnlock()
    seedProvider?.addOnInitListener(updateCanUnlock)
    return () => {
      seedProvider?.removeOnInitListener(updateCanUnlock)
    }
  }, [updateCanUnlock, seedProvider])
  return canUnlock
}
