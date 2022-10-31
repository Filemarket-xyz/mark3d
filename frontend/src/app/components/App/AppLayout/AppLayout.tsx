import { styled } from '../../../../styles'
import { FC } from 'react'
import { AppNav } from '../AppNav'
import { Outlet } from 'react-router-dom'

export const Background = styled('section', {
  backgroundColor: '$gray100',
  minHeight: '100%'
})

export const AppLayout: FC = () => {
  return (
    <>
      <AppNav />
      <Outlet />
    </>
  )
}
