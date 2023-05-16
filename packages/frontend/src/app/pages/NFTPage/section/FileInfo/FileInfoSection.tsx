import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import { FileButton, MintModal, ProtectedStamp } from '../../../../components'
import { useStatusState } from '../../../../hooks'
import { HiddenFileDownload } from '../../../../hooks/useHiddenFilesDownload'
import { useStatusModal } from '../../../../hooks/useStatusModal'
import { formatFileSize } from '../../../../utils/nfts'
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
  const { statuses, wrapPromise } = useStatusState()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'File decrypted and download started',
    loadingMsg: 'Decrypt file in progress',
    waitForSign: false
  })

  return (
    <>
      <MintModal {...modalProps} />
      <GridBlock>
        <FileInfoSectionStyle>
          <FileInfoSectionTitle>Hidden file</FileInfoSectionTitle>
          <FileList>
            {(isOwner || canViewHiddenFiles) ? (
              files.map(({ cid, name, size, download }) => (
                <ProtectedStamp key={cid}>
                  <FileButton
                    caption={`download (${formatFileSize(size)})`}
                    name={name}
                    onPress={wrapPromise(download)}
                  />
                </ProtectedStamp>
              ))
            ) : (
              files.map(({ cid, name }) => (
                <ProtectedStamp key={cid}>
                  <FileButton
                    caption="to the owner"
                    isDisabled={true}
                    name={name}
                  />
                </ProtectedStamp>
              ))
            )}
          </FileList>
        </FileInfoSectionStyle>
      </GridBlock>
    </>
  )
}

export default FileInfoSection
