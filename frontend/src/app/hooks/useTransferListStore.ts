
// You can eiter use collections outgoing or incoming field, or both
// Component, using this hook, MUST be wrapped into observer
import { useStores } from './useStores'
import { useEffect } from 'react'

export function useTransferListStore(address?: string) {
  const { transferList } = useStores()
  useEffect(() => {
    if (address) {
      transferList.activate(address)
    }
    return () => transferList.deactivate()
  }, [address])
  return transferList
}
