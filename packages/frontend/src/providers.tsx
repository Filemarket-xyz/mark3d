import { FC, PropsWithChildren } from 'react'
import { StitchesProvider } from './styles'
import { wagmiClient, Web3ModalConfigured } from './app/config/web3Modal'
import { NextUIProvider } from '@nextui-org/react'
import { WagmiConfig } from 'wagmi'
import { StoreProvider } from './app/hooks'
import { DialogManager } from './app/components/DialogManager/DialogManager'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <NextUIProvider disableBaseline>
          <StitchesProvider>
            <StoreProvider>
              {children}
              <DialogManager/>
            </StoreProvider>
          </StitchesProvider>
        </NextUIProvider>
      </WagmiConfig>
      <Web3ModalConfigured/>
    </>
  )
}
