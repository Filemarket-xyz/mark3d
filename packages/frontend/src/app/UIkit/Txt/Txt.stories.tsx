import { ComponentMeta, ComponentStory } from '@storybook/react'

import { StitchesProvider } from '../../../styles'
import { Txt } from './Txt'

const story: ComponentMeta<typeof Txt> = {
  component: Txt,
  title: 'UIKit/Text'
}
export default story

const Template: ComponentStory<typeof Txt> = () => (
  <StitchesProvider>
    <Txt as="div" h1>Header H1</Txt>
    <Txt as="div" h2>Header H2</Txt>
    <Txt as="div" h3>Header H3</Txt>
    <Txt as="div" h4>Header H4</Txt>
    <Txt as="div" h5>Header H5</Txt>

    <Txt as="div" body1>Body text 1</Txt>
    <Txt as="div" body2>Body text 2</Txt>
    <Txt as="div" body3>Body text 3</Txt>
    <Txt as="div" body4>Body text 4</Txt>

    <Txt as="div" button1>Button text 1</Txt>

    <Txt as="div" primary1>Primary text 1</Txt>
    <Txt as="div" primary2>Primary text 2</Txt>
    <Txt as="div" primary3>Primary text 3</Txt>

    <Txt as="div" secondary1>Secondary text 1</Txt>
    <Txt as="div" secondary2>Secondary text 2</Txt>
    <Txt as="div" secondary3>Secondary text 3</Txt>
  </StitchesProvider>
)

export const All = Template.bind({})
