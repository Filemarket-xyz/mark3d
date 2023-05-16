import 'swiper/css'
import 'swiper/css/navigation'
import '@google/model-viewer'

import { Loading } from '@nextui-org/react'
import { useEffect, useMemo, useState } from 'react'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide as SwiperSlideUnstyled } from 'swiper/react'
import { useAccount } from 'wagmi'

import { styled } from '../../../../styles'
import { HiddenFileMetaData } from '../../../../swagger/Api'
import { typeFiles } from '../../../components/MarketCard/helper/data'
import { fileToExtension, fileToType } from '../../../components/MarketCard/helper/fileToType'
import { useStores } from '../../../hooks'
import { useSeed } from '../../../processing/SeedProvider/useSeed'
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
  const { address } = useAccount()
  const { tokenMetaStore, tokenStore } = useStores()
  const seed = useSeed(address)
  const [is3D, setIs3D] = useState<boolean | undefined>(undefined)
  const [isViewFile, setIsViewFile] = useState<boolean>(false)
  const [isViewedMounted, setIsViewedMounted] = useState<boolean>(false)

  const typeFile: typeFiles | undefined = useMemo(() => {
    return hiddenFile ? fileToType(hiddenFile) : undefined
  }, [hiddenFile])

  const extensionFile: string | undefined = useMemo(() => {
    return hiddenFile ? fileToExtension(hiddenFile) : undefined
  }, [hiddenFile])

  const isLoading: boolean = useMemo(() => {
    return tokenMetaStore.isLoading || tokenStore.isLoading || !seed
  }, [tokenMetaStore.isLoading, tokenStore.isLoading, !seed])

  const isCanView: boolean = useMemo(() => {
    if (!getFile) return false
    const availableExtensions3D: string[] = ['glb', 'gltf']
    const availableExtensionsImage: string[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    if (availableExtensions3D.includes(String(extensionFile))) {
      setIs3D(true)
      return true
    } else if (availableExtensionsImage.includes(String(extensionFile))) {
      setIs3D(false)
      return true
    }
    return false
  }, [hiddenFile, getFile])

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

    if (isCanView) {
      fr.readAsDataURL(model.result)
    } else {
      setPreviewState({
        state: PreviewState.EXTENSION_ERROR,
        data: `File type .${extensionFile} is not supported`
      })
    }
  }

  useEffect(() => {
    if (isCanView && !isViewedMounted && seed && !isLoading) {
      void handleLoadClick()
      setIsViewFile(true)
      setIsViewedMounted(true)
    } else {
      setIsViewFile(false)
    }
  }, [getFile, isCanView, seed, isLoading])

  useEffect(() => {
    if (isLoading) {
      setPreviewState({
        state: PreviewState.LOADING
      })
    }
  }, [isLoading])

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
            {isViewFile ? (
              <>
                {previewState?.state === PreviewState.LOADED ? (
                  is3D ? (
                    <model-viewer
                      camera-controls
                      src={previewState.data}
                      shadow-intensity='1'
                      touch-action='pan-y'
                      style={{ width: '100%', height: '100%' }}
                    >
                    </model-viewer>
                  )
                    : (
                      <Image
                        src={previewState.data}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src = gradientPlaceholderImg
                        }}
                      />
                      )
                ) : previewState?.state === PreviewState.LOADING ? (
                  <Loading size='xl' color={'white'} />
                ) : previewState?.state === PreviewState.LOADING_ERROR ? (
                  <>
                    <ErrorMessage>{previewState?.data}</ErrorMessage>
                  </>
                ) : previewState?.state === PreviewState.EXTENSION_ERROR && (
                  <>
                    <ErrorMessage>{previewState?.data}</ErrorMessage>
                  </>
                )}
              </>
            )
              : (
                <>
                  {isLoading ? <Loading size='xl' color={'white'} /> : (
                    <Image
                      src={imageURL}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null
                        currentTarget.src = gradientPlaceholderImg
                      }}
                    />
                  )}
                </>

              )}
            {(isCanView && !isLoading) && <ViewFile isPreviewView={!isViewFile} type={typeFile} onClick={() => { setIsViewFile(value => !value); handleLoadClick() }} />}
          </SwiperSlide>
        )}
      </SwiperStyled>
    </CenterContainer>
  )
}
