import { FC } from 'react'
import { ConnectButton } from '../../Web3'
import { useAccount } from 'wagmi'
import { AppPlusNav } from '../AppPlusNav'
import { AppAccountMenu } from '../AppAccountMenu'
import useAppAuthAndConnect from '../../../hooks/useAppAuthAndConnect'
import { useStores } from '../../../hooks'
import { observer } from 'mobx-react-lite'

export const AppConnectWidget: FC = observer(() => {
  const { isConnected, address } = useAccount()
  const { connect } = useAppAuthAndConnect()
  const { authStore } = useStores()
  if (isConnected && address && authStore.isAuth) {
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
})
