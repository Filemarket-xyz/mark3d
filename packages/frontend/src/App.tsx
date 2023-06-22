import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { RouterProvider } from 'react-router-dom'

import { useBlockNumberSocket } from './app/hooks/useBlockNumberSocket'
import { router } from './app/pages/router'
import { Providers } from './providers'

export const App: FC = observer(() => {
  useBlockNumberSocket()

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
})
