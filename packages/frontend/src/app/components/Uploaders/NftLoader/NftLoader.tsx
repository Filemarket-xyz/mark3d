import { useState } from 'react'
import { UseFormRegisterReturn, UseFormResetField } from 'react-hook-form'

import { styled } from '../../../../styles'
import { CreateNFTForm } from '../../../pages/CreatePage/CreateNFTPage'
import { Button, textVariant } from '../../../UIkit'
import BoxImage from './img/box.svg'
import CrossImage from './img/cross.svg'
import SuccessImage from './img/Success.svg'

const Box = styled('img', {
  width: 80,
  height: 80
})

const FileInput = styled('input', {
  display: 'none'
})

const BoxLabel = styled('span', {
  ...textVariant('primary1').true,
  color: '$blue500',
  fontWeight: 600
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
        zIndex: 0
      }
    }
  }
})

const generateFileHoverStyles = () => {
  const hoverFileStyles: any = {}
  hoverFileStyles[`&:hover ${WhiteShade.selector}`] = {
    background: 'rgba(255,255,255, 0.3)'
  }
  return hoverFileStyles
}

const File = styled('label', {
  width: '100%',
  height: '232px',
  backgroundColor: '$white',
  borderRadius: '16px',
  backgroundImage: 'url("/img/box.svg")',
  backgroundSize: '56px 45px',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$3',
  marginBottom: '$2',
  cursor: 'pointer',
  position: 'relative',
  ...generateFileHoverStyles()
})

const CloseButton = styled(Button, {
  width: 48,
  height: 48,
  position: 'absolute',
  top: '$3',
  right: '$3',
  padding: 0,
  minWidth: 0,
  borderRadius: '$3',
  backgroundColor: '$white',
  zIndex: 2,
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)'
})

const CrossIcon = styled('img', {
  width: 16,
  height: 16,
  objectFit: 'contain'
})

const supportedExtensions = new Set(['*'])

interface NftLoaderProps {
  registerProps: UseFormRegisterReturn
  resetField: UseFormResetField<CreateNFTForm>
}

export default function NftLoader(props: NftLoaderProps) {
  const [fileChosen, setFileChosen] = useState<File>()

  return (
    <File htmlFor='nftInput'>
      {fileChosen && (
        <CloseButton
          onPress={() => {
            props.resetField('hiddenFile')
            setFileChosen(undefined)
          }}
        >
          <CrossIcon src={CrossImage}></CrossIcon>
        </CloseButton>
      )}
      <WhiteShade></WhiteShade>
      <Box src={fileChosen ? SuccessImage : BoxImage} />
      {fileChosen ? (
        <BoxLabel css={{ color: '$gray500' }}>
          {fileChosen.name} selected
        </BoxLabel>
      ) : (
        <BoxLabel>Choose file</BoxLabel>
      )}
      <FileInput
        id='nftInput'
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
