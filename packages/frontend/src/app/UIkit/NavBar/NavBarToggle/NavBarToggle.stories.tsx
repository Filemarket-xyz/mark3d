import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import { NavBarToggle } from './NavBarToggle'

const story: ComponentMeta<typeof NavBarToggle> = {
  component: NavBarToggle,
  title: 'UIKit/NavBarToggle',
}

export default story

const Template: ComponentStory<typeof NavBarToggle> = () => {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <b style={{ marginRight: '8px' }}>isSelected:</b>
        {JSON.stringify(isSelected)}
      </div>
      <NavBarToggle
        isSelected={isSelected}
        onChange={setIsSelected}
      />
    </>
  )
}

export const Default = Template.bind({})
