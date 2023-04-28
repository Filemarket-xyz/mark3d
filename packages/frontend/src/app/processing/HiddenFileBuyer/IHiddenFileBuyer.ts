import { IHiddenFileBase } from '../HiddenFileBase'
import { PersistentDerivationParams } from '../types'

export interface IHiddenFileBuyer extends IHiddenFileBase {

  /**
   * Generates and saves RSA key pair
   */
  initBuy: (dealNumber: number, ...args: PersistentDerivationParams) => Promise<ArrayBuffer>

  /**
   * Used to report fraud.
   */
  revealRsaPrivateKey: (dealNumber: number, ...args: PersistentDerivationParams) => Promise<ArrayBuffer>
}
