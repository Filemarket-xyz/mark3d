import { useGetApproved } from './useGetApproved'
import { TokenFullId } from '../types'
import { mark3dConfig } from '../../config/mark3d'
import { utils } from 'ethers'

export function useIsApprovedExchange(tokenFullId: Partial<TokenFullId> = {}) {
  const { data, ...statuses } = useGetApproved(tokenFullId)
  return {
    ...statuses,
    isApprovedExchange: data && utils.getAddress(data) === utils.getAddress(mark3dConfig.exchangeToken.address)
  }
}
