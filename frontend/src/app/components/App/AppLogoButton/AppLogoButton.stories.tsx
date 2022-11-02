import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AppLogoButton } from './AppLogoButton'
import { BrowserRouter } from 'react-router-dom'

const story: ComponentMeta<typeof AppLogoButton> = {
  component: AppLogoButton,
  title: 'App/AppLogoButton'
}

export default story

const Template: ComponentStory<typeof AppLogoButton> = () => (
  <BrowserRouter>
    <AppLogoButton to={'/'}/>
  </BrowserRouter>
)

export const Default = Template.bind({})
