import { FC } from 'react'
import { ConnectButton } from '../../Web3'
import { useAccount } from 'wagmi'
import { AppPlusNav } from '../AppPlusNav'
import { AppAccountMenu } from '../AppAccountMenu'
import { observer } from 'mobx-react-lite'
import { useWeb3Modal } from '@web3modal/react'

export const AppConnectWidget: FC = observer(() => {
  const { isConnected, address } = useAccount()
  const { open } = useWeb3Modal()
  if (isConnected && address) {
    return (
      <>
        <AppPlusNav/>
        <AppAccountMenu address={address}/>
      </>
    )
  } else {
    return (
      <ConnectButton connectFunc={() => { void open() }}/>
    )
  }
})
