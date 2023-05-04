import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { useScrollTop } from '../../../hooks/useScrollTop'
import { AppNav } from '../AppNav'
import Footer from '../Footer/Footer'

export const AppLayout: FC = () => {
  useScrollTop()
  return (
    <>
      <AppNav />
      <Outlet />
      <Footer />
    </>
  )
}
