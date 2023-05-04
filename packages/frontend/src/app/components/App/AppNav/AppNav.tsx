import { FC } from 'react'

import { BreakpointsOptions } from '../../../../styles'
import { NavBar } from '../../../UIkit'
import { AppConnectWidget } from '../AppConnectWidget'
import { AppLogoButton } from '../AppLogoButton'
import { paths } from './paths'

const mobileBp: BreakpointsOptions = 'lg'

export const AppNav: FC = () => (
  <>
    <NavBar
      mobileBp={mobileBp}
      brand={<AppLogoButton to='/' hideNameIn={mobileBp} />}
      items={paths}
      actions={<AppConnectWidget />}
    />
  </>
)
