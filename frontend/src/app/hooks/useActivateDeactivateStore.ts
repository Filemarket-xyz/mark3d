import { IActivateDeactivate } from '../utils/store'
import { useEffect, useRef } from 'react'

export function useActivateDeactivateAddress(store: IActivateDeactivate<[string]>, address?: string) {
  // flag ensures, that store is deactivated only if it was activated
  const activated = useRef<boolean>(false)

  useEffect(() => {
    if (address && !store.isActivated) {
      activated.current = true
      store.activate(address)
    }
    return () => {
      if (activated.current) {
        activated.current = false
        store.deactivate()
      }
    }
  }, [address, activated])
}
