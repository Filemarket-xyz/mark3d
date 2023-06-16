import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { api } from '../../config/api'
import { useAuth } from '../../hooks/useAuth'
import { useCheckWhiteListStore } from '../../hooks/useCheckWhiteListStore'
import { useStatusModal } from '../../hooks/useStatusModal'
import { fromCurrency } from '../../utils/web3'
import { useFulfillOrder } from '../nft-interaction'

interface ISequencerReq {
  suffix?: string
  collectionAddress?: string
}

export const useFileBunniesMint = () => {
  const { address, isConnected } = useAccount()
  const whiteListStore = useCheckWhiteListStore(address)
  const { connect } = useAuth()

  const { fulfillOrder, ...statuses } = useFulfillOrder()

  const collectionAddressReq = async () => {
    const response = await api.collections.fullFileBinniesList()

    return response.data.collection?.address
  }

  const sequencerReq = async ({ suffix, collectionAddress }: ISequencerReq) => {
    if (!(collectionAddress && suffix)) return
    const tokenResp = await api.sequencer.acquireDetail(collectionAddress, { suffix })

    return tokenResp.data.tokenId
  }

  const payedMint = async () => {
    if (!isConnected) {
      connect()

      return
    }
    const collectionAddress = await collectionAddressReq() as `0x${string}`
    const tokenId = await sequencerReq({ suffix: 'payed', collectionAddress })
    fulfillOrder({
      collectionAddress,
      tokenId,
      price: fromCurrency(12),
    })
  }

  const freeMint = async () => {
    if (!isConnected) {
      connect()

      return
    }
    const collectionAddress = await collectionAddressReq() as `0x${string}`
    const tokenId = await sequencerReq({ suffix: whiteListStore.data?.whitelist, collectionAddress })
    fulfillOrder({
      collectionAddress,
      tokenId,
      price: BigNumber.from(1),
    })
  }

  const { isLoading: isLoadingFulFill } = statuses

  const isLoading = useMemo(() => {
    return isLoadingFulFill || whiteListStore.isLoading
  }, [whiteListStore.isLoading])

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
    freeMint,
    whiteList: whiteListStore.data?.whitelist,
  }
}
