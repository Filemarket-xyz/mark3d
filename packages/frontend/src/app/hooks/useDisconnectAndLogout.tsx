import { useDisconnect } from 'wagmi'
import { useStores } from './useStores'

export const useDisconnectAndLogout = () => {
  const { disconnect } = useDisconnect()
  const { authStore } = useStores()
  const disconnectFunc = () => {
    authStore.logout()
    disconnect()
  }

  return { disconnect: disconnectFunc }
}
