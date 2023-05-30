import { useContract, useSigner } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'

export function useCollectionContract(address?: string) {
  const { data: signer } = useSigner()
  const contract = useContract({
    address,
    abi: mark3dConfig.collectionToken.abi,
    signerOrProvider: signer,
  })

  return { contract, signer }
}
