import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Link } from './Link'

const story: ComponentMeta<typeof Link> = {
  title: 'UIKit/Link',
  component: Link
}

export default story

const Template: ComponentStory<typeof Link> = (props) => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Link {...props}>Click me!</Link>
    </div>
  </>
)

export const Default = Template.bind({})
