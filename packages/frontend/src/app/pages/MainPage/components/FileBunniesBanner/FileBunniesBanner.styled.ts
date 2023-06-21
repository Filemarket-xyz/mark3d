import { styled } from '../../../../../styles'
import { Container } from '../../../../UIkit'
import FBBanner from '../../img/FileBunniesBanner/FBBannerXl.png'
import FBBannerLg from '../../img/FileBunniesBanner/FBBunniesLg.png'
import FBBannerMd from '../../img/FileBunniesBanner/FBBunniesMd.png'
import FBBannerSm from '../../img/FileBunniesBanner/FBBunniesSm.png'
import Setka from '../../img/FileBunniesBanner/Setka.svg'

export const FileBunniesBannerStyled = styled('div', {
  width: '100%',
  marginTop: 'calc($layout$navBarHeight - 85px)',
  background: `url(${Setka})`,
  backgroundSize: 'contain',
  height: '360px',
  position: 'relative',
  '& .chervyak, .star': {
    position: 'absolute',
  },
  '& .chervyak': {
    bottom: '0',
  },
  '@lg': {
    height: '303px',
    '& .chervyak': {
      left: '-20px',
      transform: 'scale(0.9)',
    },
  },
  '@md': {
    height: '236px',
    '& .chervyak': {
      left: '-140px',
      transform: 'scale(0.5)',
      bottom: '-62px',
    },
  },
  '@sm': {
    height: '210px',
    '& .chervyak': {
      left: '-100px',
      transform: 'scale(0.4)',
      bottom: '-10px',
    },
  },
})

export const ContainerBunnies = styled(Container, {
  position: 'relative',
  height: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  '& .star': {
    bottom: '-3px',
    right: '-3.7%',
    '@xl': {
      bottom: '-12px',
      right: '-5.7%',
      transform: 'scale(0.9)',
    },
    '@lg': {
      right: '-7.7%',
    },
    '@md': {
      width: '90px',
      bottom: '-4px',
    },
    '@sm': {
      width: '37px',
      bottom: '18px',
      right: '-2.7%',
    },
  },
  '@sm': {
    justifyContent: 'center',
  },
})

export const MainBanner = styled('div', {
  content: `url(${FBBanner})`,
  width: '100%',
  position: 'relative',
  zIndex: '3',
  '@xl': {
    content: `url(${FBBannerLg})`,
  },
  '@lg': {
    content: `url(${FBBannerMd})`,
  },
  '@sm': {
    content: `url(${FBBannerSm})`,
  },
})

export const MainBannerBlock = styled('div', {
  position: 'relative',
  '@lg': {
    height: '217px',
  },
  '@md': {
    height: '150px',
  },
  '@sm': {
    height: '122px',
  },
})
