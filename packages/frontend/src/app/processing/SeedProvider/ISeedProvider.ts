export interface ISeedProvider {
  seed: ArrayBuffer | undefined

  unlock: (password: string) => Promise<void>

  set: (newSeed: ArrayBuffer, password: string) => Promise<void>

  lock: () => Promise<void>

  isForAccount: (account: string) => boolean

  addOnSeedChangeListener: (callback: (seed: ArrayBuffer | undefined) => void) => void
  removeOnSeedChangeListener: (callback: (seed: ArrayBuffer | undefined) => void) => void
}
