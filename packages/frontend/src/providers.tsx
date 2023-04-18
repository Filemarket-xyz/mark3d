import { FC, PropsWithChildren } from 'react'
import { StitchesProvider } from './styles'
import { wagmiClient, Web3ModalConfigured } from './app/config/web3Modal'
import { NextUIProvider } from '@nextui-org/react'
import { WagmiConfig } from 'wagmi'
import { StoreProvider } from './app/hooks'
import { DialogManager } from './app/components/DialogManager/DialogManager'
import { FileWalletConnectWatcher } from './app/components/Web3/FileWalletConnectWatcher'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
          <StitchesProvider>
              <NextUIProvider disableBaseline>
                      <StoreProvider>
                          {children}
                          <DialogManager/>
                      </StoreProvider>
              </NextUIProvider>
          </StitchesProvider>
        <FileWalletConnectWatcher/>
      </WagmiConfig>
      <Web3ModalConfigured/>
    </>
  )
}
