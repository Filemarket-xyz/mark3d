import { ComponentMeta, ComponentStory } from '@storybook/react'
import { NavBar } from './NavBar'
import { NavBarItem } from './NavBarItem'
import { BrowserRouter } from 'react-router-dom'

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
          items={
            <>
              <NavBarItem to="/home">
                Home
              </NavBarItem>
              <NavBarItem to="/house">
                House
              </NavBarItem>
            </>
          }
        />
      </div>
    </BrowserRouter>
  )
}

export const Default = Template.bind({})
