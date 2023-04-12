import React from 'react';
import {styled} from "../../../../styles";
import FakeMintNft from "./FakeMintNft/FakeMintNft";
import FakeMintNftImageCommon from '../../../../assets/img/FakeMint/FakeMintCommon.png'
import FakeMintNftImageUncommon from '../../../../assets/img/FakeMint/Uncommon.png'
import FakeMintNftImageRare from '../../../../assets/img/FakeMint/Rare.png'
import FakeMintNftImageLegendary from '../../../../assets/img/FakeMint/Legendary.png'
import FakeMintNftImageMythical from '../../../../assets/img/FakeMint/Mythical.png'

const FakeNftSectionStyle = styled('div', {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '22.5px',
    minHeight: '566px',
    maxWidth: '1590px',
    margin: '0 120px'
})

const FakeMintNftSection = () => {
    return (
        <FakeNftSectionStyle>
            <FakeMintNft price={'2000000000000000000'} chance={'0.33'} imageURL={FakeMintNftImageCommon} rarity={'common'}/>
            <FakeMintNft price={'13000000000000000000'} chance={'1.2'} imageURL={FakeMintNftImageUncommon} rarity={'uncommon'}/>
            <FakeMintNft price={'26000000000000000000'} chance={'2'} imageURL={FakeMintNftImageRare} rarity={'rare'}/>
            <FakeMintNft price={'52000000000000000000'} chance={'5'} imageURL={FakeMintNftImageLegendary} rarity={'legendary'}/>
            <FakeMintNft price={'104000000000000000000'} chance={'10'} imageURL={FakeMintNftImageMythical} rarity={'mythical'}/>
        </FakeNftSectionStyle>
    );
};

export default FakeMintNftSection;