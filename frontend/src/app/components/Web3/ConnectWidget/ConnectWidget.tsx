import { FC, ReactNode } from 'react'
import { ConnectButton } from '../ConnectButton'
import { AddressIcon } from '../AddressIcon'
import { styled } from '../../../../styles'
import { useAccount } from 'wagmi'
import { NavButton } from '../../../UIkit'

export interface ConnectWidgetProps {
  connectedContent?: ReactNode
}

const IconWrapper = styled('div', {
  background: '$white',
  dflex: 'center'
})

export const ConnectWidget: FC<ConnectWidgetProps> = ({ connectedContent }) => {
  const { isConnected, address } = useAccount()
  if (isConnected && address) {
    return (
      <>
        {connectedContent}
        <NavButton icon primary small iconCover to={`/profile/${address}`}>
          <IconWrapper>
            <AddressIcon address={address} size={36}/>
          </IconWrapper>
        </NavButton>
      </>
    )
  } else {
    return (
      <ConnectButton/>
    )
  }
}
