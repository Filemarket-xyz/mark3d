import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Button } from './Button'
import { StitchesProvider } from '../../../../styles'
import Logo from '../../../../assets/Logo.png'

const story: ComponentMeta<typeof Button> = {
  component: Button,
  title: 'UIKit/Button'
}
export default story

const Template: ComponentStory<typeof Button> = (props) => {
  const pressHandler = () => {
    alert('button clicked!')
  }
  return (
    <StitchesProvider>
      <div style={{ marginBottom: 20 }}>
        <Button {...props} onPress={pressHandler}>Button</Button>
      </div>
      <div>
        <Button {...props} isDisabled={true}>Disabled</Button>
      </div>
    </StitchesProvider>
  )
}

const IconTemplate: ComponentStory<typeof Button> = (props) => {
  const pressHandler = () => {
    alert('button clicked!')
  }
  return (
    <StitchesProvider>
      <div style={{ marginBottom: 20 }}>
        <Button {...props} onPress={pressHandler}>
          <img src={Logo} alt="logo"/>
        </Button>
      </div>
      <div>
        <Button {...props} isDisabled={true}>
          <img src={Logo} alt="logo"/>
        </Button>
      </div>
    </StitchesProvider>
  )
}

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

export const Icon = IconTemplate.bind({})
Icon.args = {
  icon: true
}

export const IconSmall = IconTemplate.bind({})
IconSmall.args = {
  icon: true,
  small: true
}
