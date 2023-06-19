import { useCallback, useEffect } from 'react'
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
  const { seedProvider } = useSeedProvider(address)
  const canUnlock = useCanUnlock(address)

  const openConnectFileWalletDialog = useCallback(() => {
    if (dialogStore.isDialogOpenByName(canUnlock ? 'UnlockFWDialog' : 'ConnectMain')) return
    dialogStore.openDialog({
      component: canUnlock ? UnlockFWDialog : ConnectFileWalletDialog,
      props: {
        // @ts-expect-error
        name: canUnlock ? 'UnlockFWDialog' : 'ConnectMain',
      },
    })
  }, [dialogStore, canUnlock])

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
    if (address && seedProvider && seedProvider.isForAccount(address)) {
      openConnectFileWalletDialog()
    }
  }, [address, seedProvider, openConnectFileWalletDialog, canUnlock])

  // locks seed if account disconnects
  useEffect(() => {
    if (!address) {
      void seedProvider?.lock()
    }
  }, [address, seedProvider])

  // disconnect if account changes
  useEffect(() => {
    if (address && seedProvider && !seedProvider?.isForAccount(address)) {
      disconnect()
    }
  }, [address, disconnect, seedProvider])
}
