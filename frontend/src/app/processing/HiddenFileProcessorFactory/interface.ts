import { IHiddenFileOwner } from '../HiddenFileOwner'
import { ISecureStorage } from '../SecureStorage'
import { TokenFullId } from '../types'
import { IHiddenFileBuyer } from '../HiddenFileBuyer'

/**
 * Creates HiddenFileProcessor instances and assigns them surrogateId
 */
export interface IHiddenFileProcessorFactory {
  readonly storage: ISecureStorage
  tokenCount: number

  create: (tokenFullId?: TokenFullId) => Promise<IHiddenFileOwner>

  buyerToOwner: (buyer: IHiddenFileBuyer) => IHiddenFileOwner
}
