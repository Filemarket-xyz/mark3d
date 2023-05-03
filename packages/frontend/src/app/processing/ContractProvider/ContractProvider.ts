import { getContract, getProvider, Provider } from '@wagmi/core'

import { mark3dConfig } from '../../config/mark3d'

export class ContractProvider {
  #provider: Provider

  constructor(private readonly config: typeof mark3dConfig) {
    this.#provider = getProvider({ chainId: this.config.chain.id })
  }

  getCollectionContract(address: string) {
    return getContract({
      address,
      abi: this.config.collectionToken.abi,
      signerOrProvider: this.#provider
    })
  }

  getAccessTokenContract() {
    return getContract({
      address: this.config.accessToken.address,
      abi: this.config.collectionToken.abi,
      signerOrProvider: this.#provider
    })
  }

  getExchangeContract() {
    return getContract({
      address: this.config.exchangeToken.address,
      abi: this.config.collectionToken.abi,
      signerOrProvider: this.#provider
    })
  }
}

export const contractProvider = new ContractProvider(mark3dConfig)
