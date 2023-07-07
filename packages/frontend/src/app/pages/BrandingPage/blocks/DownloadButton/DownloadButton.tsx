import { styled } from '@stitches/react'

import DownloadIconSrc from '../../../../../assets/img/BrandingPage/download-icon.svg'
import { LinkButton, Txt } from '../../../../UIkit'

interface DownloadButtonProps {
  children: string
  downloadHref: string
  bigIcon?: boolean
}

const DownloadButtonIcon = styled('img', {
  marginRight: '8px',
  variants: {
    iconSize: {
      default: {
        width: '20px',
        height: '20px',
      },
      big: {
        width: '24px',
        height: '24px',
      },
    },
  },
})

export default function DownloadButton (props: DownloadButtonProps) {
  return (
    <LinkButton
      whiteWithBlue
      style={{ columnGap: '8px' }}
      href={props.downloadHref}
      download
    >
      <Txt body2 css={{ fontWeight: '$primary' }}>{props.children}</Txt>
      <DownloadButtonIcon src={DownloadIconSrc} iconSize={props.bigIcon ? 'big' : 'default'} />
    </LinkButton>
  )
}
