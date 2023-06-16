import { useWeb3Modal } from '@web3modal/react'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { ConnectFileWalletDialog } from '../components/Web3/ConnectFileWalletDialog'
import { useCanUnlock } from '../processing/SeedProvider/useCanUnlock'
import { useStores } from './useStores'

export const useAuth = () => {
  const { isConnected, address } = useAccount()
  const { dialogStore } = useStores()
  const { open: openWeb3Modal } = useWeb3Modal()
  const canUnlock = useCanUnlock(address)
  const connect = useCallback(() => {
    if (canUnlock) {
      void openWeb3Modal()
    } else {
      void openDialog()
    }
  }, [canUnlock])
  const openDialog = () => {
    dialogStore.openDialog({
      component: ConnectFileWalletDialog,
      props: {
        // @ts-expect-error
        name: 'ConnectMain',
        openWeb3Modal,
      },
    })
  }

  return {
    connect,
  }
}
