import { useContract, useSigner } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'

// This hook MUST be called only when user is connected to metamask
export function useAccessTokenContract() {
  const { data: signer } = useSigner()
  const contract = useContract({
    address: mark3dConfig.accessToken.address,
    abi: mark3dConfig.accessToken.abi,
    signerOrProvider: signer
  })
  return { contract, signer }
}
