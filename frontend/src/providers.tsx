import { FC, PropsWithChildren } from 'react'
import { StitchesProvider } from './styles'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <StitchesProvider>
      {children}
    </StitchesProvider>
  )
}
