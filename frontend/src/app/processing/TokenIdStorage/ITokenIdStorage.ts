import { ISecureStorage } from '../SecureStorage'
import { TokenFullId } from '../types'

// Looks like JSON, but not JSON, cos it is not deterministic
export const stringifyTokenFullId = (tokenFullId: TokenFullId) =>
  `{"collectionId":${tokenFullId.collectionId},"tokenId":${tokenFullId.tokenId}}`

export const parseTokenFullId = (tokenFullId: string): TokenFullId => JSON.parse(tokenFullId)

/**
 * CRUD of pairs (surrogateId, TokenFullId).
 *
 * The only reason this interface exists - TokenFullId is unknown at the moment of NFT creation, so
 * we have to assign a surrogate id to the NFT.
 */
export interface ITokenIdStorage {
  readonly storage: ISecureStorage

  /**
   * Creates and returns new surrogateId
   * Keeps track of the latest id, so ids do not overlap
   */
  nextId: () => Promise<string>

  /**
   * Saves token full id corresponding to the surrogateId.
   */
  setTokenFullId: (surrogateId: string, tokenFullId: TokenFullId | undefined) => Promise<void>

  /**
   * Returns {@link TokenFullId} corresponding to the surrogateId
   * @param surrogateId
   */
  getTokenFullId: (surrogateId: string) => Promise<TokenFullId | undefined>

  /**
   * Returns surrogateId corresponding to the TokenFullId, if it was previously set.
   * @param tokenFullId
   */
  getSurrogateId: (tokenFullId: TokenFullId) => Promise<string | undefined>

  /**
   * Creates new surrogateId if needed
   * @param tokenFullId
   */
  getSurrogateIdOrCreate: (tokenFullId?: TokenFullId) => Promise<string>
}
