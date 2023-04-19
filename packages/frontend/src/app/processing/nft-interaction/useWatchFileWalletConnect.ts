import { useAccount, useDisconnect } from 'wagmi'
import { useCallback, useEffect, useState } from 'react'
import { ConnectFileWalletDialog } from '../../components/Web3/ConnectFileWalletDialog'
import { useStores } from '../../hooks'
import { useSeedProvider } from '../SeedProvider'

export default function useWatchFileWalletConnect(): void {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { dialogStore } = useStores()
  const [checkHasSeed, setCheckHasSeed] = useState(false)
  const { seedProvider } = useSeedProvider(address)

  const openConnectFileWalletDialog = useCallback(() => {
    dialogStore.openDialog({
      component: ConnectFileWalletDialog,
      props: {}
    }).onClose(() => setCheckHasSeed(true))
  }, [dialogStore, setCheckHasSeed])

  useEffect(() => {
    if (checkHasSeed && !seedProvider?.seed) {
      disconnect()
    }
    setCheckHasSeed(false)
  }, [checkHasSeed, setCheckHasSeed, seedProvider])

  // opens connect dialog if account has connected, but there is no seed
  useEffect(() => {
    if (address && seedProvider && seedProvider.isForAccount(address) && !seedProvider?.seed) {
      openConnectFileWalletDialog()
    }
  }, [address, seedProvider, openConnectFileWalletDialog])

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
