import { IHiddenFileBuyer } from '../HiddenFileBuyer'
import { IHiddenFileOwner } from '../HiddenFileOwner'

/**
 * Is responsible for creation and registration of HiddenFileProcessor instances
 * for every account
 */
export interface IHiddenFileProcessorFactory {

  /**
   * Create or uses existing IHiddenFileOwner to access a hidden file and sell the NFT.
   * @param account address of the account, on behalf of which NFT is owned
   * @param tokenFullId if null always creates new owner
   */
  getOwner: (account: string, collectionAddress: string, tokenId: number) => Promise<IHiddenFileOwner>

  /**
   * Create or uses existing IHiddenFileBuyer if you want to initiate purchase
   * @param account address of the account, on behalf of which NFT is buyed
   * @param tokenFullId
   */
  getBuyer: (account: string, collectionAddress: string, tokenId: number) => Promise<IHiddenFileBuyer>
}
