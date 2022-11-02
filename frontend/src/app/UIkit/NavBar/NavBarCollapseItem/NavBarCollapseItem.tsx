import { NavLink } from '../../Link'
import { ComponentProps, FC } from 'react'

type NavBarCollapseItemProps = ComponentProps<typeof NavLink>

export const NavBarCollapseItem: FC<NavBarCollapseItemProps> = (props) => {
  return <NavLink {...props}/>
}
