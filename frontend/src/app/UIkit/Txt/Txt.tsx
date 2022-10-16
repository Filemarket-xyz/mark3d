import { styled } from '../../../styles'

/**
 * works under condition, that config looks like this:
 *
 * ```typescript
 * createStitches({
 *     fontSizes: {
 *       h1: '3rem',
 *       h2: '2.5rem',
 *       // ... other variants
 *     },
 *
 *     fontWeights: {
 *       h: 700
 *       // ...
 *     },
 *
 *     lineHeights: {
 *       h1: 1.1666,
 *       h2: 1.26,
 *       // ...
 *     }
 * })
 * ```
 */
const variant = (token: string) => ({
  true: {
    fontSize: `$${token}`,
    fontWeight: `$${token.slice(0, -1)}`,
    lineHeight: `$${token}`
  }
})

// На слове Text подсказки ide плохо работают, поэтому убрали букву e.
export const Txt = styled('span', {
  color: 'inherit',
  variants: {
    // Явное перечисление вариантов,
    // чтобы тайпскрипт выводил их в подсказках
    h1: variant('h1'),
    h2: variant('h2'),
    h3: variant('h3'),
    h4: variant('h4'),
    h5: variant('h5'),

    body1: variant('body1'),
    body2: variant('body2'),
    body3: variant('body3'),
    body4: variant('body4'),

    button1: variant('button1'),

    primary1: variant('primary1'),
    primary2: variant('primary2'),
    primary3: variant('primary3'),

    secondary1: variant('secondary1'),
    secondary2: variant('secondary2'),
    secondary3: variant('secondary3')
  },
  defaultVariants: {
    body1: true
  }
})
