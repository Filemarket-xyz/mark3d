import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import { FileButton } from '../../../../components/NFT/FileButton'
import { ProtectedStamp } from '../../../../components/NFT/FileButton/ProtectedStamp'
import { HiddenFileDownload } from '../../../../hooks/useHiddenFilesDownload'
import { formatFileSize } from '../../../../utils/nfts/formatFileSize'
import { GridBlock, PropertyTitle } from '../../helper/styles/style'

const FileInfoSectionStyle = styled('div', {
  width: '400px',
  height: '201px',
  border: '3px solid #F4F4F4',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '12px',
  '@md': {
    width: '100%'
  }
})

const FileList = styled('div', {
  '& li:not(:last-child)': {
    marginBottom: '$2'
  }
})

const FileInfoSectionTitle = styled(PropertyTitle, {
  color: '#232528',
  fontWeight: '600',
  fontSize: '20px',
  marginBottom: '12px'
})

interface FileInfoSectionProps {
  isOwner?: boolean
  canViewHiddenFiles: boolean
  files: HiddenFileDownload[]
}

const FileInfoSection: FC<FileInfoSectionProps> = ({ isOwner, files, canViewHiddenFiles }) => {
  return (
    <GridBlock>
      <FileInfoSectionStyle>
        <FileInfoSectionTitle>Hidden file</FileInfoSectionTitle>
        <FileList>
          {(isOwner || canViewHiddenFiles) ? (
            files.map(({ cid, name, size, download }) => (
              <ProtectedStamp key={cid}>
                  <FileButton
                      name={name}
                      caption={`download (${formatFileSize(size)})`}
                      onPress={download}
                  />
              </ProtectedStamp>
            ))
          ) : (
            <ProtectedStamp>
              <FileButton
                  name="Available only"
                  caption="to the owner"
                  isDisabled={true}
              />
            </ProtectedStamp>
          )}
        </FileList>
      </FileInfoSectionStyle>
    </GridBlock>
  )
}

export default FileInfoSection
