import { useAccount } from 'wagmi'
import { rootStore } from '../stores/RootStore'
import { useCallback, useEffect, useState } from 'react'
import { useWeb3Modal } from '@web3modal/react'
import {ConnectWalletWindow} from "../components/Dialog/ConnectWalletWindow/ConnectWalletWindow";

export default function useAppAuthAndConnect() {
  const { isConnected, address } = useAccount()
  const [isACanAuthEffect, setIsACanAuthEffect] = useState<boolean>(false)
  const { open } = useWeb3Modal()

  const openConnectDialog = () => {
    rootStore.dialogStore.openDialog({
      component: ConnectWalletWindow,
      props: { }
    })
  }

  useEffect(() => {
    if (isConnected && isACanAuthEffect) {
      openConnectDialog()
    }
  }, [isConnected, isACanAuthEffect])

  useEffect(() => {
    console.log(isConnected)
  }, [isConnected])

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
