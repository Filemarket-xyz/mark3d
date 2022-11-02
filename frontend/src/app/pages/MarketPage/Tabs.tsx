import { Tabs as MUITabs, Tab } from '@mui/material'
import React, { useState } from 'react'
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

export default function TabsUnstyled() {
  const [tab, setTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }
  return (
    <MUITabs
      value={tab}
      onChange={handleChange}
      scrollButtons={true}
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
      <Tab icon={<TabContent name='NFTs' amount={123456} />} />
      <Tab icon={<TabContent name='Collections' amount={1234} />} />
      <Tab icon={<TabContent name='Creators' amount={123} />} />
      <Tab icon={<TabContent name='Namespaces' amount={123} />} />
    </MUITabs>
  )
}
