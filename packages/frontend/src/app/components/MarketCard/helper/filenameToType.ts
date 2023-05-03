import { type, typeOptions } from './data'

export const filenameToType: type = (filename: string) => {
  const typeFileName = filename.split('.')
  for (const [key, value] of Object.entries(typeOptions)) {
    if (value.includes)
  }
}
