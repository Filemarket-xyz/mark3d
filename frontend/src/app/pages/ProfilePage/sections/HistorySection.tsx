import React from 'react'
import { styled } from '../../../../styles'
import Badge from '../../../components/Badge/Badge'
import { gradientPlaceholderImg } from '../../../components/Placeholder/GradientPlaceholder'
import { TableBody } from '../../../components/Table/Table'
import {
  ItemBody as RowBody,
  ItemWrapper as RowWrapper,
  RowCell
} from '../../../components/Table/TableRow/TableRow'
import { Button } from '../../../UIkit'
import openLinkIcon from '../img/open-link-icon.svg'

const Wrapper = styled(TableBody, {
  gap: '$2'
})

const ItemShareButton = styled(Button, {
  background: 'transparent',
  width: 20,
  height: 20,
  minWidth: 20,
  maxWidth: 20,
  backgroundImage: `url(${openLinkIcon})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  borderRadius: 0,
  margin: '$3'
})

const RowCellStyled = styled(RowCell, {
  fontSize: '$primary3',
  fontWeight: 600,
  flexShrink: 1
})

export const HistorySection = () => {
  return (
    <Wrapper>
      <RowWrapper
        css={{
          alignItems: 'center',
          boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
          height: 56,
          maxHeight: 56,
          minHeight: 56
        }}
      >
        <RowBody>
          <RowCellStyled css={{ flexGrow: 0.5 }}>Sale</RowCellStyled>
          <RowCellStyled
            css={{ flexGrow: 1.5, flexShrink: 0, width: 'initial' }}
          >
            <Badge
              image={{
                url: gradientPlaceholderImg,
                borderRadius: 'roundedSquare'
              }}
              content={{ title: 'VR glassess by Mark3d', value: 'UnderKong' }}
              small
              valueStyles={{
                css: {
                  fontSize: '$primary3'
                }
              }}
            />
          </RowCellStyled>

          <RowCellStyled title>Underkong</RowCellStyled>
          <RowCellStyled title>0xabcdef</RowCellStyled>

          <RowCellStyled>0.5555</RowCellStyled>
          <RowCellStyled css={{ flexGrow: 2.1 }}>
            Sep 9, 2022 at 06:06 at 06:59
          </RowCellStyled>
        </RowBody>
        <ItemShareButton></ItemShareButton>
      </RowWrapper>
    </Wrapper>
  )
}
