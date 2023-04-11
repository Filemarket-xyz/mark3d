import { ErrorStore } from '../Error/ErrorStore'
import { makeAutoObservable } from 'mobx'
export class AuthStore {
  errorStore: ErrorStore

  isAuth: boolean

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.isAuth = false
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  setIsAuth = (value: boolean) => {
    this.isAuth = value
  }

  logout = () => {
    localStorage.removeItem('mnemonic')
    this.setIsAuth(false)
  }
}
