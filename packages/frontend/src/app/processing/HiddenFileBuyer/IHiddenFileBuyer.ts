import { IHiddenFileBase } from '../HiddenFileBase'

export interface IHiddenFileBuyer extends IHiddenFileBase {

  /**
   * Generates and saves RSA key pair
   */
  initBuy: (dealNumber: number) => Promise<ArrayBuffer>

  /**
   * Used to report fraud.
   */
  revealRsaPrivateKey: (dealNumber: number) => Promise<ArrayBuffer>
}
