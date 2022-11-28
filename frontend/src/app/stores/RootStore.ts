import { DialogStore } from './Dialog/DialogStore'
import { ErrorStore } from './Error/ErrorStore'
import { CollectionAndTokenListStore } from './CollectionAndTokenList/CollectionAndTokenListStore'
import { TransferListStore } from './Transfer/TransferListStore'
import { CollectionTokenListStore } from './CollectionTokenList/CollectionTokenListStore'
import { TransferStore } from './Transfer/TransferStore'
import { OrderStore } from './Order/OrderStore'
import { TokenStore } from './Token/TokenStore'
import { TokenMetaStore } from './Token/TokenMetaStore'
import { OpenOrderListStore } from './OrderList/OrderListStore'

export class RootStore {
  dialogStore: DialogStore
  errorStore: ErrorStore
  collectionAndTokenList: CollectionAndTokenListStore
  transferListStore: TransferListStore
  transferStore: TransferStore
  collectionTokenList: CollectionTokenListStore
  orderStore: OrderStore
  tokenStore: TokenStore
  tokenMetaStore: TokenMetaStore
  orderListStore: OpenOrderListStore

  constructor() {
    this.dialogStore = new DialogStore()
    this.errorStore = new ErrorStore(this)
    this.collectionAndTokenList = new CollectionAndTokenListStore(this)
    this.transferListStore = new TransferListStore(this)
    this.transferStore = new TransferStore(this)
    this.collectionTokenList = new CollectionTokenListStore(this)
    this.orderStore = new OrderStore(this)
    this.tokenStore = new TokenStore(this)
    this.tokenMetaStore = new TokenMetaStore(this)
    this.orderListStore = new OpenOrderListStore(this)
  }
}

export const rootStore = new RootStore()
