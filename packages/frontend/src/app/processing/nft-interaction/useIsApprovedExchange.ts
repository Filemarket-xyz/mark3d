import { utils } from 'ethers'

import { mark3dConfig } from '../../config/mark3d'
import { TokenFullId } from '../types'
import { useGetApproved } from './useGetApproved'

export function useIsApprovedExchange(tokenFullId: Partial<TokenFullId> = {}) {
  const { data, ...statuses } = useGetApproved(tokenFullId)

  return {
    ...statuses,
    isApprovedExchange: data && utils.getAddress(data) === utils.getAddress(mark3dConfig.exchangeToken.address),
  }
}
