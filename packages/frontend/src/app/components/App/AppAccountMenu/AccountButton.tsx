import { FC } from 'react'
import { NavLink } from '../../../UIkit'
import { PressEvent } from '@react-types/shared/src/events'

export interface AccountButtonProps {
  address: string
  onPress?: (e: PressEvent) => void
}

export const AccountButton: FC<AccountButtonProps> = ({ address, onPress }) => {
  return (
    <NavLink
      to={`/profile/${address}`}
      onPress={onPress}
    >
      View account
    </NavLink>
  )
}
