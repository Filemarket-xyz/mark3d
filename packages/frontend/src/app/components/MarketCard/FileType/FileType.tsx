import React, { useMemo } from 'react'

import { HiddenFileMetaData } from '../../../../swagger/Api'
import { Txt } from '../../../UIkit'
import { typeImg } from '../helper/data'
import { fileToExtension, fileToType } from '../helper/fileToType'
import { StyledFileType } from './FileType.styles'

interface FileTypeProps {
  file?: HiddenFileMetaData
  className?: string
}

export const FileType: React.FC<FileTypeProps> = ({ file, className }) => {
  const { type, extension } = useMemo(() => {
    if (!file) return {}

    return {
      type: fileToType(file),
      extension: fileToExtension(file),
    }
  }, [file])

  const img = useMemo(() => {
    if (type) return typeImg[type]
  }, [type])

  if (!file) return null

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
