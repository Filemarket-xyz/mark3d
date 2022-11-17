import { useEffect, useState } from 'react'
import { PageStore } from '../stores/PageStore'

export const defaultPageSize = 24 // делится на 2, 3, 4

// Component MUST be wrapped into observer HOC
export function usePageStore(): PageStore | undefined {
  const [pageStore, setPageStore] = useState<PageStore>()
  useEffect(() => {
    const page = new PageStore()
    setPageStore(page)
  }, [])
  return pageStore
}
