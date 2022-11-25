import { Token } from '../../swagger/Api'
import { TokenFullId } from '../processing/types'

export interface HiddenFileDownload {
  label: string
  download: () => void
}

export function useHiddenFileDownload(tokenFullId: Partial<TokenFullId>, token?: Token): HiddenFileDownload[] {
  return []
}
