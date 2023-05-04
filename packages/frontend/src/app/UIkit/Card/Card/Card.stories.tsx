import { ComponentMeta, ComponentStory } from '@storybook/react'

import { styled } from '../../../../styles'
import { Card } from './Card'

const story: ComponentMeta<typeof Card> = {
  title: 'UIKit/Card',
  component: Card
}

export default story

const Layout = styled('div', {
  padding: '$3'
})
const Template: ComponentStory<typeof Card> = () => <Card><Layout>A simple card!</Layout></Card>

export const Default = Template.bind({})
