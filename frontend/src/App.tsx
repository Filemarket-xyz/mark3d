import React, { FC } from 'react'
import { Providers } from './providers'
import { ConnectButton } from './app/components'

export const App: FC = () => {
  return (
    <Providers>
      <div className="App">
        <ConnectButton/>
      </div>
    </Providers>
  )
}
