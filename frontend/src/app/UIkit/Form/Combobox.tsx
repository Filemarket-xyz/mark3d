import * as React from 'react'
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled'
import { styled } from '../../../styles'
import { Input as CustomInput } from './Input'

const Input = styled(CustomInput, {
  width: '100%'
})

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

export default function Combobox() {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    options: top100Films,
    getOptionLabel: (option) => option.title
  })

  return (
    <div>
      <div {...getRootProps()}>
        <Input {...getInputProps()} placeholder={'Select collection'} />
      </div>
      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as typeof top100Films).map((option, index) => (
            <li {...getOptionProps({ option, index })} key={option.title}>
              {option.title}
            </li>
          ))}
        </Listbox>
      )}
    </div>
  )
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 }
]
