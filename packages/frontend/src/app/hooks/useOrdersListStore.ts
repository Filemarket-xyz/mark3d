import { useStores } from './useStores'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains open orders and status fields like isLoading, isLoaded
 * @param accountAddress
 */
export function useOpenOrderListStore() {
  const { orderListStore } = useStores()
  useActivateDeactivateRequireParams(orderListStore)
  return orderListStore
}
