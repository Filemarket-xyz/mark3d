import { observer } from 'mobx-react-lite'
import { Transfer } from '../../../../../swagger/Api'
import { FC } from 'react'
import { TokenFullId } from '../../../../processing/types'
import { useCheckOwner } from '../../../../processing/hooks'
import { NFTDealActionOwner } from './NFTDealActionsOwner'
import { NFTDealActionsBuyer } from './NFTDealActionsBuyer'
import { Txt } from '../../../../UIkit'
import { stringifyError } from '../../../../utils/error'

export interface NFTDealActionsProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
}

export const NFTDealActions: FC<NFTDealActionsProps> = observer(({ tokenFullId, transfer }) => {
  return useCheckOwner({
    tokenFullId,
    owner: <NFTDealActionOwner transfer={transfer} tokenFullId={tokenFullId}/>,
    notOwner: <NFTDealActionsBuyer transfer={transfer} tokenFullId={tokenFullId}/>,
    error: error => <Txt color="red">{stringifyError(error)}</Txt>
  })
})
