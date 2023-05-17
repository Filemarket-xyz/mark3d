import { makeAutoObservable } from 'mobx'

import { CollectionData } from '../../../swagger/Api'
import { NFTCardProps } from '../../components/MarketCard/NFTCard'
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
  storeReset
} from '../../utils/store'
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
      errorStore: false
    })
  }

  private request(collectionAddress: string) {
    storeRequest<CollectionData>(
      this,
      api.collections.fullDetail(collectionAddress),
      (resp) => {
        this.data = resp || {}
      }
    )
  }

  activate(collectionAddress: string): void {
    this.isActivated = true
    this.collectionAddress = collectionAddress
    this.request(collectionAddress)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    this.request(this.collectionAddress)
  }

  get nftCards(): NFTCardProps[] {
    const tokens = this.data.tokens ?? []
    const collection = this.data.collection

    return tokens.map((token) => ({
      collection: collection?.name ?? '',
      imageURL: token.image ? getHttpLinkFromIpfsString(token.image) : gradientPlaceholderImg,
      title: token.name ?? '—',
      user: {
        img: getProfileImageUrl(token.owner ?? ''),
        username: reduceAddress(collection?.owner ?? '')
      },
      button: {
        link: `/collection/${token.collectionAddress}/${token.tokenId}`,
        text: 'Go to page'
      },
      hiddenFile: token.hiddenFileMeta
    }))
  }
}
