import React from 'react';
import {useParams} from "react-router-dom";
import {Params} from "../../../../utils/router/Params";
import {useTokenStore} from "../../../../hooks/useTokenStore";
import {P, PropertyTitle, GridBlock } from '../../helper/styles/style';

const DescriptionSection = () => {
    const { collectionAddress, tokenId } = useParams<Params>()
    const { data: token } = useTokenStore(collectionAddress, tokenId)
    return (
        <GridBlock>
            <PropertyTitle>Description</PropertyTitle>
            <P>{token?.description}</P>
        </GridBlock>
    );
};

export default DescriptionSection;