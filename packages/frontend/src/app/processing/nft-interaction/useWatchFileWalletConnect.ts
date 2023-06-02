import { useCallback, useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

import { ConnectFileWalletDialog } from '../../components/Web3/ConnectFileWalletDialog'
import { UnlockFWDialog } from '../../components/Web3/UnlockFWDialog/UnlockFWDialog'
import { useStores } from '../../hooks'
import { useSeedProvider } from '../SeedProvider'
import { useCanUnlock } from '../SeedProvider/useCanUnlock'

export default function useWatchFileWalletConnect(): void {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { dialogStore } = useStores()
  const [checkHasSeed, setCheckHasSeed] = useState(true)
  const { seedProvider } = useSeedProvider(address)
  const canUnlock = useCanUnlock(address)

  const openConnectFileWalletDialog = useCallback(() => {
    dialogStore.closeDialogByName('ConnectMain')
    dialogStore.openDialog({
      component: canUnlock ? UnlockFWDialog : ConnectFileWalletDialog,
      props: {
        name: canUnlock ? 'UnlockFWDialog' : 'ConnectMain',
      },
    }).onClose(() => setCheckHasSeed(true))
  }, [dialogStore, setCheckHasSeed, canUnlock])

  const checkGetAccessPagePath = () => {
    return window.location.pathname === '/' || window.location.pathname === '/successGetAccess'
  }

  useEffect(() => {
    if (checkGetAccessPagePath()) return
    if ((checkHasSeed && !seedProvider?.seed)) {
      disconnect()
    }
    setCheckHasSeed(false)
  }, [checkHasSeed, setCheckHasSeed, seedProvider])

  useEffect(() => {
    console.log('init watch file wallet connect')

    return () => {
      console.log('destroy watch file wallet connect')
    }
  }, [])

  useEffect(() => {
    console.log('use file wallet watch', 'address change', address)
  }, [address])

  // opens connect dialog if account has connected, but there is no seed
  useEffect(() => {
    if (checkGetAccessPagePath()) return
    if (address && seedProvider && seedProvider.isForAccount(address) && !seedProvider?.seed) {
      console.log('OPEN')
      openConnectFileWalletDialog()
    }
  }, [address, seedProvider, openConnectFileWalletDialog])

  // locks seed if account disconnects
  useEffect(() => {
    if (checkGetAccessPagePath()) return
    if (!address) {
      void seedProvider?.lock()
    }
  }, [address, seedProvider])

  // disconnect if account changes
  useEffect(() => {
    if (checkGetAccessPagePath()) return
    if (address && seedProvider && !seedProvider?.isForAccount(address)) {
      disconnect()
    }
  }, [address, disconnect, seedProvider])
}
