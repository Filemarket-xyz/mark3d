import { DialogStore } from './Dialog/DialogStore'
import { ErrorStore } from './Error/ErrorStore'
import { CollectionAndTokenListStore } from './CollectionAndTokenList/CollectionAndTokenListStore'
import { TransferListStore } from './Transfer/TransferListStore'
import { CollectionTokenListStore } from './CollectionTokenList/CollectionTokenListStore'
import { TransferStore } from './Transfer/TransferStore'
import { OrderStore } from './Order/OrderStore'

export class RootStore {
  dialogStore: DialogStore
  errorStore: ErrorStore
  collectionAndTokenList: CollectionAndTokenListStore
  transferListStore: TransferListStore
  transferStore: TransferStore
  collectionTokenList: CollectionTokenListStore
  orderStore: OrderStore

  constructor() {
    this.dialogStore = new DialogStore()
    this.errorStore = new ErrorStore(this)
    this.collectionAndTokenList = new CollectionAndTokenListStore(this)
    this.transferListStore = new TransferListStore(this)
    this.transferStore = new TransferStore(this)
    this.collectionTokenList = new CollectionTokenListStore(this)
    this.orderStore = new OrderStore(this)
  }
}

export const rootStore = new RootStore()
