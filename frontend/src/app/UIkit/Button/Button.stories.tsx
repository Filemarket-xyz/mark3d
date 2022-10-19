import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Button } from './Button'
import { StitchesProvider } from '../../../styles'

const story: ComponentMeta<typeof Button> = {
  component: Button,
  title: 'UIKit/Button'
}
export default story

const Template: ComponentStory<typeof Button> = (props) => (
  <StitchesProvider>
    <div style={{ marginBottom: 20 }}>
      <Button {...props}>Button</Button>
    </div>
    <div>
      <Button {...props} isDisabled={true}>Disabled</Button>
    </div>
  </StitchesProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  primary: true
}

export const Secondary = Template.bind({})
Secondary.args = {
  secondary: true
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  tertiary: true
}
