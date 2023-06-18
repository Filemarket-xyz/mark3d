import { autorun } from 'mobx'
import { DependencyList, EffectCallback, useCallback } from 'react'

export const useAutoRunCallback = (effect: EffectCallback, deps?: DependencyList) => {
  return useCallback((props: any) => autorun(effect), [deps])
}
