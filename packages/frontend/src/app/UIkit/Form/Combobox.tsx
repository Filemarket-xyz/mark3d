/* eslint-disable multiline-ternary */
import * as React from 'react'
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled'
import { styled } from '../../../styles'
import PostfixedInput from './PostfixedInput'
import bottomArrow from './img/arrow-bottom.svg'
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path
} from 'react-hook-form'
import { AutocompleteChangeReason } from '@mui/material'
import { Loading } from '@nextui-org/react'

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

const LoadingContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$4'
})

export interface ComboBoxOption {
  title: string
  id: string
}

interface ComboboxProps<T extends FieldValues> {
  options: ComboBoxOption[]
  value: ComboBoxOption
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    data: ComboBoxOption | null,
    reason: AutocompleteChangeReason
  ) => void
  otherFieldProps?: ControllerRenderProps<T, Path<T>>
  isLoading?: boolean
}

function UncontrolledCombobox<T extends FieldValues>(props: ComboboxProps<T>) {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    options: props.options,
    getOptionLabel: (option) => option.title,
    isOptionEqualToValue: (option1, option2) => option1?.id === option2?.id,
    ...props.otherFieldProps,
    value: props.otherFieldProps?.value ?? null,
    onChange: props.onChange
  })

  const ContentLoaded = () => {
    return (
      <>
        {(groupedOptions as typeof props.options).map((option, index) => (
          <li {...getOptionProps({ option, index })} key={option.id}>
            {option.title}
          </li>
        ))}
      </>
    )
  }

  const ContentLoading = () => {
    return (
      <LoadingContainer>
        <Loading size='xl' type='points' />
      </LoadingContainer>
    )
  }

  const Content = (): JSX.Element => {
    if (props.isLoading) return <ContentLoading />
    return <ContentLoaded />
  }

  return (
    <div>
      <div {...getRootProps()}>
        <PostfixedInput
          placeholder='Select collection'
          postfix={<img width={24} height={24} src={bottomArrow} />}
          inputProps={getInputProps()}
        />
      </div>
      {groupedOptions.length > 0 && <Listbox {...getListboxProps()}>
        <Content />
      </Listbox>}
    </div>
  )
}

export interface ControlledComboboxProps<T extends FieldValues> {
  comboboxProps: Omit<ComboboxProps<T>, 'onChange' | 'value'>
  control: Control<T, any>
  name: Path<T>
  rules?: {
    required?: boolean
  }
}

export const ControlledComboBox = <T extends FieldValues>(
  props: ControlledComboboxProps<T>
) => (
  <Controller
    control={props.control}
    name={props.name}
    rules={props.rules}
    render={(p) => (
      <UncontrolledCombobox
        options={props.comboboxProps.options}
        value={p.field.value}
        onChange={(_, data) => p.field.onChange(data)}
        otherFieldProps={p.field}
      />
    )}
  />
  )
