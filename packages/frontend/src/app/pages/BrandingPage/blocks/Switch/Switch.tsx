import { useState } from 'react'

import { styled } from '../../../../../styles'

const SwitchWrapper = styled('div', {
  '.switch': {
    display: 'inline-flex',
    columnGap: '$1',
    padding: '$2',
    borderRadius: '$4',
    border: '2px solid #0090FF',
    '@md': {
      padding: '6px',
    },
    '@sm': {
      columnGap: '0',
    },
  },
  '.switchButton': {
    padding: '12px 36px',
    borderRadius: '$4',
    backgroundColor: 'transparent',
    fontFamily: '$body',
    fontSize: '$body2',
    fontWeight: '$primary',
    lineHeight: 'ternary3',
    color: '#0090FF',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: '2px solid transparent',
    '@md': {
      padding: '10px 24px',
      fontSize: '$body3',
    },
    '@sm': {
      padding: '8px 16px',
      fontSize: '$body4',
    },
    '&.active': {
      backgroundColor: '#0090FF',
      color: '$white',
    },
    '&:hover': {
      borderColor: '#0090FF',
    },
  },
})

interface Option {
  label: string
  value: string
}

interface SwitchProps {
  options: Option[]
  onChange: (value: string) => void
}

export default function Switch ({ options, onChange }: SwitchProps) {
  const [currentOptionValue, setCurrentOptionValue] = useState(options[0].value)

  const handleSwitch = (optionValue: string) => {
    if (currentOptionValue === optionValue) return

    setCurrentOptionValue(optionValue)
    onChange(optionValue)
  }

  return (
    <SwitchWrapper>
      <div className='switch'>
        {options.map(option => (
          <button
            key={option.value}
            className={`switchButton ${currentOptionValue === option.value && 'active'}`}
            onClick={() => handleSwitch(option.value)}
          >
            {option.label}
          </button>
        ),
        )}
      </div>
    </SwitchWrapper>
  )
}
