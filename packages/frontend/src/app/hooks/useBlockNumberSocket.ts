import { useEffect } from 'react'

import { makeWsUrl } from '../utils/ws/makeWsUrl'
import { useStores } from './useStores'

export const useBlockNumberSocket = () => {
  const { socketStore } = useStores()
  useEffect(() => {
    if (socketStore.socket) {
      socketStore.subscribeToBlock()
    }
  }, [socketStore.socket])

  useEffect(() => {
    if (!socketStore.socket) {
      socketStore.createConnection(makeWsUrl('/ws/subscribe/block_number'))
    }
  }, [])
}
