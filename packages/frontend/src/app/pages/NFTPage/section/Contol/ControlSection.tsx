import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { NFTDeal } from '../../../../components/NFT'
import { useOrderStore } from '../../../../hooks/useOrderStore'
import { useTransferStoreWatchEvents } from '../../../../hooks/useTransferStoreWatchEvents'
import { makeTokenFullId } from '../../../../processing/utils/id'
import { Params } from '../../../../utils/router'
import { GridBlock } from '../../helper/styles/style'

const ControlSection = () => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const transferStore = useTransferStoreWatchEvents(collectionAddress, tokenId)
  const orderStore = useOrderStore(collectionAddress, tokenId)
  const tokenFullId = useMemo(
    () => makeTokenFullId(collectionAddress, tokenId),
    [collectionAddress, tokenId],
  )

  return (
    <GridBlock>
      {tokenFullId && (
        <NFTDeal
          transfer={transferStore.data}
          order={orderStore.data}
          tokenFullId={tokenFullId}
          reFetchOrder={() => {
            orderStore.reload()
            transferStore.reload()
          }}
        />
      )}
    </GridBlock>
  )
}

export default ControlSection
