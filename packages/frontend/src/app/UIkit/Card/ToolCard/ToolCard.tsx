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
  background: '$blue300',
  backdropFilter: 'blur(4px)',
  borderRadius: '$2',
  position: 'relative',
  overflow: 'hidden',
})
