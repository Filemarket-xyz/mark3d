import { makeAutoObservable } from 'mobx'

import { CollectionData } from '../../../swagger/Api'
import { api } from '../../config/api'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import type { RootStore } from '../RootStore'

export class PublicCollectionStore implements IActivateDeactivate, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data: CollectionData = {}

  constructor({ errorStore }: RootStore) {
    this.errorStore = errorStore
    makeAutoObservable(this)
  }

  setData(data: CollectionData) {
    this.data = data
  }

  private request() {
    storeRequest(
      this,
      api.collections.fullPublicList(),
      (data) => this.setData(data),
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

  get collectionMintOption() {
    return {
      title: this.data.collection?.name ?? '',
      id: this.data.collection?.address ?? '',
    }
  }
}
