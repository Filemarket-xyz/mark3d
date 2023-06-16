import React from 'react'

import { styled } from '../../../../styles'
import { Txt } from '../../../UIkit'
import { supportedByData } from '../helper/SupportedBy/data'

const SupportedByStyle = styled('div', {
  width: '777px',
  marginTop: '64px',
  '@md': {
    width: '100%',
  },
})

const SupportedContainerBlocks = styled('div', {
  width: '100%',
  marginTop: '24px',
  marginBottom: '200px',
  display: 'flex',
  gap: '66px',
  '@sm': {
    marginBottom: '100px',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gapColumn: '32px',
  },
})

const SupportedBy = () => {
  return (
    <SupportedByStyle>
      <Txt h4 style={{ paddingLeft: '16px', marginBottom: '24px', fontSize: '24px' }}>Supported By</Txt>
      <SupportedContainerBlocks>
        {supportedByData.map((item, index) => {
          return (
            <a
              key={index}
              href={item.url}
              target={'_blank'}
              rel="noreferrer"
            >
              <img src={item.src} />
            </a>
          )
        })}
      </SupportedContainerBlocks>
    </SupportedByStyle>
  )
}

export default SupportedBy
