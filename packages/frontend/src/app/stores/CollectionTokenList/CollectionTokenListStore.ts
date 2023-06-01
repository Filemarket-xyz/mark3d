import { makeAutoObservable } from 'mobx'

import { CollectionData } from '../../../swagger/Api'
import { NFTCardProps } from '../../components/MarketCard/NFTCard/NFTCard'
import { api } from '../../config/api'
import { gradientPlaceholderImg } from '../../UIkit'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeRequest,
  storeReset,
} from '../../utils/store'
import { lastItem } from '../../utils/structs'
import { ErrorStore } from '../Error/ErrorStore'

export class CollectionTokenListStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data: CollectionData = {}

  collectionAddress = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  setData(data: CollectionData) {
    this.data = data || {}
  }

  addData(data: CollectionData) {
    this.data.tokens?.push(...(data?.tokens ?? []))
    this.data.total = data.total
  }

  private request() {
    storeRequest(
      this,
      api.collections.fullDetail(this.collectionAddress, { limit: 20 }),
      (data) => this.setData(data),
    )
  }

  requestMore() {
    const lastTokenId = lastItem(this.data.tokens ?? [])?.tokenId
    storeRequest(
      this,
      api.collections.fullDetail(this.collectionAddress, { lastTokenId, limit: 20 }),
      (data) => this.addData(data),
    )
  }

  activate(collectionAddress: string): void {
    this.isActivated = true
    this.collectionAddress = collectionAddress
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
    const { total = 0, tokens = [] } = this.data

    return tokens.length < total
  }

  get nftCards(): NFTCardProps[] {
    if (!this.data.tokens) return []

    return this.data.tokens.map((token) => ({
      collectionName: this.data.collection?.name ?? '',
      imageURL: token.image ? getHttpLinkFromIpfsString(token.image) : gradientPlaceholderImg,
      title: token.name ?? '—',
      user: {
        img: getProfileImageUrl(token.owner ?? ''),
        address: reduceAddress(this.data.collection?.owner ?? ''),
      },
      button: {
        link: `/collection/${token.collectionAddress}/${token.tokenId}`,
        text: 'Go to page',
      },
      hiddenFile: token.hiddenFileMeta,
    }))
  }
}
