import { observer } from 'mobx-react-lite'
import { Transfer } from '../../../../../swagger/Api'
import { TokenFullId } from '../../../../processing/types'
import { FC } from 'react'

export interface NFTDealActionsBuyerProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
}

export const NFTDealActionsBuyer: FC<NFTDealActionsBuyerProps> = observer(({ transfer, tokenFullId }) => {
  return (
    <div>
      {JSON.stringify(tokenFullId)}
    </div>
  )
})
