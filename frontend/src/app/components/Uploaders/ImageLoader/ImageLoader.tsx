import { useDrop } from '@react-aria/dnd'
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { styled } from '../../../../styles'
import { TextBold } from '../../../pages/CreatePage/CreateCollectionPage'
import { textVariant } from '../../../UIkit'
import ImgIcon from './img/image-icon.svg'

const Shade = styled('div', {
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 0)',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 'inherit',
  transition: 'all 0.15s ease-in-out',
  zIndex: 1,
  variants: {
    selected: {
      true: {
        zIndex: 0,
        background: 'rgba(0, 0, 0, 0)'
      }
    }
  }
})

const generateFileHoverStyles = () => {
  const hoverFileStyles: any = {}
  hoverFileStyles[`&:hover ${Shade.selector}`] = {
    background: 'rgba(255,255,255, 0.3)'
  }
  return hoverFileStyles
}

const P = styled('p', {
  position: 'relative',
  transition: 'all 0.15s ease-in-out',
  variants: {
    selected: {
      true: {
        opacity: 0,
        zIndex: 1
      }
    }
  }
})

const ImageIcon = styled('img', {
  width: 64,
  heigth: 64,
  transition: 'all 0.15s ease-in-out',
  variants: {
    selected: {
      true: {
        opacity: 0,
        zIndex: 1
      }
    }
  }
})

const generateSelectedFileHoverStyles = () => {
  const styles: any = {}
  styles[`&:hover ${Shade.selector}`] = {
    background: 'rgba(0, 0, 0, 0.5)'
  }
  styles[`&:hover ${ImageIcon.selector}`] = {
    opacity: 1
  }
  styles[`&:hover ${P.selector}`] = {
    opacity: 1
  }
  return styles
}

const File = styled('label', {
  borderRadius: '$3',
  display: 'inline-flex',
  gap: '$4',
  alignItems: 'center',
  cursor: 'pointer',
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex'
  },
  variants: {
    selected: {
      true: {
        ...generateSelectedFileHoverStyles()
      }
    }
  },
  ...generateFileHoverStyles()
})

const FileImageContainer = styled('div', {
  position: 'relative',
  width: 160,
  height: 152,
  backgroundColor: '$white',
  color: '$blue500',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$2',
  flexDirection: 'column',
  borderRadius: '$3',
  ...textVariant('primary1').true
})

const FileInput = styled('input', {
  display: 'none'
})

const FileDescriptionList = styled('ul', {
  ...textVariant('secondary2').true,
  color: '$gray500',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2'
})

const FileDescriptionItem = styled('li', {})

interface ItemWithGetFileProperty {
  getFile: () => Promise<File>
}

export default function ImageLoader({ onChange }: { onChange?: (file: File | undefined) => void }) {
  const [file, setFile] = useState<File | undefined>()

  const handleFile = useCallback((file: File | undefined) => {
    setFile(file)
    onChange?.(file)
  }, [setFile, onChange])

  const setFileAsync = async (item: ItemWithGetFileProperty) => {
    const file = await item.getFile()
    handleFile(file)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [preview, setPreview] = useState<string | undefined>()

  const ref = React.useRef(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dropProps, isDropTarget } = useDrop({
    ref,
    onDrop(e) {
      const item = e.items.find(
        (item) =>
          item.kind === 'file' &&
          (item.type === 'image/jpeg' ||
            item.type === 'image/png' ||
            item.type === 'image/gif')
      )
      if (item) {
        void setFileAsync(item as unknown as ItemWithGetFileProperty)
      }
    }
  })

  useEffect(() => {
    if (!file) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const onSelectFile = (e: SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    if (!target.files || target.files.length === 0) {
      handleFile(undefined)
      return
    }
    handleFile(target.files[0])
  }
  return (
    <File htmlFor='inputTag' selected={Boolean(preview)}>
      <FileImageContainer
        {...dropProps}
        ref={ref}
        css={{
          backgroundImage: `url('${preview}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Shade selected={Boolean(preview)}></Shade>
        <ImageIcon src={ImgIcon} selected={Boolean(preview)} />
        <P selected={Boolean(preview)}>Choose photo</P>
      </FileImageContainer>

      <FileDescriptionList>
        <FileDescriptionItem>
          <TextBold>Recommended size:</TextBold> 300x300 px
        </FileDescriptionItem>
        <FileDescriptionItem>
          <TextBold>Formats:</TextBold> JPG, PNG, or GIF
        </FileDescriptionItem>
        <FileDescriptionItem>
          <TextBold>Max size:</TextBold> 100 MB
        </FileDescriptionItem>
      </FileDescriptionList>
      <FileInput
        id='inputTag'
        type='file'
        onChange={onSelectFile}
        accept={'.jpg, .png, .gif'}
      />
    </File>
  )
}
