import { styled, theme } from '../../../styles'

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
export const textVariant = (token: keyof typeof theme['fontSizes']) => ({
  true: {
    fontSize: `$${token}`,
    fontWeight: `$${token.slice(0, -1)}`,
    lineHeight: `$${token}`,
    fontFamily: `$${token.slice(0, -1)}`
  }
})

// На слове Text подсказки ide плохо работают, поэтому убрали букву e.
export const Txt = styled('span', {
  color: 'inherit',
  variants: {
    // Явное перечисление вариантов,
    // чтобы тайпскрипт выводил их в подсказках
    h1: textVariant('h1'),
    h2: textVariant('h2'),
    h3: textVariant('h3'),
    h4: textVariant('h4'),
    h5: textVariant('h5'),

    body1: textVariant('body1'),
    body2: textVariant('body2'),
    body3: textVariant('body3'),
    body4: textVariant('body4'),

    button1: textVariant('button1'),

    primary1: textVariant('primary1'),
    primary2: textVariant('primary2'),
    primary3: textVariant('primary3'),

    secondary1: textVariant('secondary1'),
    secondary2: textVariant('secondary2'),
    secondary3: textVariant('secondary3'),

    ternary1: textVariant('ternary1'),
    ternary2: textVariant('ternary2'),
    ternary3: textVariant('ternary3')
  }
})
