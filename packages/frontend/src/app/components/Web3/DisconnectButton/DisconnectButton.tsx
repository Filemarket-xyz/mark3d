import { FC } from 'react'
import { useDisconnect } from 'wagmi'
import { Link } from '../../../UIkit'
import { PressEvent } from '@react-types/shared/src/events'

export interface DisconnectButtonProps {
  onPress?: (e: PressEvent) => void
}

export const DisconnectButton: FC<DisconnectButtonProps> = ({ onPress }) => {
  const { disconnect } = useDisconnect()
  return (
    <Link
      type="button"
      onPress={(e) => {
        disconnect()
        onPress?.(e)
      }}
    >
      Disconnect
    </Link>
  )
}
