import { observer } from 'mobx-react-lite'
import React, { FC, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import { useStores } from './app/hooks'
import { router } from './app/pages/router'
import { makeWsUrl } from './app/utils/ws/makeWsUrl'
import { Providers } from './providers'

export const App: FC = observer(() => {
  const { socketStore } = useStores()

  useEffect(() => {
    if (socketStore.socket) {
      socketStore.subscribeToBlock()
    }
  }, [socketStore.socket])

  useEffect(() => {
    if (!socketStore.socket) {
      socketStore.createConnection(makeWsUrl('/ws/subscribe/block_number'))
    }
  }, [])

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
})
