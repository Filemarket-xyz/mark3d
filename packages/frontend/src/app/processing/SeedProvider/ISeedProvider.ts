/**
 * Provides access to account seed.
 */
export interface ISeedProvider {
  /**
   * The seed itself
   */
  seed: ArrayBuffer | undefined

  /**
   * Will return true, if user can use password to unlock existing seed.
   */
  canUnlock: () => boolean

  /**
   * Initializes provider. Internally, it loads the seed
   */
  init: () => Promise<void>

  /**
   * Uses password to decrypt existing seed
   * @param password
   */
  unlock: (password: string) => Promise<void>

  /**
   * Sets a new seed, saves it in the storage
   * @param newSeed
   * @param password
   */
  set: (newSeed: ArrayBuffer, password: string, newMnemonic: string) => Promise<void>

  /**
   * Clears the seed field
   */
  lock: () => Promise<void>

  /**
   * Checks, if the seed is for this account or not
   * @param account
   */
  isForAccount: (account: string) => boolean

  /**
   * Used to listen for seed changes
   * @param callback
   */
  addOnSeedChangeListener: (callback: (seed: ArrayBuffer | undefined) => void) => void
  removeOnSeedChangeListener: (callback: (seed: ArrayBuffer | undefined) => void) => void

  /**
   * Used to react on initialization
   * @param callback
   */
  addOnInitListener: (callback: () => void) => void
  removeOnInitListener: (callback: () => void) => void
}
