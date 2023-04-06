import { FC } from 'react'
import { ConnectButton } from '../../Web3'
import { useAccount } from 'wagmi'
import { AppPlusNav } from '../AppPlusNav'
import { AppAccountMenu } from '../AppAccountMenu'
import useAppAuthAndConnect from "../../../hooks/useAppAuthAndConnect";

export const AppConnectWidget: FC = () => {
  const { isConnected, address } = useAccount()
  const { connect } = useAppAuthAndConnect()
  if (isConnected && address) {
    return (
      <>
        <AppPlusNav/>
        <AppAccountMenu address={address}/>
      </>
    )
  } else {
    return (
      <ConnectButton connectFunc={() => { void connect() }}/>
    )
  }
}
