import { FC, forwardRef, ReactNode } from 'react'
import { AriaButtonProps } from 'react-aria'

import { styled } from '../../../../styles'
import { Card, Drip, Txt, useButton } from '../../../UIkit'
import downloadIcon from './img/Download.svg'
import downloadDisabled from './img/DownloadDisabled.svg'

export type FileButtonProps = AriaButtonProps & {
  name?: string
  caption?: ReactNode
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
  gap: '10px',
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
  width: 44,
  height: 44,
  display: 'block',
  flexShrink: 0
})

const DownloadInfoStyled = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  flexGrow: 1,
  fontWeight: '600'
})

const NameStyled = styled('div', {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  color: '$blue500',
  width: '278px',
  textOverflow: 'ellipsis',
  '@smx': {
    '& span': {
      fontSize: '14px'
    }
  },
  variants: {
    isDisabled: {
      true: {
        color: '$gray600'
      }
    }
  }
})

const DownloadTextStyled = styled('div', {
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: '$gray400',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  gap: '$2',
  '@smx': {
    fontSize: '12px'
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
          <NameStyled isDisabled={isDisabled}>
            <Txt primary1>{name}</Txt>
          </NameStyled>
          <DownloadTextStyled>
            {caption}
          </DownloadTextStyled>
        </DownloadInfoStyled>
      </ContentStyled>
      <Drip {...dripProps} color='white' />
    </CardStyled>
  )
})
