import { useState } from 'react'
import { UseFormRegisterReturn, UseFormResetField } from 'react-hook-form'

import { styled } from '../../../../styles'
import { CreateNFTForm } from '../../../pages/CreatePage/CreateNFTPage'
import { Button, textVariant } from '../../../UIkit'
import CrossImage from './img/cross.svg'
import BoxImage from './img/LoadFile.svg'
import SuccessImage from './img/Success.svg'

const Box = styled('img', {
  width: 48,
  height: 64,
})

const FileInput = styled('input', {
  display: 'none',
})

const BoxLabel = styled('span', {
  ...textVariant('primary1').true,
  color: '$blue500',
  fontWeight: 600,
  textAlign: 'center',
})

export const WhiteShade = styled('div', {
  width: '100%',
  height: '100%',
  background: 'rgba(255,255,255, 0)',
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
      },
    },
  },
})

const generateFileHoverStyles = () => {
  const hoverFileStyles: any = {}
  hoverFileStyles[`&:hover ${WhiteShade.selector}`] = {
    background: 'rgba(255,255,255, 0.3)',
  }

  return hoverFileStyles
}

export const File = styled('label', {
  width: '320px',
  height: '160px',
  backgroundColor: '$white',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$3',
  marginBottom: '$2',
  cursor: 'pointer',
  position: 'relative',
  border: '1px solid $gray300',
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  ...generateFileHoverStyles(),
  variants: {
    isImageUpload: {
      true: {
        height: '320px',
      },
    },
  },
})

export const CloseButton = styled(Button, {
  width: 48,
  height: 48,
  position: 'absolute',
  top: '$2',
  right: '$2',
  padding: 0,
  minWidth: 0,
  borderRadius: '$3',
  backgroundColor: '$white',
  zIndex: 2,
  border: '1px solid $gray300',
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
})

export const CrossIcon = styled('img', {
  width: 16,
  height: 16,
  objectFit: 'contain',
})

const supportedExtensions = new Set(['*'])

interface NftLoaderProps {
  registerProps: UseFormRegisterReturn
  resetField: UseFormResetField<CreateNFTForm>
}

export default function NftLoader(props: NftLoaderProps) {
  const [fileChosen, setFileChosen] = useState<File>()

  return (
    <File htmlFor='eftInput'>
      {fileChosen && (
        <CloseButton
          onPress={() => {
            props.resetField('hiddenFile')
            setFileChosen(undefined)
          }}
        >
          <CrossIcon src={CrossImage} />
        </CloseButton>
      )}
      <WhiteShade />
      <Box src={fileChosen ? SuccessImage : BoxImage} />
      {fileChosen ? (
        <BoxLabel css={{ color: '$gray600' }}>
          {fileChosen.name}
          {' '}
          uploaded
        </BoxLabel>
      ) : (
        <BoxLabel>Choose file</BoxLabel>
      )}
      <FileInput
        id='eftInput'
        type='file'
        accept={Array.from(supportedExtensions).join(',')}
        {...props.registerProps}
        onChange={async (e) => {
          const file = e.target.files ? e.target.files[0] : undefined
          if (!file) {
            return
          }

          await props.registerProps.onChange(e)
          setFileChosen(e.target.files ? e.target.files[0] : undefined)
        }}
      />
    </File>
  )
}
