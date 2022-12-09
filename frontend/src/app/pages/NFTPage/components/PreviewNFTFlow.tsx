import { Loading } from '@nextui-org/react'
import { useState } from 'react'
import { styled } from '../../../../styles'
import { DecryptResult } from '../../../processing/types'
import { Button, textVariant } from '../../../UIkit'

const CenterContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: '$3',
  flexDirection: 'column'
})

const ErrorMessage = styled('p', {
  ...textVariant('primary1'),
  fontWeight: 600,
  color: '$black'
})

const getFileExtension = (file: File) => file.name.split('.')?.pop() ?? ''

enum PreviewState {
  LOADED,
  LOADING,
  LOADING_ERROR,
  EXTENSION_ERROR
}

interface PreviewNFTFlowProps {
  getFile?: () => Promise<DecryptResult<File>>
}

/** Component that implement logic for loading and showing 3D models  */
export const PreviewNFTFlow = ({ getFile }: PreviewNFTFlowProps) => {
  const [previewState, setPreviewState] = useState<{
    state: PreviewState
    data?: string
  }>()

  const handleLoadClick = async () => {
    if (!getFile) return

    setPreviewState({
      state: PreviewState.LOADING
    })

    let model: DecryptResult<File>
    try {
      model = await getFile()
    } catch (error) {
      return setPreviewState({
        state: PreviewState.LOADING_ERROR,
        data: `${error}`
      })
    }

    if (!model.ok) {
      return setPreviewState({
        state: PreviewState.LOADING_ERROR,
        data: `Unable to decrypt. ${model.error}`
      })
    }

    const fr = new FileReader()

    fr.onload = (e) =>
      setPreviewState({
        state: PreviewState.LOADED,
        data: String(e.target?.result ?? '')
      })

    fr.onerror = () =>
      setPreviewState({
        state: PreviewState.LOADING_ERROR,
        data: 'Unable to download, try again later'
      })

    const fileExtension = getFileExtension(model.result)
    if (fileExtension === 'glb' || fileExtension === 'gltf') {
      fr.readAsDataURL(model.result)
    } else {
      setPreviewState({
        state: PreviewState.EXTENSION_ERROR,
        data: `File type .${fileExtension} is not supported`
      })
    }
  }

  return (
    <CenterContainer>
      {previewState?.state === PreviewState.LOADED ? (
        <model-viewer
          src={previewState.data}
          ar
          shadow-intensity='1'
          camera-controls
          touch-action='pan-y'
          style={{ width: '100%', height: '100%' }}
        ></model-viewer>
      ) : previewState?.state === PreviewState.LOADING ? (
        <Loading size='xl' color={'white'} />
      ) : previewState?.state === PreviewState.LOADING_ERROR ? (
        <>
          <ErrorMessage>{previewState?.data}</ErrorMessage>
          <Button primary onPress={handleLoadClick}>
            Load NFT
          </Button>
        </>
      ) : previewState?.state === PreviewState.EXTENSION_ERROR ? (
        <>
          <ErrorMessage>{previewState?.data}</ErrorMessage>
        </>
      ) : (
        <Button primary onPress={handleLoadClick}>
          Load NFT
        </Button>
      )}
    </CenterContainer>
  )
}
