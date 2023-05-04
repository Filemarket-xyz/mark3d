import { PressEvent } from '@react-types/shared/src/events'
import { FC } from 'react'
import { useSwitchNetwork } from 'wagmi'

import { mark3dConfig } from '../../../config/mark3d'
import { Link } from '../../../UIkit'

export interface SwitchNetworkButtonProps {
  onPress?: (e: PressEvent) => void
}

export const SwitchNetworkButton: FC<SwitchNetworkButtonProps> = ({ onPress }) => {
  const { switchNetwork, isLoading } = useSwitchNetwork()
  return (
    <Link
      red
      onPress={(e) => {
        switchNetwork?.(mark3dConfig.chain.id)
        onPress?.(e)
      }}
      isDisabled={!switchNetwork || isLoading}
    >
      Switch chain to {mark3dConfig.chain.name}
    </Link>
  )
}
