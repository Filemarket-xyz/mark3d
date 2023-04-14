import React from 'react';
import {Badge, gradientPlaceholderImg, NavLink, textVariant} from "../../../../UIkit";
import {getProfileImageUrl} from "../../../../utils/nfts/getProfileImageUrl";
import {reduceAddress} from "../../../../utils/nfts/reduceAddress";
import {getHttpLinkFromIpfsString} from "../../../../utils/nfts/getHttpLinkFromIpfsString";
import {styled} from "../../../../../styles";
import {useCollectionStore} from "../../../../hooks/useCollectionStore";
import {useParams} from "react-router-dom";
import {Params} from "../../../../utils/router/Params";
import {useTokenStore} from "../../../../hooks/useTokenStore";
import { GridBlock, Link } from '../../helper/styles/style';

const NftName = styled('h1', {
    ...textVariant('h3').true,
    fontWeight: '600',
    color: '$gray800',
    marginBottom: '$2'
})

const BadgesContainer = styled('div', {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '$3',
    '@sm': {
        flexDirection: 'column-reverse',
        gap: '$2'
    }
})

const NftLicence = styled('h5', {
    marginBottom: '$4'
})

const HomeLandSection = () => {
    const { collectionAddress, tokenId } = useParams<Params>()
    const { data: token } = useTokenStore(collectionAddress, tokenId)
    const { collection } = useCollectionStore(collectionAddress)
    return (
        <GridBlock>
            <NftName>{token?.name}</NftName>
            <Link href={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} target="_blank">Minted on Sep 9, 2022</Link>
            <NftLicence>License: <Link href={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} target="_blank">CC BY 4.0</Link></NftLicence>
            <BadgesContainer>
                <NavLink
                    to={
                        collection?.address
                            ? `/collection/${collection?.address}`
                            : location.pathname
                    }
                >
                    <Badge
                        image={{
                            url: collection?.image
                                ? getHttpLinkFromIpfsString(collection.image)
                                : gradientPlaceholderImg,
                            borderRadius: 'roundedSquare'
                        }}
                        content={{ title: 'Collection', value: collection?.name ?? '' }}
                    />
                </NavLink>
                <NavLink
                    to={collection?.creator ? `/profile/${collection?.creator}` : location.pathname}
                >
                    <Badge
                        image={{
                            borderRadius: 'circle',
                            url: getProfileImageUrl(collection?.creator ?? '')
                        }}
                        content={{
                            title: 'Creator',
                            value: reduceAddress(collection?.creator ?? '')
                        }}
                    />
                </NavLink>
                <NavLink
                    to={token?.owner ? `/profile/${token?.owner}` : location.pathname}
                >
                    <Badge
                        image={{
                            borderRadius: 'circle',
                            url: getProfileImageUrl(token?.owner ?? '')
                        }}
                        content={{
                            title: 'Owner',
                            value: reduceAddress(token?.owner ?? '')
                        }}
                    />
                </NavLink>
            </BadgesContainer>
        </GridBlock>
    );
};

export default HomeLandSection;