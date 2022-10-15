import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Button } from './Button'

const story: ComponentMeta<typeof Button> = {
  component: Button,
  title: 'UIKit/Button'
}
export default story

const Template: ComponentStory<typeof Button> = (props) => <Button {...props}>Button</Button>

export const Default = Template.bind({})
