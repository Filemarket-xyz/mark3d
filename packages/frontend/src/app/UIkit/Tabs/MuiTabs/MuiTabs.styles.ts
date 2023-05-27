import { styled, Tabs } from '@mui/material'

export const StyledMuiTabs = styled(Tabs)({
  'span.MuiTabs-indicator': {
    height: '4px !important',
    background: 'linear-gradient(90deg, #38BCC9 0%, #088DFA 100%)',
  },
  'button.MuiTab-root': {
    fontFamily: 'Sora',
    fontWeight: 700,
    textTransform: 'initial',
    fontSize: '1.25rem',
  },
})
