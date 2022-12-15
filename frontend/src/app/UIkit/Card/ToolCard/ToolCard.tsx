import { styled } from '../../../../styles'
import { Card } from '../Card'

/**
 * Used to display tools on the main page. Might be used with or without gradient border.
 * Anatomy (ToolCardGradientBorder might be omitted):
 * ```react
 *  <ToolCard>
 *    <ToolCardGradientBorder>
 *      {content}
 *    </ToolCardGradientBorder>
 *  </ToolCard>
 * ```
 */

export const ToolCard = styled(Card, {
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(45px)',
  borderRadius: '$4',
  position: 'relative',
  overflow: 'hidden'
})
