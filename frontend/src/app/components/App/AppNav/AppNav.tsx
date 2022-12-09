import { FC } from 'react'
import { NavBar } from '../../../UIkit'
import { paths } from './paths'
import { AppLogoButton } from '../AppLogoButton'
import { BreakpointsOptions } from '../../../../styles'
import { ConnectWidget } from '../../Web3'
import { AppPlusNav } from '../AppPlusNav'
import { LinksBanner } from '../AppLinksBanner/LinksBanner'

const mobileBp: BreakpointsOptions = 'md'

export const AppNav: FC = () => (
  <>
    <NavBar
      mobileBp={mobileBp}
      brand={<AppLogoButton to='/' hideNameIn={mobileBp} />}
      items={paths}
      actions={<ConnectWidget connectedContent={<AppPlusNav />} />}
    />
    <LinksBanner />
  </>
)
