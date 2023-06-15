import { autorun } from 'mobx'
import { DependencyList, EffectCallback, useEffect } from 'react'

export const useAutorunEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  useEffect(() => autorun(effect), [deps])
}
