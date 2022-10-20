import React, { FC } from 'react'
import { Providers } from './providers'
import { Container } from './app/UIkit'

export const App: FC = () => {
  return (
    <Providers>
      <div className="App">
        <Container>
          <div
            style={{
              width: '100%',
              height: '400px',
              backgroundColor: 'lightblue'
            }}
          >
          </div>
        </Container>
      </div>
    </Providers>
  )
}
