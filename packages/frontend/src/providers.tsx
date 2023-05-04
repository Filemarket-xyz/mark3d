import { NextUIProvider } from '@nextui-org/react'
import { FC, PropsWithChildren } from 'react'
import { WagmiConfig } from 'wagmi'

import { DialogManager } from './app/components/DialogManager/DialogManager'
import { FileWalletConnectWatcher } from './app/components/Web3/FileWalletConnectWatcher'
import { wagmiClient, Web3ModalConfigured } from './app/config/web3Modal'
import { StoreProvider } from './app/hooks'
import { StitchesProvider } from './styles'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
          <StitchesProvider>
              <NextUIProvider disableBaseline>
                      <StoreProvider>
                          {children}
                          <DialogManager />
                      </StoreProvider>
              </NextUIProvider>
          </StitchesProvider>
        <FileWalletConnectWatcher />
      </WagmiConfig>
      <Web3ModalConfigured />
    </>
  )
}
