import { BigNumber } from 'ethers'
import { useCallback, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'

import { useStores } from '../../hooks'
import { useStatusModal } from '../../hooks/useStatusModal'
import { IRarityWl } from '../../stores/FileBunnies/FileBunniesTokenStore'
import { fromCurrency } from '../../utils/web3'
import { useFulfillOrder } from '../nft-interaction'
import { useCheckWhitelist } from './useCheckWhitelist'

export const useFileBunniesMint = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0))
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const { whiteList } = useCheckWhitelist({ address })
  const { fileBunniesTokenStore } = useStores()

  const { fulfillOrder, ...statuses } = useFulfillOrder({
    collectionAddress: '0xf4e64807a98AE794dD6d0F52829F25e6D8B329Ff',
    tokenId: fileBunniesTokenStore.data?.tokenId,
  }, price)

  const prepare = useCallback(async ({ rarityWl }: { rarityWl?: IRarityWl }) => {
    if (!fileBunniesTokenStore.isActivated) await fileBunniesTokenStore.activate('0xf4e64807a98AE794dD6d0F52829F25e6D8B329Ff'.toLowerCase() as `0x${string}`, rarityWl)
    else await fileBunniesTokenStore.reload()
  }, [signer, fileBunniesTokenStore.data?.tokenId])

  const freeMint = useCallback(async () => {
    setPrice(BigNumber.from(1))
    await prepare({ rarityWl: whiteList })
    await fulfillOrder()
  }, [signer, fileBunniesTokenStore.data?.tokenId])

  const mint = useCallback(async () => {
    setPrice(fromCurrency(10))
    await prepare({ rarityWl: 'payed' })
    await fulfillOrder()
  }, [signer, fileBunniesTokenStore.data?.tokenId])

  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order fulfilled! Now wait until owner of the EFT transfers you hidden files. ' +
      'After that, check the hidden files and finalize the transfer',
    loadingMsg: 'Fulfilling order',
  })

  return {
    isLoading,
    modalProps,
    mint,
    freeMint,
    whiteList,
  }
}
