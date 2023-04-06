import { BigNumber, BigNumberish, utils } from 'ethers'
import { mark3dConfig } from '../../config/mark3d'

export const formatCurrency = (value: BigNumberish) => {
  const decimals = mark3dConfig.chain.nativeCurrency?.decimals ?? 18
  const symbol = mark3dConfig.chain.nativeCurrency?.symbol ?? 'BNB'
  return `${utils.formatUnits(value, decimals)} ${symbol}`
}

export const toCurrency = (value: BigNumber): number => {
  const decimals = mark3dConfig.chain.nativeCurrency?.decimals ?? 18
  return Number(utils.formatUnits(value, decimals))
}

export const fromCurrency = (value: number): BigNumber => {
  const decimals = mark3dConfig.chain.nativeCurrency?.decimals ?? 18
  const meaningfulDecimals = 9
  return BigNumber
    .from(Math.round(value * Math.pow(10, meaningfulDecimals)))
    .mul(BigNumber.from(Math.pow(10, decimals - meaningfulDecimals)))
}
