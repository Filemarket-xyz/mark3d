import { TokenFullId } from '../types'

export interface IHiddenFileBase {
  /**
   * Identifier, used to reference stored keys.
   * The only reason it exists - it's impossible to know tokenId before token is created.
   * The id is unique in the scope of user. Different users may have similar surrogateId.
   */
  surrogateId: string

  tokenId?: string
  collectionId?: string

  /**
   * Links surrogateId with actual TokenFullId.
   * @param tokenFullId
   */
  setTokenFullId: (tokenFullId: TokenFullId) => Promise<void>
}
