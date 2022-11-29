import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeRequestFetch,
  storeReset
} from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { makeAutoObservable } from 'mobx'
import { ERC721TokenMeta } from '../../processing/types'
import { ipfsService } from '../../services/IPFSService'

export class TokenMetaStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  requestCount = 0
  currentRequest?: RequestContext

  isActivated = false
  isLoading = false
  isLoaded = false

  metaURI?: string = undefined

  meta?: ERC721TokenMeta = undefined

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  request(metaURI: string) {
    storeRequestFetch(
      this,
      ipfsService.fetchText(metaURI),
      data => {
        console.log('fetched meta', data)
        this.meta = JSON.parse(data)
      }
    )
  }

  activate(metaURI: string) {
    this.metaURI = metaURI
    this.isActivated = true
    this.request(this.metaURI)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }
}
