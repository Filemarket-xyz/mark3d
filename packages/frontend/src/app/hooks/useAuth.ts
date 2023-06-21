import { useWeb3Modal } from '@web3modal/react'

import { ConnectFileWalletDialog } from '../components/Web3/ConnectFileWalletDialog'
import { useStores } from './useStores'

export const useAuth = () => {
  const { dialogStore } = useStores()
  const { open: openWeb3Modal } = useWeb3Modal()

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
    connect: openDialog,
  }
}
