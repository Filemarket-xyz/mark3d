import { BigNumber } from 'ethers'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import { SuccessNavBody } from '../../components/Modal/Modal'
import { api } from '../../config/api'
import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useAuth } from '../../hooks/useAuth'
import { useCheckWhiteListStore } from '../../hooks/useCheckWhiteListStore'
import { useComputedMemo } from '../../hooks/useComputedMemo'
import { useStatusModal } from '../../hooks/useStatusModal'
import { wrapRequest } from '../../utils/error/wrapRequest'
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
  const { fulfillOrder } = useFulfillOrder()

  const { wrapPromise, statuses } = useStatusState()

  const { modalProps, setModalBody, setModalOpen } = useStatusModal({
    statuses,
    okMsg: 'Order is fulfilled! Now you need to wait 4 minutes until it appears in your profile and you can continue the actions',
    loadingMsg: 'Fulfilling order',
  })

  const collectionAddressReq = async () => {
    const response = await wrapRequest(async () => api.collections.fullFileBunniesList({ limit: 1 }))

    return response.collection?.address
  }
  const sequencerReq = async ({ suffix, collectionAddress }: ISequencerReq) => {
    if (!(collectionAddress && suffix)) return
    const tokenResp = await wrapRequest(async () => api.sequencer.acquireDetail(collectionAddress, { suffix }))

    return tokenResp?.tokenId
  }
  const getSignWhiteList = async({ whiteList, address }: IGetSignWhiteList) => {
    if (!(whiteList && address)) return
    const sign = await wrapRequest(async () => api.collections.fileBunniesWhitelistSignDetail(whiteList, address))

    return sign?.signature
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
      price: mark3dConfig.fileBunniesPrice,
    })
    setIsLoadingReq(false)
    setModalBody(<SuccessNavBody
      buttonText='Show my FileBunny'
      link={`/collection/${collectionAddress}/${tokenId}`}
      onPress={() => {
        setModalOpen(false)
      }}
      underText={'Your EFT has been generated, but the purchase\n' +
        '        transaction is not yet complete. On your FileBunny page,\n' +
        '        you need to wait until the hidden file with gifts is\n' +
        '        transferred and becomes available for download. After\n' +
        '        this, you need to confirm the completion of the deal by clicking the "Send payment" or "Finalize the deal" button.'}
    />)
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
    setModalBody(<SuccessNavBody
      buttonText='Show my FileBunny'
      link={`/collection/${collectionAddress}/${tokenId}`}
      onPress={() => {
        setModalOpen(false)
      }}
      underText={'Your EFT has been generated, but the purchase\n' +
        '        transaction is not yet complete. On your FileBunny page,\n' +
        '        you need to wait until the hidden file with gifts is\n' +
        '        transferred and becomes available for download. After\n' +
        '        this, you need to confirm the completion of the deal by clicking the "Send payment" or "Finalize the deal" button.'}
    />)
  })

  const { isLoading: isLoadingFulFill } = statuses
  const isLoading = useComputedMemo(() => {
    console.log(whiteListStore.isLoading)

    return (isLoadingFulFill || whiteListStore.isLoading || isLoadingReq) && (!statuses.error)
  }, [whiteListStore.isLoading, isLoadingReq, isLoadingFulFill, statuses.error])

  return {
    isLoading,
    modalProps,
    payedMint,
    freeMint,
    whiteList: whiteListStore.data?.whitelist,
  }
}
