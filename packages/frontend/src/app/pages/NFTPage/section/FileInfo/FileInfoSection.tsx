import { PressEvent } from '@react-types/shared/src/events'
import React, { FC, useEffect } from 'react'

import { styled } from '../../../../../styles'
import { HiddenFileMetaData } from '../../../../../swagger/Api'
import { BaseModal, FileButton, ProtectedStamp } from '../../../../components'
import { filenameToExtension } from '../../../../components/MarketCard/helper/fileToType'
import { useStatusState } from '../../../../hooks'
import { HiddenFileDownload } from '../../../../hooks/useHiddenFilesDownload'
import { useStatusModal } from '../../../../hooks/useStatusModal'
import { Txt } from '../../../../UIkit'
import { formatFileSize } from '../../../../utils/nfts'
import { GridBlock, PropertyTitle } from '../../helper/styles/style'

const FileInfoSectionStyle = styled('div', {
  width: '400px',
  height: '208px',
  border: '3px solid #F4F4F4',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '12px',
  '@md': {
    width: '100%',
  },
})

const FileList = styled('div', {
  '& li:not(:last-child)': {
    marginBottom: '$2',
  },
})

const FileInfoSectionTitle = styled(PropertyTitle, {
  color: '#232528',
  fontWeight: '600',
  fontSize: '20px',
  marginBottom: '12px',
})

const Line = styled('div', {
  height: '15px',
  width: '2px',
  background: '$gray400',
})

interface FileInfoSectionProps {
  isOwner?: boolean
  canViewHiddenFiles: boolean
  files: HiddenFileDownload[]
  filesMeta: HiddenFileMetaData[]
}

const FileInfoSection: FC<FileInfoSectionProps> = ({ isOwner, files, canViewHiddenFiles, filesMeta }) => {
  const { statuses, wrapPromise } = useStatusState<boolean | void, PressEvent>()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'File decrypted and download started',
    loadingMsg: 'Decrypt file in progress',
    waitForSign: false,
  })

  useEffect(() => {
    console.log(files)
  }, [files])

  const fileName = (name: string | undefined): string | undefined => {
    const maxCountAvailable = 30
    if ((name?.length ?? 0) < 30) return name
    const extension = filenameToExtension(name ?? '')
    const secondPartName = name?.substring(name.indexOf(`.${extension}`) - 3, name.length)
    const firstPartName = name?.substring(0, maxCountAvailable - (secondPartName?.length ?? 0) - 3)

    return `${firstPartName}...${secondPartName}`
  }

  return (
    <>
      <BaseModal {...modalProps} />
      <GridBlock>
        <FileInfoSectionStyle>
          <FileInfoSectionTitle>Hidden file</FileInfoSectionTitle>
          <FileList>
            {(isOwner || canViewHiddenFiles) ? (
              files.map(({ cid, name, size, download }) => (
                <ProtectedStamp key={cid}>
                  <FileButton
                    caption={formatFileSize(size)}
                    name={fileName(name)}
                    onPress={wrapPromise(download)}
                  />
                </ProtectedStamp>
              ))
            ) : (
              filesMeta.map(({ name, size }, index) => (
                <ProtectedStamp key={index}>
                  <FileButton
                    isDisabled
                    name={fileName(name)}
                    caption={(
                      <>
                        <Txt>{formatFileSize(size ?? 0)}</Txt>
                        <Line />
                        <Txt>Available only to the owner</Txt>
                      </>
                    )}
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
