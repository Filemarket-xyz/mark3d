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
      encryptedPassword: hexToBuffer('0x3b470c413eeb6ee2d96f43596d722147e3d8fcaf19b087ef83eb073674690684f867bb1f6a73f2e64d6e8b4773bc9be2c9c8a8536576f8e2df4195f75b6a93b449217294f713d1df43dacfbb581818164a6daf3bb5045bf118500203e0a361ab7041bc8735376c9051fa7fa619520263e01717eeea36d398155f4452616c4bf75d5fcf7ab3d3af660f324c80c78c92929385b75439410faf2b1927280b5aee90d672ac05263e7b3ba89892d7f4ede30e3e8a0db0675fa80d830dabcf836bb752bc9e83c513e074811691862a65aecdbef1c17502475ee1951e3c42f2f833b32931b258b8aacc797557349a19c3000cc2616dee28bc4e200a4ff8fbd1a8022f19e162d8c77a0f2b8eaf0c68fd2cd026bfa99dabe245969840fb33eb53991e65117fdb01290da728269be0af92262843ed398fcc7a70a855d47df0d864cb46b57bc54ce21cc7e5ec731d74a1765ab8800ed9f76e0419730b04ce8e0d20f1341e6e6d6c563dfd50204a98a41d2c0811138d8fd0de10938a24bd1358d02a2371c85da27c5da23c5e9da131a70d7f21f355946c7578e8ca7be4314ed12bc7986e904373a71711fb5b603c0fdb0d440d16cdec84d00bba150e6106ffb574d560cd5ade6b0493fcad04019b2dfd8157a129fa9e00ec69e0fc3790151c776b3f91a52a16bc48ba5a80d93d3b498a1037910c2928d66f41a7f8f4b0bd38453538391d763d'),
      dealNumber: dealNumberBN.toNumber()
    })
  }

  useEffect(
    () => autorun(createLastTransferInfo),
    [tokenStore.data, contract, lastTransferInfoStore.data, address]
  )

  return useMemo(() => lastTransferInfo, [lastTransferInfo])
}
