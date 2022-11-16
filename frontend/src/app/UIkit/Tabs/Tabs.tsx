import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { styled } from '../../../styles'
import { textVariant } from '..'
import LinkTab from './LinkTab'
import StyledTabs from './TabsBones'

interface TabProps {
  name: string
  amount?: number
}
const TabWrapper = styled('div', {
  display: 'flex',
  gap: '$1'
})

const TabName = styled('p', {
  ...textVariant('h5').true,
  color: '$blue900'
})

const Amount = styled('p', {
  ...textVariant('h5').true,
  color: '$gray500'
})

const TabContent = (props: TabProps) => (
  <TabWrapper>
    <TabName>{props.name}</TabName>
    {props.amount !== undefined && <Amount>{props.amount}</Amount>}
  </TabWrapper>
)

interface LinkTabProps {
  href: string
  content: JSX.Element
}

const NavigateTab = (props: LinkTabProps) => {
  const navigate = useNavigate()

  return (
    <LinkTab
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        navigate(props.href)
      }}
      icon={props.content}
      {...props}
    />
  )
}

export interface TabsProps {
  tabs: Array<{
    name: string
    url: string
    amount?: number
  }>
}

export default function Tabs(props: TabsProps) {
  const [tab, setTab] = useState<false | number>(false)
  const location = useLocation()
  useEffect(() => {
    const currentTabUrl = location.pathname.split('/').at(-1) ?? ''
    let tabIndex = props.tabs.findIndex((t) =>
      t.url.match(new RegExp(currentTabUrl, 'i'))
    )
    if (tabIndex === -1) {
      tabIndex = 0
    }
    setTab(tabIndex)
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }
  return (
    <StyledTabs value={tab} onChange={handleChange}>
      {props.tabs.map((tab) => {
        return (
          <NavigateTab
            href={tab.url}
            content={<TabContent name={tab.name} amount={tab.amount} />}
            key={tab.name}
          />
        )
      })}
    </StyledTabs>
  )
}
