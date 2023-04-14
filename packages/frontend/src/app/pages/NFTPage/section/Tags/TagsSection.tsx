import React from 'react';
import {styled} from "../../../../../styles";
import { GridBlock } from '../../helper/styles/style';
import {textVariant} from "../../../../UIkit";

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

const BlueText = styled('h5', {
    ...textVariant('primary2').true,
    color: '$blue500'
})

const Tag = styled(BlueText, {
    padding: '6px 16px',
    background: '#FFFFFF',
    boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
    borderRadius: '20px'
})

const Category = styled(BlueText, {
    fontSize: '24px'
})

const TagsSection = () => {
    const categories = ['Videos', 'Film', 'Pskovskoe por...']
    const tags = ['VR', 'Metaverse', 'Web3', 'Jedi', '3D Internet', 'NFT', 'DAO-ART', 'Art', 'Tag']
    return (
        <GridBlock>
            <Categories>
                {categories.map((category, index) => {
                    return <><Category>{category} </Category> {index !== (categories.length - 1) && '/'}</>
                })}
            </Categories>
            <Tags>
                {tags.map((tag) => {
                    return <Tag>{tag}</Tag>
                })}
            </Tags>
        </GridBlock>
    );
};

export default TagsSection;