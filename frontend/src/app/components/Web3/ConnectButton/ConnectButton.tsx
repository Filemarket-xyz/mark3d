import { FC } from 'react'
import { useWeb3Modal } from '@web3modal/react'
import { Button } from '../../../UIkit'

export const ConnectButton: FC = () => {
  const { open } = useWeb3Modal()
  return (
    <Button onPress={() => open()} small secondary>
      Connect
    </Button>
  )
}
