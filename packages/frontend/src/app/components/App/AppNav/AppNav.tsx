import { FC, useMemo } from 'react'
import { useScrollIndicator } from 'react-use-scroll-indicator'

import { BreakpointsOptions } from '../../../../styles'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { NavBar } from '../../../UIkit'
import { AppConnectWidget } from '../AppConnectWidget'
import { AppLogoButton } from '../AppLogoButton'
import { paths } from './paths'

const mobileBp: BreakpointsOptions = 'lg'

export const AppNav: FC = () => {
  const [state] = useScrollIndicator()
  const { smValue, mdValue, xlValue, lgValue } = useMediaMui()

  const isTransparent = useMemo(() => {
    console.log(state.value)
    if (smValue) return state.value < 39.34
    if (mdValue) return state.value < 41.23
    if (lgValue) return state.value < 43.23
    if (xlValue) return state.value < 59.81

    return state.value < 62
  }, [state])

  const noneBlurShadow = useMemo(() => {
    if (smValue) return state.value < 3
    if (mdValue) return state.value < 4
    if (lgValue) return state.value < 5.6

    return state.value < 6.57
  }, [state])

  return (
    <NavBar
      noneBlurShadow={noneBlurShadow}
      isTransparent={isTransparent}
      mobileBp={mobileBp}
      brand={<AppLogoButton to='/mainpage' hideNameIn={mobileBp} />}
      items={paths}
      actions={<AppConnectWidget />}
    />
  )
}
