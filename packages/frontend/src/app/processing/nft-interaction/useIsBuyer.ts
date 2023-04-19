import { Transfer } from '../../../swagger/Api'
import { useAccount } from 'wagmi'
import { utils } from 'ethers'

export function useIsBuyer(transfer: Transfer | undefined): boolean {
  const { address } = useAccount()
  return Boolean(address && transfer?.to && utils.getAddress(address) === utils.getAddress(transfer.to))
}
