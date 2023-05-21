import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import Tag, { BlueText, TagOptions } from '../../../../UIkit/Tag/Tag'
import { GridBlock } from '../../helper/styles/style'

const Categories = styled('div', {
  display: 'flex',
  gap: '8px',
  fontSize: '24px',
  alignItems: 'center',
  color: '#A7A8A9',
  flexWrap: 'wrap'
})

const Tags = styled('div', {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap'
})

const Category = styled(BlueText, {
  fontSize: '24px'
})

const GridBlockDisplay = styled(GridBlock, {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
})

interface TagsSectionProps {
  categories?: string[]
  tags?: string[]
  tagOptions?: TagOptions
}

const TagsSection: FC<TagsSectionProps> = ({ categories, tags, tagOptions }) => {
  return (
    <GridBlockDisplay>
      {categories && (
        <Categories>
          {categories.map((category, index) => {
            return (
              <React.Fragment key={index}>
                <Category>
                  {category}
                  {' '}
                </Category>
                {' '}
                {(index !== (categories.length - 1)) && '/'}
              </React.Fragment>
            )
          })}
        </Categories>
      )}
      {tags && (
        <Tags>
          {tags.map((tag, index) => {
            return <Tag key={index} tagOptions={tagOptions} value={tag}>{tag}</Tag>
          })}
        </Tags>
      )}
    </GridBlockDisplay>
  )
}

export default TagsSection
