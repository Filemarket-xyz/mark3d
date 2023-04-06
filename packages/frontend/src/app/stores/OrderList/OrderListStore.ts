import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeRequest,
  storeReset
} from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { OrderStatus, OrderWithToken } from '../../../swagger/Api'
import { makeAutoObservable } from 'mobx'
import { api } from '../../config/api'
import { NFTCardProps } from '../../components/MarketCard/NFTCard'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { gradientPlaceholderImg } from '../../UIkit'

/**
 * Stores only ACTIVE order state.
 * Does not listen for updates, need to reload manually.
 */
export class OpenOrderListStore implements IStoreRequester, IActivateDeactivate<[string]> {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false
  address = ''

  data: OrderWithToken[] = []

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(tokenAddress: string) {
    storeRequest<OrderWithToken[]>(this, api.orders.allActiveList(), (resp) => {
      this.data = resp
    })
  }

  activate(address: string): void {
    this.isActivated = true
    this.address = address
    this.request(address)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    this.request(this.address)
  }

  get nftCards() {
    return this.data
      .filter(({ order }) => order?.statuses?.[0]?.status === OrderStatus.Created)
      .map(
        ({ token }): NFTCardProps => ({
          collection: reduceAddress(token?.collection ?? ''),
          imageURL: token?.image ? getHttpLinkFromIpfsString(token.image) : gradientPlaceholderImg,
          title: token?.name ?? '—',
          user: {
            img: getProfileImageUrl(token?.owner ?? ''),
            username: reduceAddress(token?.owner ?? '')
          },
          button: {
            link: `/collection/${token?.collection}/${token?.tokenId}`,
            text: 'Go to page'
          }
        })
      )
  }
}
