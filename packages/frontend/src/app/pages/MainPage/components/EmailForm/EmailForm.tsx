// @ts-expect-error
import ConvertKitForm from 'convertkit-react'
import React from 'react'

import { styled } from '../../../../../styles'
import { textVariant } from '../../../../UIkit'

const ConvertKitStyle = styled(ConvertKitForm, {
  gap: '10px',
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  '& input': {
    border: '1px solid #2F3134',
    filter: 'drop-shadow(0px 4px 20px rgba(35, 37, 40, 0.05))',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#232528',
    ...textVariant('primary1').true,
    fontWeight: '400',
    width: '60%',
    '@sm': {
      width: '80%',
      margin: '0 auto',
    },
  },
  '& button': {
    background: 'none',
    ...textVariant('primary1').true,
    border: '2px solid #028FFF',
    borderRadius: '12px',
    color: '#028FFF',
    width: '20%',
    height: '48px',
    '@sm': {
      width: '80%',
      margin: '0 auto',
    },
  },
  '& #ck-first-name': {
    display: 'none',
  },
  '@sm': {
    flexDirection: 'column',
  },
})

const EmailForm = () => {
  return (
    <ConvertKitStyle formId={5117091} submitText={'Get Access'} emailPlaceholder={'Email'} />
  )
}

export default EmailForm
