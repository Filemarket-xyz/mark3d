import { FC, PropsWithChildren } from 'react'
import { StitchesProvider } from './styles'
import { wagmiClient, Web3ModalConfigured } from './app/config/web3Modal'
import { NextUIProvider } from '@nextui-org/react'
import { WagmiConfig } from 'wagmi'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <NextUIProvider disableBaseline>
          <StitchesProvider>
            {children}
          </StitchesProvider>
        </NextUIProvider>
      </WagmiConfig>
      <Web3ModalConfigured/>
    </>
  )
}
