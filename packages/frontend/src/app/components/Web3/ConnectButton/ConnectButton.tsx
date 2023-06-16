import { FC } from 'react'

import { Button } from '../../../UIkit'

interface ConnectButtonProps {
  connectFunc: () => void
}

export const ConnectButton: FC<ConnectButtonProps> = ({ connectFunc }) => {
  // onClick instead of onPress, cos web3modal closes when using onPress
  return (
    <Button
<<<<<<< HEAD
      small
      primary
      header
=======
      header
      small
      secondary
>>>>>>> 577cf91ce857b3235c9d04117df4b83940fa40e5
      onClick={async () => connectFunc()}
    >
      Connect
    </Button>
  )
}
