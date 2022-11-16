import { styled } from '../../../styles'
import { PageLayout } from '../../UIkit/PageLayout'
import Tabs from './Tabs'
import { Outlet } from 'react-router'

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

export default function MarketPage() {
  return (
    <PageLayout>
      <TabsContainer>
        <Tabs />
      </TabsContainer>
      <Outlet />
    </PageLayout>
  )
}
