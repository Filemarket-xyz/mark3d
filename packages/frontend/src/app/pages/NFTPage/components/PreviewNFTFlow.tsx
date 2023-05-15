import 'swiper/css'
import 'swiper/css/navigation'
import '@google/model-viewer'

import { Loading } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide as SwiperSlideUnstyled } from 'swiper/react'

import { styled } from '../../../../styles'
import { HiddenFileMetaData } from '../../../../swagger/Api'
import { typeFiles } from '../../../components/MarketCard/helper/data'
import { fileToExtension, fileToType } from '../../../components/MarketCard/helper/fileToType'
import { DecryptResult } from '../../../processing/types'
import { gradientPlaceholderImg, textVariant } from '../../../UIkit'
import css from './styles.module.css'
import ViewFile from './ViewFile/ViewFile'

const CenterContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: '$3',
  flexDirection: 'column',
  position: 'relative'
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
  hiddenFile?: HiddenFileMetaData
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
  canViewFile,
  hiddenFile
}: PreviewNFTFlowProps) => {
  const [previewState, setPreviewState] = useState<{
    state: PreviewState
    data?: string
  }>()

  const [is3D, setIs3D] = useState<boolean | undefined>(undefined)
  const [isViewFile, setIsViewFile] = useState<boolean>(false)

  const typeFile: typeFiles | undefined = useMemo(() => {
    return hiddenFile ? fileToType(hiddenFile) : undefined
  }, [hiddenFile])

  const extensionFile: string | undefined = useMemo(() => {
    return hiddenFile ? fileToExtension(hiddenFile) : undefined
  }, [hiddenFile])

  const handleLoadClick = async () => {
    if (!getFile) return

    setIs3D((value) => {
      return !value
    })

    setPreviewState({
      state: PreviewState.LOADING
    })

    setIsViewFile(value => !value)

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

    const availableExtensions3D: string[] = ['glb', 'gltf']
    const availableExtensionsImage: string[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp']

    if (availableExtensions3D.includes(String(extensionFile))) {
      fr.readAsDataURL(model.result)
      setIs3D(true)
    } else if (availableExtensionsImage.includes(String(extensionFile))) {
      fr.readAsDataURL(model.result)
      setIs3D(false)
    } else {
      setPreviewState({
        state: PreviewState.EXTENSION_ERROR,
        data: `File type .${extensionFile} is not supported`
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
            {isViewFile ? <>{previewState?.state === PreviewState.LOADED ? (
              is3D ? <model-viewer
                src={previewState.data}
                shadow-intensity='1'
                camera-controls
                touch-action='pan-y'
                style={{ width: '100%', height: '100%' }}
              ></model-viewer>
                : <Image src={previewState.data} onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = gradientPlaceholderImg
                }} />
            ) : previewState?.state === PreviewState.LOADING ? (
              <Loading size='xl' color={'white'} />
            ) : previewState?.state === PreviewState.LOADING_ERROR ? (
              <>
                <ErrorMessage>{previewState?.data}</ErrorMessage>
              </>
            ) : previewState?.state === PreviewState.EXTENSION_ERROR &&
              <>
                <ErrorMessage>{previewState?.data}</ErrorMessage>
              </>}</>
              : <Image
              src={imageURL}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.src = gradientPlaceholderImg
              }}
            />}
            <ViewFile isPreviewView={!isViewFile} type={typeFile} onClick={() => { handleLoadClick() }} />
          </SwiperSlide>
        )}
      </SwiperStyled>
    </CenterContainer>
  )
}
