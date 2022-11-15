import { chain, configureChains, createClient } from 'wagmi'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { FC } from 'react'
import { Web3Modal } from '@web3modal/react'

const chains = [chain.mainnet, chain.polygon]

export const projectId = import.meta.env.VITE_WEB3_MODAL_PROJECT_ID

if (!projectId) {
  throw new Error('You need to provide VITE_WEB3_MODAL_PROJECT_ID env variable')
}

const { provider, webSocketProvider } = configureChains(chains, [
  walletConnectProvider({ projectId })
])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'Mark3d', chains }) as any[],
  provider,
  webSocketProvider
})

const ethereumClient = new EthereumClient(wagmiClient, chains)

export const Web3ModalConfigured: FC = () => (
  <Web3Modal
    projectId={projectId}
    theme="light"
    accentColor="magenta"
    ethereumClient={ethereumClient}
  />
)
