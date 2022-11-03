import { FC } from 'react'
import { useAccount } from '@web3modal/react'
import { ConnectButton } from '../ConnectButton'
import { Button } from '../../../UIkit'
import Logo from '../../../../assets/icons/Plus.svg'
import { AddressIcon } from '../AddressIcon'
import { styled } from '../../../../styles'

const IconWrapper = styled('div', {
  background: '$white',
  dflex: 'center'
})

export const ConnectWidget: FC = () => {
  const { isConnected, address } = useAccount()
  if (isConnected) {
    return (
      <>
        <Button icon primary small>
          <img src={Logo} alt="plus"/>
        </Button>
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
