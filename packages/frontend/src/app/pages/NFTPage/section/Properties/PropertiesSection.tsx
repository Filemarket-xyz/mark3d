import React, {FC} from 'react';
import {styled} from "../../../../../styles";
import {GridBlock, PropertyTitle} from '../../helper/styles/style';
import PropertiesCard, {PropertiesCardProps} from "./PropertiesCard/PropertiesCard";

const PropertiesStyle = styled('div', {
    '@sm': {
        overflowX: 'scroll',
        '& .overflow': {
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            width: 'max-content',
        }
    }
})

interface PropertiesProps {
    properties: PropertiesCardProps[]
}

const PropertiesSection:FC<PropertiesProps> = ({properties}) => {
    return (
        <GridBlock>
            <PropertyTitle>Properties</PropertyTitle>
        <PropertiesStyle>
            <div className="overflow">
                {properties.map((property) => {
                    return <PropertiesCard type={property.type} rare={property.rare} chance={property.chance}/>
                })}
            </div>
        </PropertiesStyle>
        </GridBlock>
    );
};

export default PropertiesSection;