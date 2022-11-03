import { FC, PropsWithChildren } from 'react'
import { StitchesProvider } from './styles'
import { Web3Modal } from '@web3modal/react'
import { web3ModalConfig } from './app/config/web3Modal'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <StitchesProvider>
        {children}
      </StitchesProvider>
      <Web3Modal config={web3ModalConfig}/>
    </>
  )
}
