import React, { useMemo } from 'react'

import { HiddenFileMetaData } from '../../../../swagger/Api'
import { Txt } from '../../../UIkit'
import { typeImg } from '../helper/data'
import { fileToExtension, fileToType } from '../helper/fileToType'
import { StyledFileType } from './FileType.styles'

interface FileTypeProps {
  hiddenFileMeta?: HiddenFileMetaData
  className?: string
}

export const FileType: React.FC<FileTypeProps> = ({ hiddenFileMeta, className }) => {
  const { type, extension } = useMemo(() => {
    if (!hiddenFileMeta) return {}

    return {
      type: fileToType(hiddenFileMeta),
      extension: fileToExtension(hiddenFileMeta),
    }
  }, [hiddenFileMeta])

  const img = useMemo(() => {
    if (type) return typeImg[type]
  }, [type])

  if (!hiddenFileMeta) return null

  return (
    <StyledFileType className={className}>
      <img src={img} />
      <Txt primary1 style={{ fontSize: '12px' }}>
        .
        {extension}
      </Txt>
    </StyledFileType>
  )
}
