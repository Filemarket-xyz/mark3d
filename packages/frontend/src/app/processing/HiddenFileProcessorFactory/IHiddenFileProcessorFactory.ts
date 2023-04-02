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
  readonly storages: Record<string, ISecureStorage>
  readonly tokenIdStorages: Record<string, TokenIdStorage>

  /**
   * Create or uses existing IHiddenFileOwner to access a hidden file and sell the NFT.
   * @param account address of the account, on behalf of which NFT is owned
   * @param tokenFullId if null always creates new owner
   */
  getOwner: (account: string, tokenFullId?: TokenFullId) => Promise<IHiddenFileOwner>

  /**
   * Create or uses existing IHiddenFileBuyer if you want to initiate purchase
   * @param account address of the account, on behalf of which NFT is buyed
   * @param tokenFullId
   */
  getBuyer: (account: string, tokenFullId: TokenFullId) => Promise<IHiddenFileBuyer>

  /**
   * Used after NFT was bought.
   * @param account address of the account, on behalf of which NFT is processed
   * @param buyer
   */
  buyerToOwner: (buyer: IHiddenFileBuyer) => Promise<IHiddenFileOwner>

  /**
   * Sets TokenFullId correspodning to the surrogateId. Usually called after NFT was minted and
   * TokenFullId becomes known.
   * @param account address of the account, on behalf of which NFT is processed
   * @param hiddenFileProcessor
   * @param tokenFullId
   */
  registerTokenFullId: (
    account: string, hiddenFileProcessor: IHiddenFileBase, tokenFullId: TokenFullId
  ) => Promise<void>
}
