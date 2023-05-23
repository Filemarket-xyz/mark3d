import { useDrop } from '@react-aria/dnd'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'
import ImgIcon from './img/ImagePreview.svg'

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
  width: 60,
  height: 60,
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
  gap: '18px',
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
  width: 320,
  height: 160,
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

interface ItemWithGetFileProperty {
  getFile: () => Promise<File>
}

interface ImageLoaderProps {
  registerProps?: UseFormRegisterReturn
}

export default function ImageLoader(props: ImageLoaderProps) {
  const [file, setFile] = useState<File | undefined>()

  const setFileAsync = async (item: ItemWithGetFileProperty) => {
    const file = await item.getFile()
    setFile(file)
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
      setFile(undefined)

      return
    }
    setFile(target.files[0])
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
        <P selected={Boolean(preview)}>Choose Preview</P>
      </FileImageContainer>
      <FileInput
        id='inputTag'
        type='file'
        accept={'.jpg, .png, .gif'}
        {...props.registerProps}
        onChange={(e) => {
          onSelectFile(e)
          void props.registerProps?.onChange(e)
        }}
      />
    </File>
  )
}
