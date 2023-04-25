import { BigNumber } from 'ethers'
import { autorun } from 'mobx'
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { dealNumberMock, hexToBuffer, useCollectionContract } from '../processing'
import { useLastTransferInfoStore } from './useLastTransferInfoStore'
import { useTokenStore } from './useTokenStore'

export const useLastTransferInfo = (collectionAddress?: string, tokenId?: string) => {
  const { address } = useAccount()
  const [lastTransferInfo, setLastTransferInfo] = useState<{ dealNumber?: number, encryptedPassword?: ArrayBuffer }>({})
  const tokenStore = useTokenStore(collectionAddress, tokenId)
  const lastTransferInfoStore = useLastTransferInfoStore(collectionAddress, tokenId)
  const { contract } = useCollectionContract(collectionAddress)

  const createLastTransferInfo = async () => {
    if (
      !tokenStore.data ||
      tokenStore.data?.creator === address ||
      !contract /* ||
      !lastTransferInfoStore.data?.encryptedPassword */
    ) {
      return setLastTransferInfo({})
    }

    // const dealNumberBN = await contract.transferCounts(BigNumber.from(tokenStore.data.tokenId))
    const dealNumberBN = BigNumber.from(dealNumberMock)

    setLastTransferInfo({
      // encryptedPassword: lastTransferInfoStore.data?.encryptedPassword
      encryptedPassword: hexToBuffer('0x7b05db1929c58a99bcf73574ac70cb101140183afe2fd76ed9b16caf9079e5b4010801c657455c0b789aa7f39dd777b6f1ef0be4803b56698f416b807ce7b28f898dfe4d15ee18976066a06adf96a60315af2f130949487e73c14c7a68ec8d59216326a0132cf9e69d5fed0cbfc5a1eb73255a11e274452f133bbe56dd03ac24c29d56fe178079233d78120f9d2a54a94b1f285037d4bab47bf8e619449ceff7c1b2a8a44e61455b679c65ef4af6a433125414c1bbd0962f6e48e1363b057919593a0a66ea4b3dacea0537a4b654bda9310b6a414c02f402f516c5b5d4177e6399f96ba1810cb87c697f1074af77d5f9ffa0ecae587ba3ef4f4d91f9885b3dc8384b991162a37f0d1b147bdc96b9a4e85ecafdea30afa0dcc090521a3aa91122ea0d79e6d96afc7a03b5511baba5849ac181dd915f71da1bb8247344533ff58724dc9877cbeeaa9df57226b5104b21f9fae56a0f4a77460ee6d147b7f682197a6c5ccb8a9c1d87c1e444c68654dd755d2b882c33a2c94e65dfef7666d72742a92825838c2a052bb000387639f4ef2851b547907bd2911e12b4a73ad9971844d94b37645c35be4c595805d5ee47174e6dede62a1468c5eef7cd830a032ab56146bb8e4920e117eb7cc57d7937ffcec7307b13925cdda2221ef886f879bc7e631ad604a7919a3627184aca4698a3c4dd3cf2adf5463c3a3d14d2d9e44f56aad027'),
      dealNumber: dealNumberBN.toNumber()
    })
  }

  useEffect(
    () => autorun(createLastTransferInfo),
    [tokenStore.data, contract, lastTransferInfoStore.data, address]
  )

  return useMemo(() => lastTransferInfo, [lastTransferInfo])
}
