import * as React from 'react'
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled'
import { styled } from '../../../styles'
import PostfixedInput from './PostfixedInput'
import bottomArrow from './img/arrow-bottom.svg'

const Listbox = styled('ul', {
  maxWidth: '600px',
  width: '100%',
  margin: 0,
  zIndex: 1,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: '$white',
  overflow: 'auto',
  maxHeight: 200,
  border: '2px solid transparent',
  borderRadius: '$2',
  '& li': {
    color: '$blue900',
    backgroundColor: '$white',
    padding: 'calc($3 - $1)'
  },
  '& li.Mui-focused': {
    backgroundColor: '#4a8df6',
    color: 'white',
    cursor: 'pointer'
  },
  '& li:active': {
    backgroundColor: '#2977f5',
    color: 'white'
  }
})

export interface ComboboxProps {
  options: Array<{ title: string }>
}

export default function Combobox(props: ComboboxProps) {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    options: props.options,
    getOptionLabel: (option) => option.title
  })

  return (
    <div>
      <div {...getRootProps()}>
        <PostfixedInput
          placeholder='Select collection'
          postfix={<img width={24} height={24} src={bottomArrow} />}
          inputProps={getInputProps()}
        />
      </div>
      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as typeof props.options).map((option, index) => (
            <li {...getOptionProps({ option, index })} key={option.title}>
              {option.title}
            </li>
          ))}
        </Listbox>
      )}
    </div>
  )
}
