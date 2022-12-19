import { useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'
import BoxImage from './img/box.svg'

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

interface NftLoaderProps {
  registerProps: UseFormRegisterReturn
}

export default function NftLoader(props: NftLoaderProps) {
  const [label, setLabel] = useState('Choose file')

  return (
    <File htmlFor='nftInput'>
      <WhiteShade></WhiteShade>
      <Box src={BoxImage} />
      <BoxLabel>{label}</BoxLabel>
      <FileInput
        id='nftInput'
        type='file'
        accept={
          '.png, .jpg, .jpeg, .fbx, .3ds, .max, .blend, .obj, .c4d, .mb, .ma, .lwo, .lxo, .skp, .stl, .uasset, .dae, .ply, .glb, .gltf, .usdf, .unitypackage'
        }
        {...props.registerProps}
        onChange={async (e) => {
          await props.registerProps.onChange(e)
          setLabel('File chosen')
        }}
      />
    </File>
  )
}
