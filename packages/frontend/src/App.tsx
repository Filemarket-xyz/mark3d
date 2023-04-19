import React, { FC } from 'react'
import { Providers } from './providers'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/pages/router'
import { observer } from 'mobx-react-lite'

export const App: FC = observer(() => {
  return (
    <Providers>
      <RouterProvider router={router}/>
    </Providers>
  )
})
