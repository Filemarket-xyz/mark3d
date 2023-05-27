import { ComponentMeta, ComponentStory } from '@storybook/react'

import { StitchesProvider } from '../../../styles'
import { Txt } from './Txt'

const story: ComponentMeta<typeof Txt> = {
  component: Txt,
  title: 'UIKit/Text',
}
export default story

const Template: ComponentStory<typeof Txt> = () => (
  <StitchesProvider>
    <Txt h1 as="div">Header H1</Txt>
    <Txt h2 as="div">Header H2</Txt>
    <Txt h3 as="div">Header H3</Txt>
    <Txt h4 as="div">Header H4</Txt>
    <Txt h5 as="div">Header H5</Txt>

    <Txt body1 as="div">Body text 1</Txt>
    <Txt body2 as="div">Body text 2</Txt>
    <Txt body3 as="div">Body text 3</Txt>
    <Txt body4 as="div">Body text 4</Txt>

    <Txt button1 as="div">Button text 1</Txt>

    <Txt primary1 as="div">Primary text 1</Txt>
    <Txt primary2 as="div">Primary text 2</Txt>
    <Txt primary3 as="div">Primary text 3</Txt>

    <Txt secondary1 as="div">Secondary text 1</Txt>
    <Txt secondary2 as="div">Secondary text 2</Txt>
    <Txt secondary3 as="div">Secondary text 3</Txt>
  </StitchesProvider>
)

export const All = Template.bind({})
