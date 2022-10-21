import { ComponentMeta, ComponentStory } from '@storybook/react'
import { NavBar } from './NavBar'

const story: ComponentMeta<typeof NavBar> = {
  title: 'UIKit/NavBar',
  component: NavBar
}
export default story

const Template: ComponentStory<typeof NavBar> = () => {
  return (
    <div style={{ width: 'calc(100% + 40px)', height: '400px', backgroundColor: 'lightgray', margin: '-20px' }}>
      <NavBar/>
    </div>
  )
}

export const Default = Template.bind({})
