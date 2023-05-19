import { makeAutoObservable } from 'mobx'

import { OrderStatus, OrderWithToken } from '../../../swagger/Api'
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

/**
 * Stores only ACTIVE order state.
 * Does not listen for updates, need to reload manually.
 */
export class OpenOrderListStore implements IStoreRequester, IActivateDeactivate {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = true
  isActivated = false

  data: OrderWithToken[] = []

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  setData(data: OrderWithToken[]) {
    this.data = data
  }

  addData(data: OrderWithToken[]) {
    this.data.push(...data)
  }

  private request() {
    storeRequest(
      this,
      api.orders.allActiveList({ limit: 20 }),
      (data) => this.setData(data)
    )
  }

  requestMore() {
    const lastOrderId = this.data[this.data.length - 1].order?.id
    storeRequest(
      this,
      api.orders.allActiveList({ lastOrderId, limit: 20 }),
      (data) => this.addData(data)
    )
  }

  activate(): void {
    this.isActivated = true
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

  get nftCards() {
    return this.data
      .filter(({ order }) => order?.statuses?.[0]?.status === OrderStatus.Created)
      .map(
        ({ token, order }) => ({
          collectionAddress: token?.collectionAddress ?? '',
          hiddenFile: token?.hiddenFileMeta,
          imageURL: token?.image ? getHttpLinkFromIpfsString(token.image) : gradientPlaceholderImg,
          title: token?.name ?? '—',
          user: {
            img: getProfileImageUrl(token?.owner ?? ''),
            username: reduceAddress(token?.owner ?? '')
          },
          button: {
            link: `/collection/${token?.collectionAddress}/${token?.tokenId}`,
            text: 'View & Buy'
          },
          priceUsd: order?.priceUsd,
          price: order?.price,
          orderId: order?.id
        })
      )
  }
}
