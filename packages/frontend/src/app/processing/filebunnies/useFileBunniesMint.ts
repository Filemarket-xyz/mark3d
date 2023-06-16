import { BigNumber } from 'ethers'
import { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { api } from '../../config/api'
import { useAuth } from '../../hooks/useAuth'
import { useCheckWhiteListStore } from '../../hooks/useCheckWhiteListStore'
import { useStatusModal } from '../../hooks/useStatusModal'
import { IRarityWl } from '../../stores/FileBunnies/FileBunniesTokenIdStore'
import { fromCurrency } from '../../utils/web3'
import { useFulfillOrder } from '../nft-interaction'

interface ISequencerReq {
  suffix?: string
  collectionAddress?: string
}

interface IGetSignWhiteList {
  address?: `0x${string}`
  whiteList?: IRarityWl
}

export const useFileBunniesMint = () => {
  const { address, isConnected } = useAccount()
  const whiteListStore = useCheckWhiteListStore(address)
  const { connect } = useAuth()
  const [isLoadingReq, setIsLoadingReq] = useState<boolean>(false)
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

  const getSignWhiteList = async({ whiteList, address }: IGetSignWhiteList) => {
    if (!(whiteList && address)) return
    const sign = await api.collections.fileBunniesWhitelistSignDetail(whiteList, address)

    return sign.data.signature
  }

  const payedMint = async () => {
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
  }

  const freeMint = async () => {
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
  }

  const { isLoading: isLoadingFulFill } = statuses

  const isLoading = useMemo(() => {
    return isLoadingFulFill || whiteListStore.isLoading || isLoadingReq
  }, [whiteListStore.isLoading, whiteListStore.isLoading, isLoadingReq])

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
