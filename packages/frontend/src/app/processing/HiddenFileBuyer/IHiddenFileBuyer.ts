import { IHiddenFileBase } from '../HiddenFileBase'
import { PersistentDerivationParams } from '../types'

export interface IHiddenFileBuyer extends IHiddenFileBase {

  /**
   * Generates and saves RSA key pair
   */
  initBuy: (dealNumber: number, ...args: PersistentDerivationParams) => Promise<`0x${string}`>

  /**
   * Used to report fraud.
   */
  revealRsaPrivateKey: (dealNumber: number, ...args: PersistentDerivationParams) => Promise<`0x${string}`>
}
