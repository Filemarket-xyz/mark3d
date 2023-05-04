import { utils } from 'ethers'
import { useAccount } from 'wagmi'

import { Transfer } from '../../../swagger/Api'

export function useIsBuyer(transfer: Transfer | undefined): boolean {
  const { address } = useAccount()
  return Boolean(address && transfer?.to && utils.getAddress(address) === utils.getAddress(transfer.to))
}
