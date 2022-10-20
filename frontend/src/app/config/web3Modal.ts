import { ConfigOptions } from '@web3modal/react'
import { chains, providers } from '@web3modal/ethereum'

const projectId = import.meta.env.VITE_WEB3_MODAL_PROJECT_ID

export const web3ModalConfig: ConfigOptions = {
  projectId,
  theme: 'light',
  accentColor: 'magenta',
  ethereum: {
    appName: 'Mark3d',
    autoConnect: true,
    chains: [
      chains.polygonMumbai,
      chains.polygon
    ],
    providers: [providers.walletConnectProvider({ projectId })]
  }
}
