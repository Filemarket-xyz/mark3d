import { IHiddenFileOwner } from '../HiddenFileOwner'
import { ISecureStorage } from '../SecureStorage'
import { TokenFullId } from '../types'
import { IHiddenFileBuyer } from '../HiddenFileBuyer'
import { TokenIdStorage } from '../TokenIdStorage'
import { IHiddenFileBase } from '../HiddenFileBase'

/**
 * Is responsible for creation and registration of HiddenFileProcessor instances.
 */
export interface IHiddenFileProcessorFactory {
  readonly storage: ISecureStorage
  readonly tokenIdStorage: TokenIdStorage

  /**
   * Create or uses existing IHiddenFileOwner to access a hidden file and sell the NFT.
   * @param tokenFullId if null always creates new owner
   */
  getOwner: (tokenFullId?: TokenFullId) => Promise<IHiddenFileOwner>

  /**
   * Create or uses existing IHiddenFileBuyer if you want to initiate purchase
   * @param tokenFullId
   */
  getBuyer: (tokenFullId: TokenFullId) => Promise<IHiddenFileBuyer>

  /**
   * Used after NFT was bought.
   * @param buyer
   */
  buyerToOwner: (buyer: IHiddenFileBuyer) => Promise<IHiddenFileOwner>

  /**
   * Sets TokenFullId correspodning to the surrogateId. Usually called after NFT was minted and
   * TokenFullId becomes known.
   * @param hiddenFileProcessor
   * @param tokenFullId
   */
  registerTokenFullId: (hiddenFileProcessor: IHiddenFileBase, tokenFullId: TokenFullId) => Promise<void>
}
