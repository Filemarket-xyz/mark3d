import React from 'react';
import {styled} from "../../../../../../styles";
import {textVariant} from "../../../../../UIkit";
import FileMarketIcon from '../../../../../../assets/FileMarket.svg'

const TopSectionStyle = styled('div', {
    '& .section': {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '320px',
        ...textVariant('secondary2'),

    },
    display: 'flex',
    justifyContent: 'space-between',
    '& .first': {
        '& img': {
            width: '170px',
            height: '30px'
        }
    }
})

const Text = styled('h5', {
    ...textVariant('secondary1').true
})

const TopSection = () => {
    return (
        <TopSectionStyle>
            <div className="section first">
                <img src={FileMarketIcon} alt=""/>
                <Text>The first NFT marketplace and protocol with Filecoin Virtual Machine support for monetizing downloadable digital content on web3 through file tokenization.</Text>
            </div>
            <div className="section second">

            </div>
            <div className="section second">

            </div>
            <div className="section second">

            </div>
            <div className="section third">

            </div>
        </TopSectionStyle>
    );
};

export default TopSection;