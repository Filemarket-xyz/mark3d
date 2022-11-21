import { DialogStore } from './Dialog/DialogStore'
import { ErrorStore } from './Error/ErrorStore'
import { CollectionAndTokenList } from './CollectionAndTokenList/CollectionAndTokenListStore'
import { TransferListStore } from './TransferList/TransferListStore'

export class RootStore {
  dialogStore: DialogStore
  errorStore: ErrorStore
  collectionAndTokenList: CollectionAndTokenList
  transferList: TransferListStore

  constructor() {
    this.dialogStore = new DialogStore()
    this.errorStore = new ErrorStore(this)
    this.collectionAndTokenList = new CollectionAndTokenList(this)
    this.transferList = new TransferListStore(this)
  }
}

export const rootStore = new RootStore()
