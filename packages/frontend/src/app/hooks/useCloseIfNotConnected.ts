import { useAccount } from 'wagmi'
import { useEffect } from 'react'

export function useCloseIfNotConnected(onClose: () => void) {
  const { address } = useAccount()
  useEffect(() => {
    if (!address) {
      onClose()
    }
  }, [address, onClose])
}
