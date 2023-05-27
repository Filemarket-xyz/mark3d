import { Skeleton } from '@mui/material'

export interface CardsPlaceholderProps {
  cardsAmount: number
}

export const CardsPlaceholder = ({ cardsAmount }: CardsPlaceholderProps) => (
  <>
    {new Array<number>(cardsAmount).fill(0).map((_, i) => (
      <Skeleton
        key={i}
        sx={{ borderRadius: '16px' }}
        variant='rectangular'
        width={259}
        height={324}
      />
    ))}
  </>
)
