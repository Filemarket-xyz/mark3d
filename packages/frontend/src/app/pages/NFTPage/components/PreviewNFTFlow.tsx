import 'swiper/css'
import 'swiper/css/navigation'

import { Loading } from '@nextui-org/react'
import { useState } from 'react'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide as SwiperSlideUnstyled } from 'swiper/react'

import { styled } from '../../../../styles'
import { DecryptResult } from '../../../processing/types'
import { Button, gradientPlaceholderImg, textVariant } from '../../../UIkit'
import css from './styles.module.css'

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

const SwiperSlide = styled(SwiperSlideUnstyled, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

export const getFileExtension = (file: File) =>
  file.name.split('.')?.pop() ?? ''

enum PreviewState {
  LOADED,
  LOADING,
  LOADING_ERROR,
  EXTENSION_ERROR
}

interface PreviewNFTFlowProps {
  getFile?: () => Promise<DecryptResult<File>>
  canViewFile: boolean
  imageURL: string
}

const SwiperStyled = styled(Swiper)

const Image = styled('img', {
  width: 'auto',
  maxWidth: '80%',
  height: '90%',
  borderRadius: '$3',
  objectFit: 'cover',
  '@sm': {
    width: 290,
    height: 290
  }
})

/** Component that implement logic for loading and showing 3D models  */
export const PreviewNFTFlow = ({
  getFile,
  imageURL,
  canViewFile
}: PreviewNFTFlowProps) => {
  const [previewState, setPreviewState] = useState<{
    state: PreviewState
    data?: string
  }>()

  const [is3D, setIs3D] = useState<boolean | undefined>(undefined)

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
    const availableExtensions3D: string[] = ['glb', 'gltf']
    const availableExtensionsImage: string[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff', 'psd', 'ai', 'eps']
    if (availableExtensions3D.includes(fileExtension)) {
      fr.readAsDataURL(model.result)
      setIs3D(true)
    } else if (availableExtensionsImage.includes(fileExtension)) {
      fr.readAsDataURL(model.result)
      setIs3D(false)
    } else {
      setPreviewState({
        state: PreviewState.EXTENSION_ERROR,
        data: `File type .${fileExtension} is not supported`
      })
    }
  }

  return (
    <CenterContainer>
      <SwiperStyled
        navigation={true}
        modules={[Navigation, Pagination]}
        className={css.__swiper}
        allowTouchMove={false}
        pagination={{ clickable: true }}
        css={{
          '--swiper-navigation-color': 'var(--colors-gray300)',
          '--swiper-navigation-size': '20px'
        }}
      >
        {canViewFile && (
          <SwiperSlide>
            {previewState?.state === PreviewState.LOADED ? (
              is3D ? <model-viewer
                src={previewState.data}
                ar
                shadow-intensity='1'
                camera-controls
                touch-action='pan-y'
                style={{ width: '100%', height: '100%' }}
              ></model-viewer>
                : <img src={previewState.data} />
            ) : previewState?.state === PreviewState.LOADING ? (
              <Loading size='xl' color={'white'} />
            ) : previewState?.state === PreviewState.LOADING_ERROR ? (
              <>
                <ErrorMessage>{previewState?.data}</ErrorMessage>
                <Button secondary onPress={handleLoadClick}>
                  Load NFT
                </Button>
              </>
            ) : previewState?.state === PreviewState.EXTENSION_ERROR ? (
              <>
                <ErrorMessage>{previewState?.data}</ErrorMessage>
              </>
            ) : (
              <Button secondary onPress={handleLoadClick}>
                Load NFT
              </Button>
            )}
          </SwiperSlide>
        )}
        <SwiperSlide>
          <Image
            src={imageURL}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = gradientPlaceholderImg
            }}
          />
        </SwiperSlide>
      </SwiperStyled>
    </CenterContainer>
  )
}
