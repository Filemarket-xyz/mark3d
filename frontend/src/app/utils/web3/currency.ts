import { utils } from 'ethers'
import { mark3dConfig } from '../../config/mark3d'

export const formatCurrency = (value: string) => {
  const decimals = mark3dConfig.chain.nativeCurrency?.decimals ?? 18
  const symbol = mark3dConfig.chain.nativeCurrency?.symbol ?? 'BNB'
  return `${utils.formatUnits(value, decimals)} ${symbol}`
}
