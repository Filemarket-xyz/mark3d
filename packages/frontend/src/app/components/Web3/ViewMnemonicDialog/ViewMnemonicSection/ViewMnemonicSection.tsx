import React from 'react'

import CopyImg from '../../../../../assets/img/Copy.svg'
import DownloadImg from '../../../../../assets/img/Download.svg'
import { styled } from '../../../../../styles'
import { Button } from '../../../../UIkit'
import ViewMnemonicCard from './ViewMnemonicCard/ViewMnemonicCard'

const ViewMnemonicSectionStyle = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

const ViewMnemonicCards = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3,1fr)',
  gap: '8px',
  '@md': {
    gridTemplateColumns: '1fr 1fr',
  },
})

const ButtonsContainer = styled('div', {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  '@md': {
    gridTemplateColumns: '1fr',
  },
})
interface ViewMnemonicSectionProps {
  mnemonic: string
}

const ViewMnemonicSection = ({ mnemonic }: ViewMnemonicSectionProps) => {
  function downloadTextFile(text: string) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', 'FileWallet_SeedPhrase')
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    element.dispatchEvent(event)
  }

  return (
    <ViewMnemonicSectionStyle>
      <ViewMnemonicCards>
        {mnemonic.split(' ').map((item, index) => {
          return <ViewMnemonicCard key={index} number={index + 1} word={item} />
        })}
      </ViewMnemonicCards>
      <ButtonsContainer>
        <Button
          whiteWithBlue
          style={{ borderWidth: '1px', fontSize: '16px', height: '56px' }}
          onClick={() => {
            navigator.clipboard.writeText(mnemonic)
          }}
        >
          Copy seed phrase
          <img src={CopyImg} style={{ paddingLeft: '10px' }} />
        </Button>
        <Button
          whiteWithBlue
          style={{ borderWidth: '1px', fontSize: '16px', height: '56px' }}
          onClick={() => {
            downloadTextFile(mnemonic)
          }}
        >
          Download as a file
          <img src={DownloadImg} style={{ paddingLeft: '10px' }} />
        </Button>
      </ButtonsContainer>
    </ViewMnemonicSectionStyle>
  )
}

export default ViewMnemonicSection
