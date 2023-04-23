import { FC } from 'react'
import {useAccount, useDisconnect} from 'wagmi'
import { Link } from '../../../UIkit'
import { PressEvent } from '@react-types/shared/src/events'
import {useSeedProvider} from "../../../processing";

export interface DisconnectButtonProps {
  onPress?: (e: PressEvent) => void
}

export const DisconnectButton: FC<DisconnectButtonProps> = ({ onPress }) => {
  const { disconnect } = useDisconnect()
    const { address } = useAccount()
    const { seedProvider } = useSeedProvider(address)
  return (
    <Link
      type="button"
      onPress={(e) => {
          seedProvider?.lock()
        disconnect()
        onPress?.(e)
      }}
    >
      Disconnect
    </Link>
  )
}
