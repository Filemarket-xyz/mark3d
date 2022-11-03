import { Tabs as MUITabs, Tab } from '@mui/material'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'

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

const LinkTab = (props: LinkTabProps) => {
  const navigate = useNavigate()

  return (
    <Tab
      sx={{ textTransform: 'none' }}
      LinkComponent={'a'}
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        navigate(props.href)
      }}
      icon={props.content}
      {...props}
    />
  )
}

export default function Tabs() {
  const [tab, setTab] = useState(0)
  const location = useLocation()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }
  return (
    <MUITabs
      value={tab}
      onChange={handleChange}
      scrollButtons
      variant={'scrollable'}
      allowScrollButtonsMobile
      sx={{
        'span.MuiTabs-indicator': {
          height: '4px !important',
          background: 'linear-gradient(270deg, #00DCFF 0%, #E14BEC 85.65%)'
        },
        'button.MuiTab-root': {
          fontFamily: 'Sora',
          fontWeight: 700,
          textTransform: 'initial',
          fontSize: '1.25rem'
        }
      }}
    >
      <LinkTab
        href={`${location.pathname}/nfts`}
        content={<TabContent name='NFTs' amount={123456} />}
      />
      <LinkTab
        href={`${location.pathname}/collections`}
        content={<TabContent name='Collections' amount={1234} />}
      />
      <LinkTab
        href={`${location.pathname}/creators`}
        content={<TabContent name='Creators' amount={123} />}
      />
      <LinkTab
        href={`${location.pathname}/namespaces`}
        content={<TabContent name='Namespaces' amount={123} />}
      />
    </MUITabs>
  )
}
