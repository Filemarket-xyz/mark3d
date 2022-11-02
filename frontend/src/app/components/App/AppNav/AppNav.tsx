import { FC } from 'react'
import { NavBar, NavBarItem } from '../../../UIkit'
import { paths } from './paths'

export const AppNav: FC = () => (
  <NavBar
    items={
    <>
      {paths.map(({ to, label }) => (
        <NavBarItem to={to} key={to}>
          {label}
        </NavBarItem>
      ))}
    </>
  }
  />
)
