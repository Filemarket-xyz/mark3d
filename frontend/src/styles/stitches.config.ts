import { createStitches } from '@stitches/react'

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config
} = createStitches({
  theme: {
    colors: {
      blue300: '#00DCFF', // Color: Sky Blue Crayola
      blue400: '#94bde6', // From the squares
      blue500: '#66A0DB', // Color: Little Boy Blue
      blue600: '#655BE5', // Color: Slate Blue
      blue700: '#4160ED', // Color: Ultramarine Blue
      blue900: '#13132D', // Color: Space Cadet

      purple: '#AF29FF', // Color: Electric Purple
      magenta: '#E14BEC', // Color: Magenta
      pink: '#F4CFF3', // Color: Pink Lace

      black: '#1A1A1A', // Color: Eerie Black

      gray100: '#F9F9F9',
      gray200: '#F3F3F4',
      gray300: '#d0d0d5',
      gray400: '#a1a1ab',
      gray500: '#59596C',

      green: '#00FF0A',

      red: '#D81B60',

      gradient0: '$blue300',
      gradient1: '$magenta'
    },

    space: {
      1: '4px', // на мобилках
      2: '8px',
      3: '16px', // самый ходовой
      4: '32px',
      5: '40px'
    },

    // rem = 16px
    fontSizes: {
      h1: '3rem', // 48px
      h2: '2.5rem', // 40px
      h3: '2rem', // 32px
      h4: '1.5625rem', // 25px
      h5: '1.25rem', // 20px

      body1: '1.5rem', // 24px
      body2: '1.25rem', // 20px
      body3: '1.125rem', // 18px
      body4: '1rem', // 16px

      button: '1rem', // 16px

      primary1: '1rem', // 16px
      primary2: '0.875rem', // 14px
      primary3: '0.75rem', // 12px

      secondary1: '1rem', // 16px
      secondary2: '0.875rem', // 14px
      secondary3: '0.75rem' // 12px
    },

    fontWeights: {
      header: 700,
      body: 400,
      button: 600,
      primary: 600,
      secondary: 400
    },

    lineHeights: {
      h1: 1.1666,
      h2: 1.26,
      h3: 1.26,
      h4: 1.26,
      h5: 1.2,

      body1: 1.333,
      body2: 1.219, // 20px
      body3: 1.2777, // 18px
      body4: 1.21875, // 16px

      button: 1.5, // 16px

      primary1: 1.25, // 16px
      primary2: 1.4285714, // 14px
      primary3: 1.333, // 12px

      secondary1: 1.21, // 16px
      secondary2: 1.2857143, // 14px
      secondary3: 1.333333 // 12px
    },

    radii: {
      1: '8px',
      2: '12px',
      3: '16px',
      4: '32px'
    }
  },

  media: {
    sm: '(max-width: 600px)',
    md: '(max-width: 900px)',
    lg: '(max-width: 1200px)',
    xl: '(max-width: 1536px)'
  }
})
