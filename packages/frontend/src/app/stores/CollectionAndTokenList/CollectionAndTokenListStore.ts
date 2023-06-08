import { utils } from 'ethers/lib.esm'
import { makeAutoObservable } from 'mobx'

import { TokensResponse } from '../../../swagger/Api'
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

  address = ''

  data: TokensResponse = {
    collectionsTotal: 0,
    tokensTotal: 0,
  }

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  setData(data: TokensResponse) {
    this.data = data
  }

  addData(data: TokensResponse) {
    this.data.collections?.push(...(data.collections ?? []))
    this.data.collectionsTotal = data.collectionsTotal

    this.data.tokens?.push(...(data.tokens ?? []))
    this.data.tokensTotal = data.tokensTotal
  }

  private request() {
    storeRequest(
      this,
      api.tokens.tokensDetail(this.address, {
        tokenLimit: 20,
      }),
      data => this.setData(data),
    )
  }

  requestMoreTokens() {
    const { tokenId, collectionAddress } = lastItem(this.data.tokens ?? [])
    storeRequest(
      this,
      api.tokens.tokensDetail(this.address, {
        lastTokenId: tokenId,
        lastTokenCollectionAddress: collectionAddress,
        tokenLimit: 20,
      }),
      (data) => this.addData(data),
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

  get hasMoreData() {
    const { tokens = [], tokensTotal = 0 } = this.data

    return tokens.length < tokensTotal
  }

  get nftCards(): NFTCardProps[] {
    if (!this.data.tokens) return []

    return this.data.tokens.map((token) => ({
      collectionName: token.collectionName ?? '',
      imageURL: token.image ? getHttpLinkFromIpfsString(token.image) : gradientPlaceholderImg,
      title: token.name ?? '—',
      user: {
        img: getProfileImageUrl(token.owner ?? ''),
        address: reduceAddress(token.owner ?? ''),
      },
      hiddenFileMeta: token.hiddenFileMeta,
      button: {
        text: 'Go to page',
        link: `/collection/${token.collectionAddress}/${token.tokenId}`,
      },
    }))
  }

  get collectionMintOptions(): ComboBoxOption[] {
    if (!this.address || !this.data.collections) return []

    return this.data.collections
      // user is only allowed to mint into owned collections
      .filter(collection => collection.owner && utils.getAddress(collection.owner) === utils.getAddress(this.address))
      .map(collection => ({
        title: collection.name ?? '',
        id: collection.address ?? '',
      }))
  }
}
