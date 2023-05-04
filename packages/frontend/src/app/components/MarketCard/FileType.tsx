import React, { FC, useMemo } from 'react'

import { styled } from '../../../styles'
import { HiddenFileMetaData } from '../../../swagger/Api'
import { Txt } from '../../UIkit'
import { typeFiles, typeImg } from './helper/data'
import { fileNameToExtension, filenameToType } from './helper/filenameToType'

const FileTypeStyle = styled('div', {
  background: 'rgba(255, 255, 255, 0.5)',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)',
  borderRadius: '6px',
  padding: '4px',
  display: 'flex',
  gap: '4px',
  top: '4px',
  left: '13px',
  position: 'absolute',
  zIndex: '9999',
  '& img': {
    width: '16px',
    height: '16px'
  }
})

interface FileTypeProps {
  file?: HiddenFileMetaData
}

const FileType: FC<FileTypeProps> = ({ file }) => {
  const type: typeFiles | undefined = useMemo(() => {
    if (!file) return undefined
    return filenameToType(file)
  }, [file])

  const img: string | undefined = useMemo(() => {
    if (type) return typeImg[type]
  }, [type])

  const extension: string | undefined = useMemo(() => {
    if (!file) return undefined
    return fileNameToExtension(file)
  }, [file])

  return (
    <>
      {type && <FileTypeStyle>
        <img src={img} />
        <Txt primary1 style={{ fontSize: '12px' }}>{`.${extension}`}</Txt>
      </FileTypeStyle>}
    </>
  )
}

export default FileType
