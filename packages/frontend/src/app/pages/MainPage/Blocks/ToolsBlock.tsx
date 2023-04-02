import React from 'react'
import { styled } from '../../../../styles'
import explorer from '../img/explorer.png'
import market3d from '../img/3dmarket.png'
import namespaces from '../img/namespaces.png'
import metaedem from '../img/metaedem.png'

export const BlockWrapper = styled('section', {
  paddingTop: '128px',
  maxWidth: '730px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLR: '$3',
  '@md': {
    paddingTop: '64px'
  },
  '@sm': {
    paddingTop: '40px'
  }
})

export const Subtitle = styled('h2', {
  fontSize: '$h2',
  color: '$blue900',
  fontWeight: '700',
  textAlign: 'center',
  '@sm': {
    fontSize: '$h3'
  }
})

const ToolsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '48px'
})

const Tool = styled('div', {
  display: 'flex',
  gap: '$4',
  variants: {
    reversed: {
      true: {
        flexDirection: 'row-reverse'
      }
    }
  },
  '@sm': {
    gap: '$3'
  }
})

const ToolImgContainer = styled('div', {
  width: '190px',
  height: '190px',
  borderRadius: '48px',
  border: '8px solid $white',
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '$whiteOp50',
  '@md': {
    width: '140px',
    height: '140px',
    borderRadius: '$4'
  },
  '@sm': {
    width: '110px',
    height: '110px'
  }
})

const ToolImg = styled('img')

const ToolBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$3',
  '@sm': {
    gap: '$2'
  }
})

const ToolTitle = styled('h4', {
  color: '$blue900',
  fontSize: '$body1',
  fontWeight: '700',
  '@sm': {
    fontSize: '$body2'
  }
})

const ToolDescription = styled('p', {
  color: '$blue900',
  fontWeight: '400',
  fontSize: '$body2',
  '@sm': {
    fontSize: '$body4'
  }
})

interface ITool {
  title: string
  description: string
  imgURL: string
}

const tools: ITool[] = [
  {
    title: 'Explorer',
    imgURL: explorer,
    description:
      'Explorer is an info service that provides the list of all existing and coming soon Metaverse Virtual spaces projects with characteristics'
  },
  {
    title: '3D Market',
    imgURL: market3d,
    description:
      '3D Market is an NFT marketplace for any type of 3D models or virtual spaces. Mint, List, Sell your 3d creations or buy them from other artists'
  },
  {
    title: 'Namespases',
    imgURL: namespaces,
    description:
      'Namespases .3d is a decentralized domain name service. Your .3d domain will contain your links to all kinds of virtual spaces, that you own'
  },
  {
    title: 'MetaEdem',
    imgURL: metaedem,
    description:
      'MetaEdem is our own virtual space which is a 3D part of our website to give a touch and feel of Metaverse. Soon available in VR'
  }
]

export default function ToolsBlock() {
  return (
    <BlockWrapper>
      <Subtitle css={{ marginBottom: '48px' }}>Mark3d tools</Subtitle>
      <ToolsContainer>
        {tools.map((t, index) => (
          <Tool reversed={index % 2 !== 0} key={t.title}>
            <ToolImgContainer>
              <ToolImg src={t.imgURL}></ToolImg>
            </ToolImgContainer>
            <ToolBody>
              <ToolTitle>{t.title}</ToolTitle>
              <ToolDescription>{t.description}</ToolDescription>
            </ToolBody>
          </Tool>
        ))}
      </ToolsContainer>
    </BlockWrapper>
  )
}
