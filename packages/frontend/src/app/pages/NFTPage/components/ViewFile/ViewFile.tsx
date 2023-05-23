import React, { useMemo } from 'react'

import { styled } from '../../../../../styles'
import { typeFiles } from '../../../../components/MarketCard/helper/data'
import { Txt } from '../../../../UIkit'
import { ViewFilesImage, ViewFilesText } from '../../helper/ViewFilesData/ViewFilesData'
import PreviewImg from '../../img/Preview.svg'

const ViewFileStyle = styled('div', {
  width: '144px',
  height: '32px',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)',
  borderRadius: '8px',
  background: 'white',
  color: '#232528',
  opacity: '0.75',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'flex-start',
  '&:hover': {
    opacity: '1'
  },
  '& .container': {
    padding: '0 14.5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%'
  },
  position: 'absolute',
  bottom: '28px',
  right: 'calc((100% - $breakpoints$xl) * 0.3 + $space$4)',
  '@xl': {
    right: 'calc((100% - $breakpoints$lg) * 0.554 + $space$4)'
  },
  '@lg': {
    right: 'calc((100% - $breakpoints$md) * 0.554 + $space$4)'
  },
  '@md': {
    right: 'calc((100% - $breakpoints$sm) * 0.554 + $space$3)'
  },
  '@sm': {
    right: '$3'
  }
})

interface ViewFileProps {
  type?: typeFiles
  onClick?: () => void
  isPreviewView: boolean
}

const ViewFile = ({ type, onClick, isPreviewView }: ViewFileProps) => {
  const text: string | undefined = useMemo(() => {
    if (!type) return

    return ViewFilesText[type]
  }, [type])

  const img: string | undefined = useMemo(() => {
    if (!type) return

    return ViewFilesImage[type]
  }, [type])

  return (
    <ViewFileStyle onClick={onClick}>
      <div className='container'>
        <img src={isPreviewView ? img : PreviewImg} />
        <Txt primary1>{isPreviewView ? text : 'Preview'}</Txt>
      </div>
    </ViewFileStyle>
  )
}

export default ViewFile
