import { ErrorStore } from '../Error/ErrorStore'
import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeRequest,
  storeReset
} from '../../utils/store'
import {
  OrderStatusInfo,
  TransfersResponseV2,
  TransferWithData
} from '../../../swagger/Api'
import { makeAutoObservable } from 'mobx'
import { api } from '../../config/api'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { ITableRow } from '../../components/Table/TableBuilder'
import ethIcon from '../../pages/ProfilePage/img/eth-icon.svg'
import { styled } from '../../../styles'

const getLatestStatusTimestamp = (statuses?: OrderStatusInfo[]) => {
  if (!statuses) return 0

  return statuses.reduce(
    (acc, value) => (value > acc ? value.timestamp ?? 0 : acc),
    -Infinity
  )
}

const formatDate = (date: Date) => {
  const localMonthAndTime = date.toLocaleTimeString('en-US', { month: 'short' })

  const day = date.getDate()
  const month = localMonthAndTime.split(',').shift()
  const year = date.getFullYear()
  let [time, period]: [string, string] = (
    localMonthAndTime.split(',').at(-1) as string
  )
    .trim()
    .split(' ') as [string, string]
  time = time.split(':').slice(0, -1).join(':')

  return `${month} ${day}, ${year} at ${time} ${period}`
}

const PriceContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$1'
})

const Price = styled('div')

const EthImg = styled('img', {
  width: 8,
  height: 12,
  objectFit: 'contain'
})

const convertTransferToTableRows = (transfer: TransferWithData) => ({
  cells: [
    {
      columnName: 'Event',
      value: (transfer.order?.id ?? 0) === 0 ? 'Receive' : 'Buy'
    },
    { columnName: 'Object', value: 'Sale' },
    {
      columnName: 'From',
      value: reduceAddress(transfer.transfer?.from ?? '—')
    },
    {
      columnName: 'To',
      value: reduceAddress(transfer.transfer?.to ?? '—')
    },
    {
      columnName: 'Price',
      value: (
        <>
          <PriceContainer>
            <Price>
              {transfer.order?.price !== undefined
                ? Number(transfer.order?.price).toFixed(5)
                : '—'}
            </Price>
            <EthImg src={ethIcon} />
          </PriceContainer>
        </>
      )
    },
    {
      columnName: 'Date',
      value:
        transfer.order?.statuses !== undefined
          ? formatDate(
            new Date(getLatestStatusTimestamp(transfer.order?.statuses))
          )
          : '—'
    }
  ]
})

export class TransfersHistoryStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data: TransfersResponseV2 = {}

  collectionAddress = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(profileAddress: string) {
    storeRequest<TransfersResponseV2>(
      this,
      api.v2.transfersHistoryDetail(profileAddress),
      (resp) => {
        this.data = resp
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

  get tableRows(): ITableRow[] {
    const { incoming = [], outgoing = [] } = this.data

    if (!incoming.length && !outgoing.length) {
      return []
    }

    const incomingRows = incoming.map<ITableRow>(convertTransferToTableRows)
    const outgoingRows = outgoing.map<ITableRow>(convertTransferToTableRows)

    return incomingRows.concat(outgoingRows)
  }
}
