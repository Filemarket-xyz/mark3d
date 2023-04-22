import { EftRsaDerivationFunction } from '../../../../../crypto/src/lib/types'
import { IHiddenFileBase } from '../HiddenFileBase'

export interface IHiddenFileBuyer extends IHiddenFileBase {

  /**
   * Generates and saves RSA key pair
   */
  initBuy: (...args: Parameters<EftRsaDerivationFunction>) => Promise<`0x${string}`>

  /**
   * Used to report fraud.
   */
  revealFraudReportRSAPrivateKey: (...args: Parameters<EftRsaDerivationFunction>) => Promise<`0x${string}`>
}
