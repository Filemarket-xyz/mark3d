
import { formatEther, parseEther } from 'ethers/lib.esm/utils'
import { useEffect, useMemo, useState } from 'react'

import { fee } from '../config/mark3d'
import { hexToBuffer } from '../processing'
import { useBlockchainDataProvider } from '../processing/BlockchainDataProvider'
import { TokenFullId } from '../processing/types'
import { useConversionRateStore } from './useConversionRateStore'
import { useDebouncedValue } from './useDebouncedValue'

export const useSaleAmountWillReceived = ({ collectionAddress, tokenId }: TokenFullId, price: number) => {
  const [amountWillReceived, setAmountWillReceived] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const conversionRateStore = useConversionRateStore()
  const blockchainDataProvider = useBlockchainDataProvider()
  const debouncedPrice = useDebouncedValue(price, 400)

  const amountWillReceivedUsd = useMemo(() => {
    if (!amountWillReceived || !conversionRateStore.data?.rate) return 0

    return +amountWillReceived * conversionRateStore.data.rate
  }, [amountWillReceived, conversionRateStore.data])

  const getSaleAmountWithoutFee = async () => {
    if (!fee) return price

    return price - (price * fee / 100)
  }

  const getRoyaltyAmount = async (salePriceWithFee: number) => {
    const royaltyAmountBN = await blockchainDataProvider.getRoyaltyAmount(
      hexToBuffer(collectionAddress),
      +tokenId,
      parseEther(salePriceWithFee.toString()),
    )

    return +formatEther(royaltyAmountBN)
  }

  const calcSaleAmountWillReceived = async () => {
    setIsLoading(true)

    const saleAmountWithFee = await getSaleAmountWithoutFee()
    const royaltyAmount = await getRoyaltyAmount(saleAmountWithFee)

    setAmountWillReceived(saleAmountWithFee - royaltyAmount)
    setIsLoading(false)
  }

  useEffect(() => {
    calcSaleAmountWillReceived()
  }, [debouncedPrice])

  return useMemo(() => ({
    amountWillReceived,
    isLoading,
    amountWillReceivedUsd,
  }),
  [amountWillReceived, isLoading, amountWillReceivedUsd])
}
