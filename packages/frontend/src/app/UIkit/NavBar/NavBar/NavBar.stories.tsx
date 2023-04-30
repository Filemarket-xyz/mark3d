import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { NavBar } from './NavBar'

const story: ComponentMeta<typeof NavBar> = {
  title: 'UIKit/NavBar',
  component: NavBar
}
export default story

const Template: ComponentStory<typeof NavBar> = () => {
  return (
    <BrowserRouter>
      <div style={{ width: 'calc(100% + 40px)', height: '400px', backgroundColor: 'lightgray', margin: '-20px' }}>
        <NavBar
          items={[
            {
              to: '/home',
              label: 'Home'
            },
            {
              to: '/house',
              label: 'House'
            }
          ]}
        />
      </div>
    </BrowserRouter>
  )
}

export const Default = Template.bind({})
