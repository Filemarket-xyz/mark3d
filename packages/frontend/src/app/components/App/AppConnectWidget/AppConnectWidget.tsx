import { useWeb3Modal } from '@web3modal/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'
import { useAccount } from 'wagmi'

import { useStores } from '../../../hooks'
import { useCanUnlock } from '../../../processing/SeedProvider/useCanUnlock'
import { ConnectButton } from '../../Web3'
import { ConnectFileWalletDialog } from '../../Web3/ConnectFileWalletDialog'
import { AppAccountMenu } from '../AppAccountMenu'
import { AppPlusNav } from '../AppPlusNav'

export const AppConnectWidget: FC = observer(() => {
  const { isConnected, address } = useAccount()
  const { dialogStore } = useStores()
  const { isOpen, open: openWeb3Modal } = useWeb3Modal()
  const [isCloseForConnect, setIsCloseForConnect] = useState<boolean>(false)
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
        name: 'ConnectMain',
        isOpen,
        openWeb3Modal: () => { openWeb3Modal(); setIsCloseForConnect(true) },
      },
    })
  }

  if (isConnected && address) {
    return (
      <>
        <AppPlusNav />
        <AppAccountMenu address={address} />
      </>
    )
  } else {
    return (
      <ConnectButton connectFunc={() => {
        connect()
      }}
      />
    )
  }
})
