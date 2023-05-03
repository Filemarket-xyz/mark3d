import { IHiddenFileBase } from '../HiddenFileBase'

export interface IHiddenFileBuyer extends IHiddenFileBase {

  /**
   * Generates and saves RSA key pair
   */
  initBuy: () => Promise<ArrayBuffer>

  /**
   * Used to report fraud.
   */
  revealRsaPrivateKey: () => Promise<ArrayBuffer>
}
