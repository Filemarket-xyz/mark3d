import { FC, useState } from 'react'
import { Button, Popover, PopoverContent, PopoverTrigger } from '../../../UIkit'
import { styled } from '../../../../styles'
import { AddressIcon, DisconnectButton, SwitchNetworkButton } from '../../Web3'
import { useNetwork } from 'wagmi'
import { mark3dConfig } from '../../../config/mark3d'
import { AccountButton } from './AccountButton'
import { Warning } from '@mui/icons-material'

const Spacer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: '$3'
})

const IconWrapper = styled('div', {
  background: '$white',
  dflex: 'center'
})

export interface AppAccountMenuProps {
  address: string
}

export const AppAccountMenu: FC<AppAccountMenuProps> = ({ address }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { chain } = useNetwork()
  const needToSwitchNetwork = chain && chain?.id !== mark3dConfig.chain.id
  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button icon primary small iconCover>
          <IconWrapper>
            {needToSwitchNetwork ? (
              <Warning
                sx={{
                  color: 'var(--colors-red)'
                }}
              />
            ) : (
              <AddressIcon
                address={address}
                size={36}
              />
            )}
          </IconWrapper>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Spacer>
          {needToSwitchNetwork && (
            <SwitchNetworkButton/>
          )}
          <AccountButton address={address}/>
          <DisconnectButton/>
        </Spacer>
      </PopoverContent>
    </Popover>
  )
}
