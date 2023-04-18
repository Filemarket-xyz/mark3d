import { SeedProvider } from './SeedProvider'
import { useEffect, useState } from 'react'
import { useSeedProviderFactory } from '../SeedProviderFactory'

export function useSeedProvider(
  account: string | undefined
): { seedProvider: SeedProvider | undefined, error: unknown } {
  const [seedProvider, setSeedProvider] = useState<SeedProvider>()
  const [error, setError] = useState<unknown>()
  const seedProviderFactory = useSeedProviderFactory()
  useEffect(() => {
    if (account) {
      seedProviderFactory
        .getSeedProvider(account)
        .then(setSeedProvider)
        .catch(setError)
    }
  }, [account, seedProviderFactory, setSeedProvider])
  return { seedProvider, error }
}
