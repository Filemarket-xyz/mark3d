import React from 'react';
import {styled} from "../../../../../styles";
import {useParams} from "react-router-dom";
import {Params} from "../../../../utils/router/Params";
import {useTokenStore} from "../../../../hooks/useTokenStore";
import {Link, textVariant} from "../../../../UIkit";
import { GridBlock } from '../../helper/styles/style';

const NftName = styled('h1', {
    ...textVariant('h3').true,
    fontWeight: '600',
    color: '$gray800',
    marginBottom: '$2'
})

const NftLicence = styled('h5', {})

const BaseInfoSection = () => {
    const { collectionAddress, tokenId } = useParams<Params>()
    const { data: token } = useTokenStore(collectionAddress, tokenId)
    return (
        <GridBlock>
            <NftName>{token?.name}</NftName>
            <Link href={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} target="_blank">Minted on Sep 9, 2022</Link>
            <NftLicence>License: <Link href={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} target="_blank">CC BY 4.0</Link></NftLicence>
        </GridBlock>
    );
};

export default BaseInfoSection;