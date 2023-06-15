import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'

import { useStores } from '../../hooks'
import { useStatusModal } from '../../hooks/useStatusModal'
import { IRarityWl } from '../../stores/FileBunnies/FileBunniesTokenStore'
import { fromCurrency } from '../../utils/web3'
import { useFulfillOrder } from '../nft-interaction'
import { useCheckWhitelist } from './useCheckWhitelist'

export const useFileBunniesMint = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0))
  const [isFreeMint, setIsFreeMint] = useState<boolean | undefined>()
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const { whiteList } = useCheckWhitelist({ address })
  const { fileBunniesTokenStore } = useStores()
  const collectionAddress = '0xf4e64807a98AE794dD6d0F52829F25e6D8B329Ff'
  const { fulfillOrder, ...statuses } = useFulfillOrder({
    collectionAddress,
    tokenId: fileBunniesTokenStore.data?.tokenId,
  }, price)

  useEffect(() => {
    if (fileBunniesTokenStore.data?.tokenId !== undefined && isFreeMint !== undefined) {
      fulfillOrder()
      setIsFreeMint(undefined)
      fileBunniesTokenStore.resetData()
    }
  }, [fileBunniesTokenStore.data?.tokenId, isFreeMint])

  const prepare = useCallback(async ({ rarityWl }: { rarityWl?: IRarityWl }) => {
    if (!fileBunniesTokenStore.isActivated) {
      await fileBunniesTokenStore.activate(
        collectionAddress.toLowerCase() as `0x${string}`,
        rarityWl,
      )
    } else await fileBunniesTokenStore.reload()
  }, [signer])

  const freeMint = useCallback(async () => {
    setPrice(BigNumber.from(1))
    setIsFreeMint(true)
    await prepare({ rarityWl: whiteList })
  }, [signer])

  const mint = useCallback(async () => {
    setPrice(fromCurrency(10))
    setIsFreeMint(false)
    await prepare({ rarityWl: 'payed' })
  }, [signer])

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
