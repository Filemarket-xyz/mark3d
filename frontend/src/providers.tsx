import { FC, PropsWithChildren } from 'react'
import { StitchesProvider } from './styles'
import { Web3Modal } from '@web3modal/react'
import { web3ModalConfig } from './app/config/web3Modal'
import { NextUIProvider } from '@nextui-org/react'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <NextUIProvider disableBaseline>
        <StitchesProvider>
          {children}
        </StitchesProvider>
      </NextUIProvider>
      <Web3Modal config={web3ModalConfig}/>
    </>
  )
}
