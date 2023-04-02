import { FC } from 'react'
import { AppNav } from '../AppNav'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { useScrollTop } from '../../../hooks/useScrollTop'

export const AppLayout: FC = () => {
  useScrollTop()
  return (
    <>
      <AppNav/>
      <Outlet/>
      <Footer />
    </>
  )
}
