import React from 'react';
import {styled} from "../../../../../../styles";
import {textVariant} from "../../../../../UIkit";
import FileMarketIcon from '../../../../../../assets/FileMarket.svg'
import DiscordImg from '../../../../../../assets/img/DiscordImg.svg'
import InstagramImg from '../../../../../../assets/img/Instagram.svg'
import LinkedinImg from '../../../../../../assets/img/LinkedinImg.svg'
import MediumImg from '../../../../../../assets/img/MediumImg.svg'
import RedditImg from '../../../../../../assets/img/RedditImg.svg'
import TelegramImg from '../../../../../../assets/img/TelegramImg.svg'
import TwitterImg from '../../../../../../assets/img/TwitterImg.svg'
import YoutubeImg from '../../../../../../assets/img/YoutubeImg.svg'

const TopSectionStyle = styled('div', {
    '& .section': {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '320px',
        ...textVariant('secondary2'),

    },
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    '& .first': {
        '& img': {
            width: '170px',
            height: '30px'
        },
        '& h5': {
            fontWeight: '400 !important',
            fontSize: '16px !important'
        }
    }
})

const Text = styled('a', {
    ...textVariant('secondary2').true,
    fontWeight: '500',
    color: 'white',
    textDecoration: 'none'
})

const HeaderText = styled('h4', {
    ...textVariant('secondary2').true,
    fontWeight: '700',
    color: '#7B7C7E'
})

const SecondContent = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
})

const ThirdContent = styled('div', {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px'
})

const Card = styled('a', {
    background: '#232528',
    width: '126px',
    height: '44px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '7px',
    borderRadius: '8px'
})

interface Link {
    text: string
    url: string
}

const TopSection = () => {
    const MarketPlaceItems: Link[] = [{
        text: 'FileBunnies',
        url: ''
    },
        {
            text: 'Explore NFT Files',
            url: ''
        },
        {
            text: 'Collections',
            url: ''
        },
        {
            text: 'Blogs',
            url: ''
        },
        {
            text: 'FAQ',
            url: ''
        }
    ]
    const Links: Link[] = [{
        text: 'EFT',
        url: ''
    },
        {
            text: 'API',
            url: ''
        },
        {
            text: 'DAO',
            url: ''
        },
        {
            text: 'GitHub',
            url: ''
        }
    ]
    const Company: Link[] = [{
        text: 'About',
        url: ''
    },
        {
            text: 'Ambassador program',
            url: ''
        },
        {
            text: 'Become a partner',
            url: ''
        },
        {
            text: 'Branding',
            url: ''
        },
        {
            text: 'Calendly',
            url: ''
        }
        ]
    const Cards: {img: string, text: string, url: string}[] = [
        {
            img: TwitterImg,
            text: 'Twitter',
            url: ''
        },
        {
            img: DiscordImg,
            text: 'Discord',
            url: ''
        },
        {
            img: TelegramImg,
            text: 'Telegram',
            url: ''
        },
        {
            img: YoutubeImg,
            text: 'Youtube',
            url: ''
        },
        {
            img: MediumImg,
            text: 'Medium',
            url: ''
        },
        {
            img: LinkedinImg,
            text: 'LinkedIn',
            url: ''
        },
        {
            img: RedditImg,
            text: 'Reddit',
            url: ''
        },
        {
            img: InstagramImg,
            text: 'Instagram',
            url: ''
        }
    ]
    return (
        <TopSectionStyle>
            <div className="section first">
                <img src={FileMarketIcon} alt=""/>
                <Text>The first NFT marketplace and protocol with Filecoin Virtual Machine support for monetizing downloadable digital content on web3 through file tokenization.</Text>
            </div>
            <div className="section second">
                <HeaderText>Marketplace</HeaderText>
                <SecondContent>{MarketPlaceItems.map((item) => <Text href={item.url}>{item.text}</Text>)}</SecondContent>
            </div>
            <div className="section second">
                <HeaderText>Links</HeaderText>
                <SecondContent>{Links.map((item) => <Text href={item.url}>{item.text}</Text>)}</SecondContent>
            </div>
            <div className="section second">
                <HeaderText>Company</HeaderText>
                <SecondContent>{Company.map((item) => <Text href={item.url}>{item.text}</Text>)}</SecondContent>
            </div>
            <div className="section third">
                <HeaderText>Join our community</HeaderText>
                <ThirdContent>{Cards.map((item) => <Card href={item.url}><img src={item.img}/><Text>{item.text}</Text></Card>)}</ThirdContent>
            </div>
        </TopSectionStyle>
    );
};

export default TopSection;