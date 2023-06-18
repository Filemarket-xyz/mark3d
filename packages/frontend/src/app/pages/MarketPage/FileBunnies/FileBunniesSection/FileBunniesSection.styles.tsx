import { styled } from '../../../../../styles'
import { PageLayout, textVariant } from '../../../../UIkit'
import BottomBannerImg from '../../img/BottomBanner.png'
import FBBgLg from '../../img/FBBgLg.png'
import FBBgMd from '../../img/FBBgMd.png'
import FBBgSm from '../../img/FBBgSm.png'
import FileBunniesBgXl from '../../img/FileBunniesBg.png'

export const FileBunniesSectionStyle = styled('div', {
  background: `url(${FileBunniesBgXl})`,
  width: '100%',
  color: 'white',
  position: 'relative',
  '& .leftBottomPl, .rightPl, .leftTopPl': {
    position: 'absolute',
  },
  '& .leftTopPl': {
    top: '13px',
  },
  '& .rightPl': {
    right: '0',
    top: '118px',
  },
  '& .leftBottomPl': {
    bottom: '96px',
    right: '0',
  },
  '@lg': {
    background: `url(${FBBgLg})`,
  },
  '@md': {
    background: `url(${FBBgMd})`,
  },
  '@sm': {
    background: `url(${FBBgSm})`,
    backgroundSize: '103%',
    backgroundPositionX: '-6px',
    '& .leftBottomPl, .rightPl, .leftTopPl': {
      display: 'none',
    },
  },
})

export const Title = styled('div', {
  ...textVariant('h1').true,
  fontSize: '48px',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    height: '100%',
  },
  '@lg': {
    fontSize: '40px',
    height: '96px',
  },
  '@sm': {
    fontSize: '24px',
    height: '70px',
  },
})

export const FileBunniesLayout = styled(PageLayout, {
  background: 'none',
  zIndex: '1',
  position: 'relative',
  margin: '0px auto',
  maxWidth: '1238px',
  paddingLeft: '0',
  paddingRight: '0',
  '@xl': {
    paddingLR: 'calc((100% - $breakpoints$lg) * 0.554 + $space$4)',
    maxWidth: 'inherit',
  },
  '@lg': {
    paddingLR: '0',
    width: '620px',
    margin: '0 auto',
    paddingBottom: '70px',
  },
  '@md': {
    paddingLR: 'calc((100% - $breakpoints$sm) * 0.454 + $space$3)',
    width: 'inherit',
  },
  '@sm': {
    paddingLR: '$3',
    paddingTop: '94px',
    paddingBottom: '27px',
  },
})

export const MainContent = styled('div', {
  marginTop: '32px',
  display: 'flex',
  gap: '20px',
  '@lg': {
    flexDirection: 'column-reverse',
    gap: '48px',
  },
})

export const LeftBlock = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  '@lg': {
    gap: '20px',
  },
})

export const LeftTextBlock = styled('div', {
  ...textVariant('primary1').true,
  borderRadius: '16px',
  padding: '20px',
  backgroundBlendMode: 'overlay',
  position: 'relative',
  background: '#25254c',
  border: '1px solid $gray400',
  '&:before': {
    content: '',
    width: '100%',
    height: '100%',
    borderRadius: '16px',
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '1',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    mixBlendMode: 'overlay',
  },
  '@lg': {
    background: '#515170',
  },
  '@sm': {
    background: '#414163',
  },
})

export const LeftBlockTitle = styled('span', {
  fontSize: '32px',
  lineHeight: '40px',
  paddingBottom: '12px',
  '@xl': {
    fontSize: '24px',
  },
  '@sm': {
    fontSize: '20px',
    lineHeight: '24px',
  },
})

export const LeftBlockText = styled('p', {
  marginTop: '12px',
  fontSize: '24px',
  fontWeight: '400',
  lineHeight: '32px',
  '@xl': {
    fontSize: '20px',
  },
  '@sm': {
    fontSize: '16px',
    lineHeight: '24px',
  },
})

export const ToolTipBlock = styled('div', {
  borderRadius: '12px',
  padding: '14px',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  background: '#353559',
  '&:before': {
    content: '',
    width: '100%',
    borderRadius: '12px',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    mixBlendMode: 'overlay',
  },
  '& *': {
    zIndex: '2',
  },
  '@sm': {
    background: '#414163 !important',
  },
  variants: {
    last: {
      true: {
        background: 'linear-gradient(180deg, rgba(53,53,89,1) 0%, rgba(84,84,115,1) 100%)',
        '@lg': {
          background: 'linear-gradient(0deg, rgba(106,106,133,1) 0%, rgba(97,97,126,1) 100%)',
        },
      },
    },
    second: {
      true: {
        '@lg': {
          background: '#5e5e7b',
        },
      },
    },
    first: {
      true: {
        '@lg': {
          background: '#5b5b78',
        },
      },
    },
  },
})

export const BottomBanner = styled('div', {
  background: `url(${BottomBannerImg})`,
  height: '64px',
})

export const CardsBlock = styled('div', {
  display: 'flex',
  gap: '20px',
  '@lg': {
    justifyContent: 'space-between',
    height: '476px',
  },
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',
    height: 'max-content',
  },
})
