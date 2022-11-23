export const convertFileListToFile = (file: FileList, fileName = 'file'): File | undefined => {
  if (!file || !file.length) return
  const fileExtension = file[0].type.split('/').pop()

  return new File([file[0]], `${fileName}.${fileExtension}`, { type: file[0].type })
}
