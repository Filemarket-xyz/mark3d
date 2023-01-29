import { FC } from 'react'
import { useWeb3Modal } from '@web3modal/react'
import { Button } from '../../../UIkit'

export const ConnectButton: FC = () => {
  const { open } = useWeb3Modal()
  // onClick instead of onPress, cos web3modal closes when using onPress
  return (
    <Button onClick={() => open()} small secondary>
      Connect
    </Button>
  )
}
