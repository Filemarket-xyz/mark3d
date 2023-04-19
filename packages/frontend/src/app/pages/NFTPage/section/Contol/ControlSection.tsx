import React, {useMemo} from 'react';
import {NFTDeal} from "../../../../components/NFT";
import {useParams} from "react-router-dom";
import {Params} from "../../../../utils/router/Params";
import {useTransferStoreWatchEvents} from "../../../../hooks/useTransferStoreWatchEvents";
import {useOrderStore} from "../../../../hooks/useOrderStore";
import {makeTokenFullId} from "../../../../processing/utils/id";
import { GridBlock } from '../../helper/styles/style';

const ControlSection = () => {
    const { collectionAddress, tokenId } = useParams<Params>()
    const transferStore = useTransferStoreWatchEvents(collectionAddress, tokenId)
    const orderStore = useOrderStore(collectionAddress, tokenId)
    const tokenFullId = useMemo(
        () => makeTokenFullId(collectionAddress, tokenId),
        [collectionAddress, tokenId]
    )
    return (
        <GridBlock>
            {tokenFullId && (
                <NFTDeal
                    transfer={transferStore.data}
                    order={orderStore.data}
                    tokenFullId={tokenFullId}
                    reFetchOrder={() => {
                        orderStore.reload()
                        transferStore.reload()
                    }}
                >
                </NFTDeal>
            )}
        </GridBlock>
    );
};

export default ControlSection;