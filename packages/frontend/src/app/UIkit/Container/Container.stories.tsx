import { ComponentMeta } from '@storybook/react'

import { Container } from './Container'

const story: ComponentMeta<typeof Container> = {
  component: Container,
  title: 'UIKit/Container'
}

export default story

const Template = () => (
  <Container>
    <div
      style={{
        width: '100%',
        height: '400px',
        backgroundColor: 'lightblue'
      }}
    >
    </div>
  </Container>
)

export const Default = Template.bind({})
