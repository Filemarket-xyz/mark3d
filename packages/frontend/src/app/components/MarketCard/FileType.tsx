import React, { FC } from 'react'
import { styled } from '../../../styles'

const FileTypeStyle = styled('div', {
  background: 'rgba(255, 255, 255, 0.5)',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)',
  borderRadius: '6px'
})

interface FileTypeProps {
  type: string
}

const FileType: FC<FileTypeProps> = ({ type }) => {

  const img =

  return (
    <FileTypeStyle>

    </FileTypeStyle>
  )
}

export default FileType