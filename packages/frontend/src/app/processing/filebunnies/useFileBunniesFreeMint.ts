import { BigNumber } from 'ethers'
import { useAccount } from 'wagmi'

import { useStores } from '../../hooks'
import { useCheckWhiteListStore } from '../../hooks/useCheckWhiteListStore'
import { useStatusModal } from '../../hooks/useStatusModal'
import { IRarityWl } from '../../stores/FileBunnies/FileBunniesTokenIdStore'
import { useFulfillOrder } from '../nft-interaction'

export const useFileBunniesFreeMint = () => {
  const { address } = useAccount()
  const whiteListStore = useCheckWhiteListStore(address)
  const { fileBunniesTokenStore } = useStores()
  const collectionAddress = '0xf4e64807a98AE794dD6d0F52829F25e6D8B329Ff'
  const { fulfillOrder: freeMint, ...statuses } = useFulfillOrder({
    collectionAddress,
    tokenId: fileBunniesTokenStore.data?.tokenId,
  }, BigNumber.from(1), whiteListStore.data?.whitelist as IRarityWl)

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
    freeMint,
    whiteList: whiteListStore.data?.whitelist as IRarityWl,
  }
}
