import { makeAutoObservable } from 'mobx'

import { TransfersResponseV2, TransferWithData } from '../../../swagger/Api'
import { TransferCardProps } from '../../components/MarketCard/TransferCard'
import { api } from '../../config/api'
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
import { formatCurrency } from '../../utils/web3/currency'
import { ErrorStore } from '../Error/ErrorStore'

const convertTransferToTransferCards = (target: 'incoming' | 'outgoing') => {
  const eventOptions =
    target === 'incoming' ? ['Receiving', 'Buying'] : ['Sending', 'Selling']

  return (transfer: TransferWithData): TransferCardProps => ({
    status: transfer.order?.id === 0 ? eventOptions[0] : eventOptions[1],
    button: {
      link: `/collection/${transfer.collection?.address}/${transfer.token?.tokenId}`,
      text: 'Go to page',
    },
    collectionName: transfer.collection?.name ?? '',
    imageURL: getHttpLinkFromIpfsString(transfer.token?.image ?? ''),
    title: transfer.token?.name ?? '',
    hiddenFileMeta: transfer.token?.hiddenFileMeta,
    user: {
      address: reduceAddress(transfer.token?.owner ?? '—'),
      img: getProfileImageUrl(transfer.token?.owner ?? ''),
    },
    price: transfer.order?.price ? formatCurrency(transfer.order?.price) : undefined,
  })
}

export class UserTransferStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data: TransfersResponseV2 = {
    incomingTotal: 0,
    outgoingTotal: 0,
  }

  address = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  setData(data: TransfersResponseV2) {
    this.data = data
  }

  addData(data: TransfersResponseV2) {
    this.data.incoming?.push(...(data.incoming ?? []))
    this.data.incomingTotal = data.incomingTotal

    this.data.outgoing?.push(...(data.outgoing ?? []))
    this.data.outgoingTotal = data.outgoingTotal
  }

  private request() {
    storeRequest<TransfersResponseV2>(
      this,
      api.v2.transfersDetail(this.address, { outgoingLimit: 10, incomingLimit: 10 }),
      (data) => this.setData(data),
    )
  }

  requestMore() {
    const lastOutgoingTransferId = lastItem(this.data.incoming ?? [])?.transfer?.id
    const lastIncomingTransferId = lastItem(this.data.outgoing ?? []).transfer?.id

    storeRequest<TransfersResponseV2>(
      this,
      api.v2.transfersDetail(this.address, {
        lastIncomingTransferId,
        lastOutgoingTransferId,
        outgoingLimit: 10,
        incomingLimit: 10,
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
    const { incoming = [], incomingTotal = 0, outgoing = [], outgoingTotal = 0 } = this.data

    return incoming.length < incomingTotal || outgoing.length < outgoingTotal
  }

  get total() {
    const { incomingTotal = 0, outgoingTotal = 0 } = this.data

    return incomingTotal + outgoingTotal
  }

  get transferCards(): TransferCardProps[] {
    const { incoming = [], outgoing = [] } = this.data

    const incomingCards = incoming.map<TransferCardProps>(
      convertTransferToTransferCards('incoming'),
    )
    const outgoingCards = outgoing.map<TransferCardProps>(
      convertTransferToTransferCards('outgoing'),
    )

    return incomingCards.concat(outgoingCards)
  }
}
