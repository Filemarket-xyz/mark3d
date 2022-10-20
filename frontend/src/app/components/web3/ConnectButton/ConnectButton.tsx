import { FC } from 'react'
import { useConnectModal } from '@web3modal/react'
import { Button } from '../../../UIkit'

export const ConnectButton: FC = () => {
  const { open } = useConnectModal()
  return (
    <Button onPress={open} small primary>
      Connect
    </Button>
  )
}
