import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useRef } from 'react'
import { Drip } from './Drip'
import { useDrip } from './Drip.hooks'

const story: ComponentMeta<typeof Drip> = {
  title: 'Core/Drip',
  component: Drip
}
export default story

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Drip> = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { onClick: onDripClickHandler, ...dripBindings } = useDrip(ref, false)
  return (
    <div style={{ width: 150, height: 60, backgroundColor: '#7D9EFF' }} ref={ref} onClick={onDripClickHandler}>
      <Drip {...dripBindings} color="white"/>
    </div>
  )
}

export const Default = Template.bind({})
