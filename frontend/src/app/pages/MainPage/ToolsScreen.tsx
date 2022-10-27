import React from 'react'
import { styled } from '../../../styles'
import explorer from './img/explorer.png'
// import market3d from './img/3dmarket.jpg'
// import namespaces from './img/namespaces.jpg'
// import metaedem from './img/metaedem.jpg'
const ToolsScreenWrapper = styled('section', {
  paddingTop: '128px',
  maxWidth: '730px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLR: '$3'
})

const Subtitle = styled('h2', {
  fontSize: '$h2',
  color: '$blue900',
  fontWeight: '700',
  textAlign: 'center'
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
  background: 'rgba(255, 255, 255, 0.5)'
})

const ToolImg = styled('img')

const ToolBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$3'
})

const ToolTitle = styled('h4', {
  color: '$blue900',
  fontSize: '$body1',
  fontWeight: '700'
})

const ToolDescription = styled('p', {
  color: '$blue900',
  fontWeight: '400',
  fontSize: '$body2'
})

export default function ToolsScreen() {
  return (
    <ToolsScreenWrapper>
      <Subtitle css={{ marginBottom: '48px' }}>Mark3d tools</Subtitle>
      <ToolsContainer>
        <Tool>
          <ToolImgContainer>
            <ToolImg src={explorer}></ToolImg>
          </ToolImgContainer>
          <ToolBody>
            <ToolTitle>Explorer</ToolTitle>
            <ToolDescription>
              Explorer is an info service that provides the list of all existing
              and coming soon Metaverse Virtual spaces projects with
              characteristics
            </ToolDescription>
          </ToolBody>
        </Tool>
      </ToolsContainer>
    </ToolsScreenWrapper>
  )
}
