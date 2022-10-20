import Table from '../../components/Table/Table'
import { styled } from '../../../styles'

const PageStyled = styled('section', {
  backgroundColor: '$gray100',
  minHeight: '100%'
})
export default function ExplorerPage () {
  return (
    <PageStyled>
      <Table/>
    </PageStyled>
  )
}
