import { ISeedProvider } from './ISeedProvider'
import { IStorageProvider } from '../StorageProvider'
import * as passworder from '@metamask/browser-passworder'
import { utils } from 'ethers'

const seedStorageKey = 'seed'

const seedByteLength = 16

export class SeedProvider implements ISeedProvider {
  seed: ArrayBuffer | undefined

  private onChangeListeners: Array<(seed: ArrayBuffer | undefined) => void> = []

  constructor(
    private readonly storage: IStorageProvider,
    private readonly account: string
  ) {
  }

  private setSeed(seed: ArrayBuffer | undefined) {
    this.seed = seed
    this.onChangeListeners.forEach(fn => fn(seed))
  }

  async unlock(password: string): Promise<void> {
    const seedEncrypted = await this.storage.get(seedStorageKey)
    if (!seedEncrypted) {
      throw new Error('Unable to unlock seed: no seed found')
    }
    const seed = await passworder.decrypt(password, seedEncrypted)
    if (!seed || typeof seed !== 'string') {
      throw new Error('Unable to unlock seed: cannot decrypt seed')
    }
    const seedBuf = Buffer.from(seed, 'hex')
    if (seedBuf.byteLength !== seedByteLength) {
      throw new Error(
        `Unable to unlock seed: expected seed to be ${seedByteLength} bytes, but got ${seedBuf.byteLength}`
      )
    }
    this.setSeed(seedBuf)
  }

  async set(newSeed: ArrayBuffer, password: string): Promise<void> {
    const seedEncrypted = await passworder.encrypt(password, Buffer.from(newSeed).toString('hex'))
    if (!seedEncrypted) {
      throw new Error('Unable to encrypt seed')
    }
    await this.storage.set(seedStorageKey, seedEncrypted)
    this.setSeed(newSeed)
  }

  async lock(): Promise<void> {
    this.setSeed(undefined)
  }

  isForAccount(account: string) {
    return utils.getAddress(account) === utils.getAddress(this.account)
  }

  addOnSeedChangeListener(callback: (seed: ArrayBuffer | undefined) => void) {
    this.onChangeListeners.push(callback)
  }

  removeOnSeedChangeListener(callback: (seed: ArrayBuffer | undefined) => void) {
    this.onChangeListeners = this.onChangeListeners.filter(fn => fn !== callback)
  }
}
