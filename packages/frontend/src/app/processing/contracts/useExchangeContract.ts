import { useContract, useSigner } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'

export function useExchangeContract() {
  const { data: signer } = useSigner()
  const contract = useContract({
    address: mark3dConfig.exchangeToken.address,
    abi: mark3dConfig.exchangeToken.abi,
    signerOrProvider: signer
  })
  return { contract, signer }
}
