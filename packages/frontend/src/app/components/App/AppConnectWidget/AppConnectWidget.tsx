import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { useAuth } from '../../../hooks/useAuth'
import { ConnectButton } from '../../Web3'
import { AppAccountMenu } from '../AppAccountMenu'
import { AppPlusNav } from '../AppPlusNav'

export const AppConnectWidget: FC = observer(() => {
  const { isConnected, address } = useAccount()
  const { connect } = useAuth()

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
