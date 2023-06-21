
import { errorResponseToMessage } from './stringifyError'

export const wrapRequest = async <T>(func: () => Promise<T>) => {
  return func().catch((e) => {
    throw new Error(errorResponseToMessage(e))
  })
}
