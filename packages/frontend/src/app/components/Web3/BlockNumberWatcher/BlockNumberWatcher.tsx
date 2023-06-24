import { useBlockNumberListener } from '../../../hooks/useBlockNumberListener'

export const BlockNumberWatcher = () => {
  useBlockNumberListener()

  return null
}
