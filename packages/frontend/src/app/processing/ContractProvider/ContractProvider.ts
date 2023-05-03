import { getContract, Provider } from '@wagmi/core'

import { mark3dConfig } from '../../config/mark3d'
import { wagmiClient } from '../../config/web3Modal'

export class ContractProvider {
  constructor(
    private readonly provider: Provider,
    private readonly config: typeof mark3dConfig
  ) {}

  getCollectionContract(address: string) {
    return getContract({
      address,
      abi: this.config.collectionToken.abi,
      signerOrProvider: this.provider
    })
  }

  getAccessTokenContract() {
    return getContract({
      address: this.config.accessToken.address,
      abi: this.config.accessToken.abi,
      signerOrProvider: this.provider
    })
  }

  getExchangeContract() {
    return getContract({
      address: this.config.exchangeToken.address,
      abi: this.config.exchangeToken.abi,
      signerOrProvider: this.provider
    })
  }
}

export const contractProvider = new ContractProvider(wagmiClient.provider, mark3dConfig)
