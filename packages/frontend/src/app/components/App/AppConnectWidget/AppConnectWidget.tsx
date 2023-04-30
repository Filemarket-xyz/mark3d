import { useWeb3Modal } from '@web3modal/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { ConnectButton } from '../../Web3'
import { AppAccountMenu } from '../AppAccountMenu'
import { AppPlusNav } from '../AppPlusNav'

export const AppConnectWidget: FC = observer(() => {
  const { isConnected, address } = useAccount()
  const { open } = useWeb3Modal()
  if (isConnected && address) {
    return (
      <>
        <AppPlusNav />
        <AppAccountMenu address={address} />
      </>
    )
  } else {
    return (
      <ConnectButton connectFunc={() => { void open() }} />
    )
  }
})
