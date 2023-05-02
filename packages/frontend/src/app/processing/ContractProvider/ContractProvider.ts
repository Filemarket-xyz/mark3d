import { getContract } from '@wagmi/core'

import { mark3dConfig } from '../../config/mark3d'

export class ContractProvider {
  constructor(private readonly config: typeof mark3dConfig) {}

  getCollectionContract(address: string) {
    return getContract({ address, abi: this.config.collectionToken.abi })
  }

  getAccessTokenContract() {
    return getContract({ address: this.config.accessToken.address, abi: this.config.collectionToken.abi })
  }

  getExchangeContract() {
    return getContract({ address: this.config.exchangeToken.address, abi: this.config.collectionToken.abi })
  }
}

export const contractProvider = new ContractProvider(mark3dConfig)
