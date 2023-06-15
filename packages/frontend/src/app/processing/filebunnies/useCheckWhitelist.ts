import { useCallback, useEffect } from 'react'

import { useWhiteListStore } from '../../hooks/useWhiteListStore'
import { IRarityWl } from '../../stores/FileBunnies/FileBunniesTokenStore'

interface ICheckWhiteList {
  address?: `0x${string}`
}

interface ICheckWhiteListReturn {
  whiteList?: IRarityWl
  checkWhiteList: () => void
}

export const useCheckWhitelist = ({ address }: ICheckWhiteList): ICheckWhiteListReturn => {
  const whiteListStore = useWhiteListStore(address)

  const checkWhiteList = useCallback(() => {
    address && whiteListStore.reload()
  }, [address])

  useEffect(() => {
    address && whiteListStore.reload()
  }, [address])

  return {
    whiteList: whiteListStore.data?.whitelist as IRarityWl,
    checkWhiteList,
  }
}
