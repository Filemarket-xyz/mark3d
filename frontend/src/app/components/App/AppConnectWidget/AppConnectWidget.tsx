import { FC } from 'react'
import { ConnectButton } from '../../Web3'
import { useAccount } from 'wagmi'
import { AppPlusNav } from '../AppPlusNav'
import { AppAccountMenu } from '../AppAccountMenu'

export const AppConnectWidget: FC = () => {
  const { isConnected, address } = useAccount()
  if (isConnected && address) {
    return (
      <>
        <AppPlusNav/>
        <AppAccountMenu address={address}/>
      </>
    )
  } else {
    return (
      <ConnectButton/>
    )
  }
}
