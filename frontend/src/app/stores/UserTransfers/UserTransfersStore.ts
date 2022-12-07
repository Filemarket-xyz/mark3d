import {
  IActivateDeactivate,
  storeRequest,
  IStoreRequester,
  storeReset,
  RequestContext
} from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { makeAutoObservable } from 'mobx'
import { TransfersResponseV2, TransferWithData } from '../../../swagger/Api'
import { api } from '../../config/api'
import { TransferCardProps } from '../../components/MarketCard/TransferCard'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'

const convertTransferToTransferCards = (target: 'incoming' | 'outgoing') => {
  const eventOptions =
    target === 'incoming' ? ['Receive', 'Buy'] : ['Send', 'Sale']

  return (transfer: TransferWithData): TransferCardProps => ({
    status: transfer.order?.id === 0 ? eventOptions[0] : eventOptions[1],
    button: {
      link: `/collection/${transfer.collection?.address}/${transfer.token?.tokenId}`,
      text: 'Go to page'
    },
    collection: `${transfer.collection?.name}`,
    imageURL: getHttpLinkFromIpfsString(transfer.token?.image ?? ''),
    title: `${transfer.token?.name}`,
    user: {
      username: reduceAddress(transfer.token?.owner ?? '—'),
      img: getProfileImageUrl(transfer.token?.owner ?? '')
    },
    price: Number(transfer.order?.price)
  })
}

export class UserTransferStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data: TransfersResponseV2 = {}
  address = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(address: string) {
    storeRequest<TransfersResponseV2>(
      this,
      api.v2.transfersDetail(address),
      (resp) => {
        this.data = resp
      }
    )
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

  get transferCards(): TransferCardProps[] {
    const { incoming = [], outgoing = [] } = this.data

    const incomingCards = incoming.map<TransferCardProps>(
      convertTransferToTransferCards('incoming')
    )
    const outgoingCards = outgoing.map<TransferCardProps>(
      convertTransferToTransferCards('outgoing')
    )

    return incomingCards.concat(outgoingCards)
  }
}
