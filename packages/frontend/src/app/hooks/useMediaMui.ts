import { useMediaQuery } from '@mui/material'

interface adaptiveType {
  sm?: string
  md?: string
  lg?: string
  xl?: string
  defaultValue: string
}

export function useMediaMui() {
  const smValue = useMediaQuery('(max-width:600px)')
  const mdValue = useMediaQuery('(max-width:900px)')
  const lgValue = useMediaQuery('(max-width:1200px)')
  const xlValue = useMediaQuery('(max-width:1536px)')

  const adaptive = ({ sm, xl, md, lg, defaultValue }: adaptiveType): string => {
    console.log(`sm:${sm} md:${md} lg:${lg} xl:${xl}`)
    if (smValue && sm) {
      return sm
    }
    if (mdValue && md) {
      return md
    }
    if (lgValue && lg) {
      return lg
    }
    if (xlValue && xl) {
      return xl
    }
    return defaultValue
  }

  return { smValue, mdValue, lgValue, xlValue, adaptive }
}
