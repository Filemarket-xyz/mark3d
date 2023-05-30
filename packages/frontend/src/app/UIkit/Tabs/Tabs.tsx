import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Flex } from '../Flex'
import { MuiTabs } from './MuiTabs'
import { StyledTab, StyledTabAmount, StyledTabName } from './Tabs.styles'

export interface TabItem {
  name: string
  url: string
  amount?: number
}

export interface TabsProps {
  tabs: TabItem[]
  textAlign?: 'left'
}

export const Tabs: React.FC<TabsProps> = ({ tabs, textAlign }) => {
  const [tab, setTab] = useState<false | number>(false)
  const location = useLocation()
  const navigate = useNavigate()

  const onChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  useEffect(() => {
    const currentTabUrl = location?.pathname?.split('/')?.at(-1) ?? ''
    let tabIndex = tabs.findIndex((t) =>
      t.url.match(new RegExp(currentTabUrl, 'i')),
    )
    if (tabIndex === -1) {
      tabIndex = 0
    }
    setTab(tabIndex)
  }, [])

  return (
    <MuiTabs value={tab} onChange={onChange}>
      {tabs.map((tab) => (
        <StyledTab
          key={tab.name}
          LinkComponent={'a'}
          sx={{
            paddingLeft: textAlign === 'left' ? 0 : undefined,
          }}
          icon={(
            <Flex gap='$1' justifyContent='start'>
              <StyledTabName>{tab.name}</StyledTabName>
              {tab.amount && <StyledTabAmount>{tab.amount}</StyledTabAmount>}
            </Flex>
          )}
          onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.preventDefault()
            navigate(tab.url)
          }}
        />
      ))}
    </MuiTabs>
  )
}
