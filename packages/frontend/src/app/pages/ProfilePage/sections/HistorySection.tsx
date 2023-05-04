import { observer } from 'mobx-react-lite'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { styled } from '../../../../styles'
import Plug from '../../../components/Plug/Plug'
import { ITableColumn } from '../../../components/Table/TableBuilder'
import { useTransfersHistory } from '../../../hooks/useTransfersHistory'
import { Button, NavButton, Txt } from '../../../UIkit'
import { Params } from '../../../utils/router/Params'
import { TableBody } from '../../ExplorerPage/components/Table/Table'
import { RowCell } from '../../ExplorerPage/components/TableRow/TableRow'
import openLinkIcon from '../img/open-link-icon.svg'
import { HistoryTableBuilder } from './HistoryTableBuilder'

export const Wrapper = styled(TableBody, {
  gap: '$2',
  paddingTop: 28,
  paddingBottom: '$3'
})

export const ItemShareButton = styled(NavButton, {
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

export const RowCellStyled = styled(RowCell, {
  fontSize: '$primary3',
  fontWeight: 600,
  flexShrink: 1,
  variants: {
    title: {
      true: {
        fontSize: '$primary3'
      }
    }
  }
})

const cols: ITableColumn[] = [
  { name: 'Event', hide: false },
  { name: 'Object', hide: false },
  { name: 'From', hide: 'md' },
  { name: 'To', hide: 'md' },
  { name: 'Price', hide: 'sm' },
  { name: 'Date', hide: 'lg' }
]

export const EmptyTablePlaceholder = styled('div', {
  flex: 'center',
  justifyContent: 'center',
  color: '$gray500',
  paddingBottom: '$3'
})

export const HistorySection = observer(() => {
  const { profileAddress } = useParams<Params>()
  const { tableRows, isLoading } = useTransfersHistory(profileAddress)
  const navigate = useNavigate()
  const historyTableBuilder = new HistoryTableBuilder(cols, tableRows)

  return (
    <>
      {isLoading ? (
        <EmptyTablePlaceholder>Loading</EmptyTablePlaceholder>
      ) : tableRows.length ? (
        <Wrapper>{historyTableBuilder.renderRows()}</Wrapper>
      ) : (
        <Plug header={'You don`t have any NFTs '}
              mainText={'Create your own NFT or go to the market to find something amazing'}
              buttonsBlock={<>
                <Button primary onClick={() => { navigate('/market') }}>
                  <Txt primary1>3D Market</Txt></Button>
                <Button primary onClick={() => { navigate('/create') }}>
                  <Txt primary1>Create</Txt></Button></>}
        />
      )}
    </>
  )
})
