import { FC, forwardRef } from 'react'
import { AriaButtonProps } from 'react-aria'

import { styled } from '../../../../styles'
import { Card, Drip, Txt, useButton } from '../../../UIkit'
import downloadIcon from './img/Download.svg'
import downloadDisabled from './img/DownloadDisabled.svg'

export type FileButtonProps = AriaButtonProps & {
  name?: string
  caption?: string
}

const CardStyled = styled(Card, {
  width: 368,
  '@md': {
    width: '100%'
  },
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  transition: 'box-shadow 0.25s ease 0s',
  '&[data-pressed=true]': {
    boxShadow: '$hover'
  },
  '&[data-hovered=true]': {
    boxShadow: '$hover'
  },
  '&[data-disabled=true]': {
    cursor: 'not-allowed'
  }
})

const ContentStyled = styled('div', {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: '$2',
  padding: '$2 $3',
  transition: 'opacity 0.25s ease 0s',
  '&[data-pressed=true]': {
    opacity: 0.7
  },
  '&[data-hovered=true]': {
    opacity: 0.7
  }
})

const DownloadIconStyled = styled('img', {
  width: 48,
  height: 48,
  display: 'block',
  flexShrink: 0
})

const DownloadInfoStyled = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  flexGrow: 1,
  gap: 4
})

const NameStyled = styled('div', {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  color: '$gray800',
  width: '278px',
  textOverflow: 'ellipsis',
  variants: {
    disabled: {
      true: {
        color: '$gray400'
      }
    }
  }
})

const DownloadTextStyled = styled('div', {
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: '$blue500',
  variants: {
    disabled: {
      true: {
        color: '$gray400'
      }
    }
  }
})

export const FileButton: FC<FileButtonProps> = forwardRef<HTMLDivElement, FileButtonProps>(({
  name,
  caption,
  isDisabled,
  ...props
}, ref) => {
  const { buttonRef, buttonProps, dripProps } = useButton({ isDisabled, ...props }, ref)
  return (
    <CardStyled
      {...buttonProps}
      ref={buttonRef}
    >
      <ContentStyled
        {...buttonProps}
      >
        {isDisabled ? (
          <DownloadIconStyled
            src={downloadDisabled}
            alt="download"
          />
        ) : (
          <DownloadIconStyled
            src={downloadIcon}
            alt="download"
          />
        )}
        <DownloadInfoStyled>
          <NameStyled disabled={isDisabled}>
            <Txt primary1>{name}</Txt>
          </NameStyled>
          <DownloadTextStyled disabled={isDisabled}>
            {caption}
          </DownloadTextStyled>
        </DownloadInfoStyled>
      </ContentStyled>
      <Drip {...dripProps} color='white' />
    </CardStyled>
  )
})
