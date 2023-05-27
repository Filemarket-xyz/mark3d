import { useEffect, useState } from 'react'

import { useSeedProvider } from './useSeedProvider'

/**
 * Provides seed for an account. Seed is updated whenever it is updated
 * in corresponding seedProvider.
 * @param account
 */
export function useSeed(account: string | undefined): ArrayBuffer | undefined {
  const [seed, setSeed] = useState<ArrayBuffer>()
  const { seedProvider } = useSeedProvider(account)
  useEffect(() => {
    setSeed(seedProvider?.seed)
    seedProvider?.addOnSeedChangeListener(setSeed)

    return () => {
      seedProvider?.removeOnSeedChangeListener(setSeed)
    }
  }, [setSeed, seedProvider])

  return seed
}
