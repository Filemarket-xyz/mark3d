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
import * as dayjs from 'dayjs'
import { formatCurrency } from '../../utils/web3/currency'
import Badge from '../../components/Badge/Badge'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'

const getLatestStatusTimestamp = (statuses?: OrderStatusInfo[]) => {
  if (!statuses) return 0

  return statuses.reduce(
    (acc, value) => (value > acc ? value.timestamp ?? 0 : acc),
    -Infinity
  )
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

const convertTransferToTableRows = (target: 'incoming' | 'outgoing') => {
  const eventOptions =
    target === 'incoming' ? ['Receive', 'Buy'] : ['Send', 'Sale']

  return (transfer: TransferWithData) => ({
    cells: [
      {
        columnName: 'Event',
        value:
          (transfer.order?.id ?? 0) === 0 ? eventOptions[0] : eventOptions[1]
      },
      {
        columnName: 'Object',
        value: (
          <Badge
            image={{
              borderRadius: 'roundedSquare',
              url: getHttpLinkFromIpfsString(transfer.collection?.image ?? '')
            }}
            content={{
              value: reduceAddress(transfer.collection?.owner ?? '—'),
              title: transfer.collection?.name ?? '—'
            }}
            small
            wrapperProps={{ css: { padding: 0 } }}
          />
        )
      },
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
                  ? formatCurrency(transfer.order.price)
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
            ? dayjs(getLatestStatusTimestamp(transfer.order?.statuses)).format(
              'MMM D[,] YYYY [at] HH[:]mm'
            )
            : '—'
      }
    ]
  })
}

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

    const incomingRows = incoming.map<ITableRow>(
      convertTransferToTableRows('incoming')
    )
    const outgoingRows = outgoing.map<ITableRow>(
      convertTransferToTableRows('outgoing')
    )

    return incomingRows.concat(outgoingRows)
  }
}
