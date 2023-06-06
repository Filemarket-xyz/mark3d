import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

export const usePublicCollectionStore = () => {
  const { publicCollectionStore } = useStores()
  useActivateDeactivateRequireParams(publicCollectionStore)

  return publicCollectionStore
}
