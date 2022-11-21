import { DialogStore } from './Dialog/DialogStore'
import { ErrorStore } from './Error/ErrorStore'
import { CollectionAndTokenListStore } from './CollectionAndTokenList/CollectionAndTokenListStore'
import { CollectionTokenListStore } from './CollectionTokenList/CollectionTokenListStore'

export class RootStore {
  dialogStore: DialogStore
  errorStore: ErrorStore
  collectionAndTokenList: CollectionAndTokenListStore
  collectionTokenList: CollectionTokenListStore

  constructor() {
    this.dialogStore = new DialogStore()
    this.errorStore = new ErrorStore(this)
    this.collectionAndTokenList = new CollectionAndTokenListStore(this)
    this.collectionTokenList = new CollectionTokenListStore(this)
  }
}

export const rootStore = new RootStore()
