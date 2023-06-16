import { mark3dConfig } from '../../config/mark3d'
import { useStores } from '../../hooks'
import { useStatusModal } from '../../hooks/useStatusModal'
import { fromCurrency } from '../../utils/web3'
import { useFulfillOrder } from '../nft-interaction'

export const useFileBunniesPayedMint = () => {
  const { fileBunniesTokenStore } = useStores()
  const { fulfillOrder: payedMint, ...statuses } = useFulfillOrder({
    collectionAddress: mark3dConfig.fileBunniesCollection.address,
    tokenId: fileBunniesTokenStore.data?.tokenId,
  }, fromCurrency(12), 'payed')

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
    payedMint,
  }
}
