import { useAccount } from 'wagmi'
import { useCallback, useEffect, useState } from 'react'
import { useWeb3Modal } from '@web3modal/react'
import { ConnectWalletWindow } from '../components/Dialog/ConnectWalletWindow/ConnectWalletWindow'
import { useStores } from './useStores'
import { DialogRef } from '../stores/Dialog/DialogStore'

export default function useAppAuthAndConnect() {
  const { isConnected, address } = useAccount()
  const [isACanAuthEffect, setIsACanAuthEffect] = useState<boolean>(false)
  const [connectAccountDialog, setConnectAccountDialog] = useState<DialogRef>()
  const { dialogStore, authStore } = useStores()
  const { open } = useWeb3Modal()

  const openConnectDialog = () => {
    const window = dialogStore.openDialog({
      component: ConnectWalletWindow,
      props: {}
    })
    setConnectAccountDialog(window)
  }

  useEffect(() => {
    if (connectAccountDialog && authStore.isAuth) {
      connectAccountDialog.close()
    }
  }, [authStore.isAuth, connectAccountDialog])

  useEffect(() => {
    if (isConnected && isACanAuthEffect) {
      openConnectDialog()
    }
  }, [isConnected, isACanAuthEffect])

  const connect = useCallback(async () => {
    if (isConnected && address) {
      openConnectDialog()
    } else {
      void open().then(() => {
        setIsACanAuthEffect(true)
      })
    }
  }, [isConnected, address])

  return { connect }
}
