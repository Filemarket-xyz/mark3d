import React, {FC} from 'react';
import {styled} from "../../../../../styles";
import {GridBlock, PropertyTitle} from '../../helper/styles/style';
import PropertiesCard, {PropertiesCardProps} from "./PropertiesCard/PropertiesCard";

const PropertiesStyle = styled('div', {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
})

interface PropertiesProps {
    properties: PropertiesCardProps[]
}

const PropertiesSection:FC<PropertiesProps> = ({properties}) => {
    return (
        <GridBlock>
            <PropertyTitle>Properties</PropertyTitle>
        <PropertiesStyle>
            {properties.map((property) => {
                return <PropertiesCard type={property.type} rare={property.rare} chance={property.chance}/>
            })}
        </PropertiesStyle>
        </GridBlock>
    );
};

export default PropertiesSection;