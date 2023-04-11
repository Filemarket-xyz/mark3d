import React, { FC, useEffect } from 'react'
import { Providers } from './providers'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/pages/router'
import { observer } from 'mobx-react-lite'
import { useStores } from './app/hooks'

export const App: FC = observer(() => {
  const { authStore } = useStores()

  useEffect(() => {
    if (localStorage.getItem('mnemonic')) authStore.setIsAuth(true)
  }, [])

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
})
