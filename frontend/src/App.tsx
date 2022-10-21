import React, { FC } from 'react'
import { Providers } from './providers'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/pages/router'

export const App: FC = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
