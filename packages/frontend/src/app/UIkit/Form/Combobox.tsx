/* eslint-disable multiline-ternary */
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled'
import { AutocompleteChangeReason } from '@mui/material'
import { Loading } from '@nextui-org/react'
import * as React from 'react'
import { ReactNode } from 'react'
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'

import { styled } from '../../../styles'
import bottomArrow from './img/arrow-bottom.svg'
import choosenImg from './img/Choosen.svg'
import PostfixedInput from './PostfixedInput'

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
  boxShadow: '0px 4px 15px rgba(35, 37, 40, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  paddingTB: '8px',
  gap: '4px',
  '& li': {
    color: '$blue900',
    backgroundColor: '$white',
    padding: 'calc($3 - $1)',
  },
  '& li.Mui-focused': {
    backgroundColor: '#4a8df6',
    color: 'white',
    cursor: 'pointer',
  },
  '& li:active': {
    backgroundColor: '#2977f5',
    color: 'white',
  },
  variants: {
    size: {
      md: {
        maxWidth: '285px',
        '@md': {
          maxWidth: '266px',
        },
        '@sm': {
          maxWidth: '100%',
        },
      },
    },
  },
})

const ContentContainer = styled('div', {
  padding: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  variants: {
    choosen: {
      true: {
        background: '#F4F4F4',
        borderRadius: '8px',
        color: '$gray800',
      },
    },
  },
})

const LoadingContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$4',
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
  onEnter?: (value?: string) => void
  otherFieldProps?: ControllerRenderProps<T, Path<T>>
  isLoading?: boolean
  placeholder?: string
  isDisabled?: boolean
  rightContent?: ReactNode
  onClickRightContent?: (value?: string) => void
  onFocus?: (event: React.SyntheticEvent<Element, Event>) => void
  onChangeDop?: (value: string) => void
  size?: 'md'
}

function UncontrolledCombobox<T extends FieldValues>(props: ComboboxProps<T>) {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue,
  } = useAutocomplete({
    options: props.options,
    autoComplete: true,
    clearOnBlur: true,
    clearOnEscape: true,
    getOptionLabel: (option) => option.title,
    isOptionEqualToValue: (option1, option2) => option1?.id === option2?.id,
    ...props.otherFieldProps,
    value: props.otherFieldProps?.value ?? null,
    onChange: props.onChange,
    onOpen: props.onFocus,
    readOnly: props.isDisabled,
  })

  const ContentLoaded = () => {
    return (
      <>
        {(groupedOptions as typeof props.options).map((option, index) => (
          <li
            {...getOptionProps({ option, index })}
            key={option.id}
            style={{ color: '#0090FF', fontSize: '14px', fontWeight: '500', background: 'white', padding: '0 8px' }}
          >
            <ContentContainer choosen={option.title === inputValue}>
              {option.title}
              {option.title === inputValue && <img src={choosenImg} />}
            </ContentContainer>
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (inputValue && inputValue.length <= 35) {
        props.onEnter?.(inputValue as string)
        // @ts-expect-error
        event.target.blur()

        props.onChangeDop?.('')

        return false
      }
    }
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      props.onChangeDop?.(inputValue as string)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    props.onClickRightContent?.(inputValue as string)
    // @ts-expect-error
    event.target.focus()

    return false
  }

  return (
    <div>
      <div {...getRootProps()}>
        <PostfixedInput
          postfix={props.rightContent ?? <img width={24} height={24} src={bottomArrow} />}
          inputProps={{
            placeholder: props.placeholder ?? 'Select collection',
            ...getInputProps(),
            onKeyDown: handleKeyDown,
            onKeyUp: handleKeyUp,
          }}
          postfixProps={{
            onClick: (event: React.MouseEvent<HTMLInputElement>) => {
              handleClick(event)
              getInputProps().onMouseDown?.(event)
            },
          }}
        />
      </div>
      {groupedOptions?.length > 0 && (
        <Listbox {...getListboxProps()} size={props.size}>
          <Content />
        </Listbox>
      )}
    </div>
  )
}

export interface ControlledComboboxProps<T extends FieldValues> {
  comboboxProps: Omit<ComboboxProps<T>, 'onChange' | 'value'>
  control: Control<T, any>
  name: Path<T>
  placeholder?: string
  rules?: {
    required?: boolean
  }
  onEnter?: (value?: string) => void
  isDisabled?: boolean
  rightContent?: ReactNode
  onClickRightContent?: (value?: string) => void
  onFocus?: (event: React.SyntheticEvent<Element, Event>) => void
  onChange?: (value: string) => void
  size?: 'md'
}

export const ControlledComboBox = <T extends FieldValues>(
  props: ControlledComboboxProps<T>,
) => (
  <Controller
    control={props.control}
    name={props.name}
    rules={props.rules}
    render={(p) => (
      <UncontrolledCombobox
        options={props.comboboxProps.options}
        value={p.field.value}
        otherFieldProps={p.field}
        placeholder={props.placeholder}
        isDisabled={props.isDisabled}
        rightContent={props.rightContent}
        size={props.size}
        onChange={(_, data) => p.field.onChange(data)}
        onEnter={props.onEnter}
        onClickRightContent={props.onClickRightContent}
        onFocus={props.onFocus}
        onChangeDop={props.onChange}
      />
    )}
  />
)
