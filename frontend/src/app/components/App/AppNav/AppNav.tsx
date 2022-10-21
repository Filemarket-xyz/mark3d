import { FC } from 'react'
import { NavBar } from '../../../UIkit'
import { NavBarItem } from '../../../UIkit/NavBar/NavBarItem'
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
