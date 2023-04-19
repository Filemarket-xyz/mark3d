import React from 'react';
import {styled} from "../../../../../styles";
import { GridBlock } from '../../helper/styles/style';
import {textVariant} from "../../../../UIkit";
import {BlueText, Tag} from "../../../../UIkit/Tag/Tag";

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
    flexWrap: 'wrap',
    marginTop: '$3'
})


const Category = styled(BlueText, {
    fontSize: '24px'
})

const TagsSection = () => {
    const categories = ['Videos', 'Film']
    const tags = ['VR', 'Metaverse', 'Web3', 'Jedi', '3D Internet', 'NFT', 'DAO-ART', 'Art', 'Tag']
    return (
        <GridBlock>
            <Categories>
                {categories.map((category, index) => {
                    return <React.Fragment key={index}><Category>{category} </Category> {index !== (categories.length - 1) && '/'}</React.Fragment>
                })}
            </Categories>
            <Tags>
                {tags.map((tag, index) => {
                    return <Tag key={index}>{tag}</Tag>
                })}
            </Tags>
        </GridBlock>
    );
};

export default TagsSection;