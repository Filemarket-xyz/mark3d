import { ComponentMeta, ComponentStory } from '@storybook/react'

import Plus from '../../../../assets/icons/Plus.svg'
import BearJedi from '../../../../assets/img/BearJedi.jpg'
import Logo from '../../../../assets/Logo.png'
import { StitchesProvider } from '../../../../styles'
import { Button } from './Button'

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

const Mark3d = () => <img src={Logo} alt="logo" />

const IconTemplate: ComponentStory<typeof Button> = ({ children, ...props }) => {
  const pressHandler = () => {
    alert('button clicked!')
  }
  return (
    <StitchesProvider>
      <div style={{ marginBottom: 20 }}>
        <Button {...props} onPress={pressHandler}>
          {children}
        </Button>
      </div>
      <div>
        <Button {...props} isDisabled={true}>
          {children}
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
  children: <Mark3d />,
  icon: true
}

export const IconSmall = IconTemplate.bind({})
IconSmall.args = {
  children: <Mark3d />,
  icon: true,
  small: true
}

export const IconPrimary = IconTemplate.bind({})
IconPrimary.args = {
  children: <img src={Plus} alt="plus" />,
  icon: true,
  primary: true
}

export const IconPrimarySmall = IconTemplate.bind({})
IconPrimarySmall.args = {
  children: <img src={Plus} alt="plus" />,
  icon: true,
  primary: true,
  small: true
}

export const IconCover = IconTemplate.bind({})
IconCover.args = {
  children: <img src={BearJedi} alt="plus" />,
  icon: true,
  primary: true,
  iconCover: true
}
