import { FC, ReactNode } from 'react'
import { ConnectButton } from '../ConnectButton'
import { Button } from '../../../UIkit'
import { AddressIcon } from '../AddressIcon'
import { styled } from '../../../../styles'
import { useAccount } from 'wagmi'

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
        <Button icon primary small iconCover>
          <IconWrapper>
            <AddressIcon address={address} size={36}/>
          </IconWrapper>
        </Button>
      </>
    )
  } else {
    return (
      <ConnectButton/>
    )
  }
}
