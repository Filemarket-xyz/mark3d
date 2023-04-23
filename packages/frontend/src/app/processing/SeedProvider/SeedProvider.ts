import { ISeedProvider } from './ISeedProvider'
import { IStorageProvider } from '../StorageProvider'
import * as passworder from '@metamask/browser-passworder'
import { utils } from 'ethers'

const seedStorageKey = 'seed'
const mnemonicStorageKey = 'mnemonic'

const seedByteLength = 64

export class SeedProvider implements ISeedProvider {
  seed: ArrayBuffer | undefined
  mnemonic: string | undefined
  private seedEncrypted: string | undefined
  private mnemonicEncrypted: string | undefined

  private onChangeListeners: Array<(seed: ArrayBuffer | undefined) => void> = []
  private onInitListeners: Array<() => void> = []

  constructor(
    private readonly storage: IStorageProvider,
    private readonly account: string
  ) {
  }

  canUnlock(): boolean {
    console.log('can unlock check', this.seedEncrypted)
    return !!this.seedEncrypted
  }

  async init(): Promise<void> {
    this.seedEncrypted = await this.storage.get(seedStorageKey)
    this.mnemonicEncrypted = await this.storage.get(mnemonicStorageKey)
    console.log('init finished', this.seedEncrypted)
    console.log('init finished', this.mnemonicEncrypted)
  }

  private setSeed(seed: ArrayBuffer | undefined) {
    this.seed = seed
    this.onChangeListeners.forEach(fn => fn(seed))
  }

  private setMnemonic(mnemonic: string | undefined) {
    this.mnemonic = mnemonic
  }

  async unlock(password: string): Promise<void> {
    if (!this.seedEncrypted) {
      throw new Error('Unable to unlock seed: no seed found')
    }
    const seed = await passworder.decrypt(password, this.seedEncrypted)
    if (!seed || typeof seed !== 'string') {
      throw new Error('Unable to unlock seed: cannot decrypt seed')
    }
    const seedBuf = Buffer.from(seed, 'hex')
    if (seedBuf.byteLength !== seedByteLength) {
      throw new Error(
        `Unable to unlock seed: expected seed to be ${seedByteLength} bytes, but got ${seedBuf.byteLength}`
      )
    }

    if (!this.mnemonicEncrypted) {
      throw new Error('Unable to unlock mnemonic: no mnemonic found')
    }

    const mnemonic = await passworder.decrypt(password, this.mnemonicEncrypted)
    if (!mnemonic || typeof mnemonic !== 'string') {
      throw new Error('Unable to unlock mnemonic: cannot decrypt mnemonic')
    }

    console.log(Buffer.from(mnemonic, 'hex').toString('hex'))

    this.setSeed(seedBuf)
    this.setMnemonic(mnemonic)
  }

  async set(newSeed: ArrayBuffer, password: string, newMnemonic: string): Promise<void> {
    const seedEncrypted = await passworder.encrypt(password, Buffer.from(newSeed).toString('hex'))
    const mnemonicEncrypted = await passworder.encrypt(password, newMnemonic)
    if (!seedEncrypted) {
      throw new Error('Unable to encrypt seed')
    }
    await this.storage.set(seedStorageKey, seedEncrypted)
    await this.storage.set(mnemonicStorageKey, mnemonicEncrypted)
    this.seedEncrypted = seedEncrypted
    this.mnemonicEncrypted = mnemonicEncrypted

    this.setSeed(newSeed)
    this.setMnemonic(newMnemonic)
  }

  async lock(): Promise<void> {
    this.setSeed(undefined)
    this.setMnemonic(undefined)
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

  addOnInitListener(callback: () => void) {
    this.onInitListeners.push(callback)
  }

  removeOnInitListener(callback: () => void) {
    this.onInitListeners = this.onInitListeners.filter(fn => fn !== callback)
  }
}
