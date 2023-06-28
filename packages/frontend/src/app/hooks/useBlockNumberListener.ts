import { BigNumber } from 'ethers'
import { useBlockNumber } from 'wagmi'

import { useStores } from './useStores'

export const useBlockNumberListener = () => {
  const { blockStore } = useStores()
  useBlockNumber({
    watch: true,
    onBlock(data) {
      if (data) blockStore.setCurrentBlock(BigNumber.from(data))
    },
  })
}
