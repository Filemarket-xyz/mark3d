import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { FC } from 'react'
import { configureChains, createClient } from 'wagmi'

import { theme } from '../../styles'
import { mark3dConfig } from './mark3d'

const chains = [mark3dConfig.chain]

export const projectId = import.meta.env.VITE_WEB3_MODAL_PROJECT_ID

if (!projectId) {
  throw new Error('You need to provide VITE_WEB3_MODAL_PROJECT_ID env variable')
}

const { provider, webSocketProvider } = configureChains(chains, [
  w3mProvider({ projectId }),
])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
  webSocketProvider,
})

const ethereumClient = new EthereumClient(wagmiClient, chains)

// Montserrat, sans-serif
export const Web3ModalConfigured: FC = () => (
  <Web3Modal
    projectId={projectId}
    themeMode="light"
    ethereumClient={ethereumClient}
    themeVariables={{
      '--w3m-font-family': theme.fonts.primary.value,
      '--w3m-accent-color': theme.colors.blue500.value,
    }}
  />
)
