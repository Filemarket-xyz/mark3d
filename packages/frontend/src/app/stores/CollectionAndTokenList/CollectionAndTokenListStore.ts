import { utils } from 'ethers/lib.esm'
import { makeAutoObservable } from 'mobx'

import { Collection, Token, TokensResponse } from '../../../swagger/Api'
import { NFTCardProps } from '../../components/MarketCard/NFTCard/NFTCard'
import { api } from '../../config/api'
import { gradientPlaceholderImg } from '../../UIkit'
import { ComboBoxOption } from '../../UIkit/Form/Combobox'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { lastItem } from '../../utils/structs'
import { ErrorStore } from '../Error/ErrorStore'

export class CollectionAndTokenListStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  collections: Collection[] = []
  tokens: Token[] = []
  address = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  setData(data: TokensResponse) {
    if (data.collections) {
      this.collections = data.collections
    }
    if (data.tokens) {
      this.tokens = data.tokens
    }
  }

  addTokens(tokens?: Token[]) {
    if (tokens) {
      this.tokens.push(...tokens)
    }
  }

  private request() {
    storeRequest(
      this,
      api.tokens.tokensDetail(this.address, {
        // collections?
        tokenLimit: 20,
      }),
      data => this.setData(data),
    )
  }

  requestMoreTokens() {
    const { tokenId, collectionAddress } = lastItem(this.tokens)
    storeRequest(
      this,
      api.tokens.tokensDetail(this.address, {
        lastTokenId: tokenId,
        lastTokenCollectionAddress: collectionAddress,
        tokenLimit: 20,
      }),
      ({ tokens }) => this.addTokens(tokens),
    )
  }

  activate(address: string): void {
    this.isActivated = true
    this.address = address
    this.request()
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    this.request()
  }

  get nftCards(): NFTCardProps[] {
    const tokens = this.tokens ?? []

    return tokens.map((token) => ({
      collectionName: token.collectionName ?? '',
      imageURL: token.image ? getHttpLinkFromIpfsString(token.image) : gradientPlaceholderImg,
      title: token.name ?? '—',
      user: {
        img: getProfileImageUrl(token.owner ?? ''),
        address: reduceAddress(token.owner ?? ''),
      },
      button: {
        text: 'Go to page',
        link: `/collection/${token.collectionAddress}/${token.tokenId}`,
      },
    }))
  }

  get collectionMintOptions(): ComboBoxOption[] {
    if (!this.address) {
      return []
    }

    return this.collections
      // user is only allowed to mint into owned collections
      .filter(collection => collection.owner && utils.getAddress(collection.owner) === utils.getAddress(this.address))
      .map(collection => ({
        title: collection.name ?? '',
        id: collection.address ?? '',
      }))
  }
}
