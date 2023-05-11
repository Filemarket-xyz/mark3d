import React from 'react'

import { styled } from '../../../../styles'
import { Txt } from '../../../UIkit'
import { supportedByData } from '../helper/SupportedBy/data'

const SupportedByStyle = styled('div', {
  width: '777px',
  marginTop: '64px',
  '@md': {
    width: '100%'
  }
})

const SupportedContainerBlocks = styled('div', {
  width: '100%',
  marginTop: '24px',
  marginBottom: '200px',
  overflowX: 'auto',
  '& .overflow': {
    width: 'max-content',
    display: 'flex',
    gap: '66px'
  },
  '@md': {
    marginBottom: '100px'
  }
})

const SupportedBy = () => {
  return (
    <SupportedByStyle>
      <Txt ternary3 style={{ paddingLeft: '16px', marginBottom: '24px' }}>Supported By</Txt>
      <SupportedContainerBlocks>
        <div className='overflow'>
          {supportedByData.map((item, index) => {
            return <a href={item.url} target={'_blank'} key={index} rel="noreferrer"><img src={item.src} /></a>
          })}
        </div>
      </SupportedContainerBlocks>
    </SupportedByStyle>
  )
}

export default SupportedBy
