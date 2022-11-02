import { FC } from 'react'
import { NavBar } from '../../../UIkit'
import { paths } from './paths'
import { AppLogoButton } from '../AppLogoButton'
import { BreakpointsOptions } from '../../../../styles'

const mobileBp: BreakpointsOptions = 'md'

export const AppNav: FC = () => (
  <NavBar
    mobileBp={mobileBp}
    brand={<AppLogoButton to="/"/>}
    items={paths}
  />
)
