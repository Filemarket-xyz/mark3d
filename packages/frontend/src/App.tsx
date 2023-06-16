import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/pages/router'
import { Providers } from './providers'

const App: FC = observer(() => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
})

export default App
