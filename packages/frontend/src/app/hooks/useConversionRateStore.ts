import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

export const useConversionRateStore = () => {
  const { conversionRateStore } = useStores()
  useActivateDeactivateRequireParams(conversionRateStore)

  return conversionRateStore
}
