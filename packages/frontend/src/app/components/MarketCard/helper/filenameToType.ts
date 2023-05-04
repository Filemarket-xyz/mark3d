import { HiddenFileMetaData } from '../../../../swagger/Api'
import { typeFiles, typeOptions } from './data'

export const fileNameToExtension = (file: HiddenFileMetaData): string | undefined => {
  if (file.type) {
    return file.type.split('/')[file.type.split('/').length - 1]
  } else {
    return file.name?.split('.')[file.name?.split('.').length - 1]
  }
}

export const filenameToType = (file: HiddenFileMetaData): typeFiles | undefined => {
  const typeFileName: string | undefined = fileNameToExtension(file)
  if (!typeFileName) return undefined
  for (const [key, value] of Object.entries(typeOptions)) {
    if (value.includes(`.${typeFileName}`)) return key as typeFiles
  }
  return 'another'
}
