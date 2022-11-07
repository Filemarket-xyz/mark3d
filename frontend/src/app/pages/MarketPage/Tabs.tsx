import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'
import LinkTab from '../../UIkit/Tabs/LinkTab'
import StyledTabs from '../../UIkit/Tabs/Tabs'

interface TabProps {
  name: string
  amount: number
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
    <Amount>{props.amount}</Amount>
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

enum TABS {
  'nfts',
  'collections',
  'creators',
  'namespaces'
}

export default function Tabs() {
  const [tab, setTab] = useState<false | number>(false)
  const location = useLocation()
  useEffect(() => {
    setTab(
      TABS[location.pathname.split('/').at(-1) as keyof typeof TABS] ??
        TABS.nfts
    )
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }
  return (
    <StyledTabs value={tab} onChange={handleChange}>
      <NavigateTab
        href={'/market/nfts'}
        content={<TabContent name='NFTs' amount={123456} />}
      />
      <NavigateTab
        href={'/market/collections'}
        content={<TabContent name='Collections' amount={1234} />}
      />
      <NavigateTab
        href={'/market/creators'}
        content={<TabContent name='Creators' amount={123} />}
      />
      <NavigateTab
        href={'/market/namespaces'}
        content={<TabContent name='Namespaces' amount={123} />}
      />
    </StyledTabs>
  )
}
