import { BigNumber } from 'ethers'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import { api } from '../../config/api'
import { useStatusState } from '../../hooks'
import { useAuth } from '../../hooks/useAuth'
import { useCheckWhiteListStore } from '../../hooks/useCheckWhiteListStore'
import { useComputedMemo } from '../../hooks/useComputedMemo'
import { useStatusModal } from '../../hooks/useStatusModal'
import { wrapRequest } from '../../utils/error/wrapRequest'
import { fromCurrency } from '../../utils/web3'
import { useFulfillOrder } from '../nft-interaction'

interface ISequencerReq {
  suffix?: string
  collectionAddress?: string
}

interface IGetSignWhiteList {
  address?: `0x${string}`
  whiteList?: string
}

export const useFileBunniesMint = () => {
  const { address, isConnected } = useAccount()
  const whiteListStore = useCheckWhiteListStore(address)
  const { connect } = useAuth()
  const [isLoadingReq, setIsLoadingReq] = useState<boolean>(false)
  const { fulfillOrder, ...statuses } = useFulfillOrder()

  const { wrapPromise, statuses: statusesReq } = useStatusState()

  const collectionAddressReq = async () => {
    const response = await wrapRequest(async () => api.collections.fullFileBinniesList())

    return response?.data.collection?.address
  }

  const sequencerReq = async ({ suffix, collectionAddress }: ISequencerReq) => {
    if (!(collectionAddress && suffix)) return
    const tokenResp = await wrapRequest(async () => api.sequencer.acquireDetail(collectionAddress, { suffix }))

    return tokenResp?.data.tokenId
  }

  const getSignWhiteList = async({ whiteList, address }: IGetSignWhiteList) => {
    if (!(whiteList && address)) return
    const sign = await wrapRequest(async () => api.collections.fileBunniesWhitelistSignDetail(whiteList, address))

    return sign?.data.signature
  }

  const payedMint = wrapPromise(async () => {
    if (!isConnected) {
      connect()

      return
    }
    setIsLoadingReq(true)
    const collectionAddress = await collectionAddressReq() as `0x${string}`
    const tokenId = await sequencerReq({ suffix: 'payed', collectionAddress })
    await fulfillOrder({
      collectionAddress,
      tokenId,
      price: fromCurrency(0.01),
    })
    setIsLoadingReq(false)
  })

  const freeMint = wrapPromise(async () => {
    if (!isConnected) {
      connect()

      return
    }
    setIsLoadingReq(true)
    const collectionAddress = await collectionAddressReq() as `0x${string}`
    const tokenId = await sequencerReq({ suffix: whiteListStore.data?.whitelist, collectionAddress })
    const sign = await getSignWhiteList({ whiteList: whiteListStore.data?.whitelist, address })
    await fulfillOrder({
      collectionAddress,
      tokenId,
      price: BigNumber.from(1),
      signature: sign,
    })
    setIsLoadingReq(false)
  })

  const { isLoading: isLoadingFulFill } = statuses

  const isLoading = useComputedMemo(() => {
    console.log(whiteListStore.isLoading)

    return isLoadingFulFill || whiteListStore.isLoading || isLoadingReq
  }, [whiteListStore.isLoading, isLoadingReq, isLoadingFulFill])

  const { modalProps } = useStatusModal({
    statuses: {
      ...statuses,
      error: statuses.error ?? statusesReq.error,
    },
    okMsg: 'Order is fulfilled! Now you need to wait 4 minutes until it appears in your profile and you can continue the actions',
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
