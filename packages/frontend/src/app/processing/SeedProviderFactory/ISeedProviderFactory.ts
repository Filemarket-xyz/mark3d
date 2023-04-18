import { ISeedProvider } from '../SeedProvider'

/**
 * Is responsible for creation of SeedProvider for every account
 */
export interface ISeedProviderFactory {
  getSeedProvider: (account: string) => Promise<ISeedProvider>
}
