import { makeAutoObservable } from 'mobx'

export const defaultPageSize = 24 // divided by 2, 3, 4

export interface PageState {
  page: number
  size: number
  total: number
}

export const initialPage = (): PageState => ({
  page: 0,
  size: defaultPageSize,
  total: 0
})

export class PageStore {
  page: PageState = initialPage()

  constructor() {
    makeAutoObservable(this)
  }

  next() {
    this.page.page++
  }

  prev() {
    if (this.page.page > 0) {
      this.page.page--
    }
  }

  setSize(size: number) {
    this.page.size = size
  }

  setTotal(total: number) {
    this.page.total = total
  }

  reset() {
    this.page = initialPage()
  }
}
