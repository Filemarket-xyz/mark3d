import { FC } from 'react'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'

export interface ButtonInitTransferProps {
  tokenFullId: TokenFullId
}

// TODO implement init transfer
export const ButtonInitTransfer: FC<ButtonInitTransferProps> = ({ tokenFullId }) => {
  return (
    <Button
      secondary
      fullWidth
      isDisabled
    >
      Gift
    </Button>
  )
}
