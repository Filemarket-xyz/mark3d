import { FC } from 'react'
import useWatchFileWalletConnect from '../../../processing/nft-interaction/useWatchFileWalletConnect'

export const FileWalletConnectWatcher: FC = () => {
  useWatchFileWalletConnect()
  return null
}
