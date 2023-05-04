import { useEffect } from 'react'
import { useAccount } from 'wagmi'

export function useCloseIfNotConnected(onClose: () => void) {
  const { address } = useAccount()
  useEffect(() => {
    if (!address) {
      onClose()
    }
  }, [address, onClose])
}
