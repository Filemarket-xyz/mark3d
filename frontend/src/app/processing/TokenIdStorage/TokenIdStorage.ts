import { ITokenIdStorage, parseTokenFullId, stringifyTokenFullId } from './ITokenIdStorage'
import { ISecureStorage } from '../SecureStorage'
import { TokenFullId } from '../types'

// prefixes used to prevent collisions in the storage
const storagePrefix = 'tokenId'

export class TokenIdStorage implements ITokenIdStorage {
  constructor(public readonly storage: ISecureStorage) {
  }

  // We will use term key when referencing ids, used as internal identifiers to store tokenIds in the storage
  getCountKey() {
    return `${storagePrefix}/count`
  }

  getSurrogateToTokenFullIdKey(surrogateId: string) {
    return `${storagePrefix}/surrogateToFull/${surrogateId}`
  }

  getTokenFullToSurrogateIdKey(tokenFullId: TokenFullId) {
    return `${storagePrefix}/fullToSurrogate/${stringifyTokenFullId(tokenFullId)}`
  }

  async nextId(): Promise<string> {
    let count = Number(await this.storage.get(this.getCountKey()))
    if (isNaN(count) || count < 1) {
      count = 1
    }
    await this.storage.set(this.getCountKey(), `${count + 1}`)
    return `${count}`
  }

  async getSurrogateId(tokenFullId: TokenFullId): Promise<string | undefined> {
    return await this.storage.get(this.getTokenFullToSurrogateIdKey(tokenFullId))
  }

  async getTokenFullId(surrogateId: string): Promise<TokenFullId | undefined> {
    const tokenFullId = await this.storage.get(this.getSurrogateToTokenFullIdKey(surrogateId))
    if (!tokenFullId) {
      return undefined
    }
    return parseTokenFullId(tokenFullId)
  }

  async setTokenFullId(surrogateId: string, tokenFullId: TokenFullId | undefined): Promise<void> {
    if (tokenFullId) {
      // update
      await this.storage.set(
        this.getSurrogateToTokenFullIdKey(surrogateId),
        tokenFullId && stringifyTokenFullId(tokenFullId)
      )
      await this.storage.set(
        this.getTokenFullToSurrogateIdKey(tokenFullId),
        surrogateId
      )
    } else {
      // delete
      const tokenFullId = await this.getTokenFullId(surrogateId)
      if (tokenFullId) {
        await this.storage.set(
          this.getSurrogateToTokenFullIdKey(surrogateId),
          undefined
        )
        await this.storage.set(
          this.getTokenFullToSurrogateIdKey(tokenFullId),
          undefined
        )
      }
    }
  }

  async getSurrogateIdOrCreate(tokenFullId?: TokenFullId): Promise<string> {
    if (!tokenFullId) {
      return await this.nextId()
    }
    let surrogateId = await this.getSurrogateId(tokenFullId)
    if (!surrogateId) {
      surrogateId = await this.nextId()
    }
    return surrogateId
  }
}
