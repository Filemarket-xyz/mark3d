import React from 'react'

import FileMarketIcon from '../../../../../../assets/FileMarket.svg'
import DiscordImg from '../../../../../../assets/img/DiscordImg.svg'
import LinkedinImg from '../../../../../../assets/img/LinkedinImg.svg'
import MediumImg from '../../../../../../assets/img/MediumImg.svg'
import TelegramImg from '../../../../../../assets/img/TelegramImg.svg'
import TwitterImg from '../../../../../../assets/img/TwitterImg.svg'
import YoutubeImg from '../../../../../../assets/img/YoutubeImg.svg'
import { styled } from '../../../../../../styles'
import { textVariant } from '../../../../../UIkit'

const TopSectionStyle = styled('div', {
  '& .section': {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    ...textVariant('secondary2')

  },
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
  '& .first': {
    maxWidth: '320px',
    '& img': {
      width: '170px',
      height: '30px'
    },
    '& h5': {
      fontWeight: '500 !important',
      fontSize: '16px !important'
    }
  },
  '& .third': {
    maxWidth: '256px'
  }
})

const Text = styled('a', {
  ...textVariant('secondary2').true,
  fontWeight: '500',
  color: 'white',
  textDecoration: 'none',
  '&:hover': {
    color: '#D3D3D4'
  }
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
  borderRadius: '8px',
  textDecoration: 'none',
  '&:hover': {
    background: '#393B3E'
  }
})

interface Link {
  text: string
  url: string
}

const TopSection = () => {
  const MarketPlaceItems: Link[] = [
  //   {
  //   text: 'FileBunnies',
  //   url: ''
  // },
    {
      text: 'Explore NFT Files',
      url: '/market'
    },
    // {
    //   text: 'Collections',
    //   url: ''
    // },
    {
      text: 'Blogs',
      url: 'https://medium.com/filemarket-xyz'
    }
  // {
  //   text: 'FAQ',
  //   url: ''
  // }
  ]
  const Links: Link[] = [{
    text: 'EFT',
    url: 'https://medium.com/filemarket-xyz/how-to-attach-an-encrypted-file-to-your-nft-7d6232fd6d34'
  },
  // {
  //   text: 'API',
  //   url: ''
  // },
  {
    text: 'DAO',
    url: 'https://discord.gg/9pe5CUqqz4'
  },
  {
    text: 'GitHub',
    url: 'https://github.com/Filemarket-xyz/file-market'
  }
  ]
  const Company: Link[] = [
  //   {
  //   text: 'About',
  //   url: ''
  // },
    {
      text: 'Ambassador program',
      url: 'https://filemarket.typeform.com/to/MTwDOB1J'
    },
    {
      text: 'Become a partner',
      url: 'https://filemarket.typeform.com/to/BqkdzJQM'
    },
    // {
    //   text: 'Branding',
    //   url: ''
    // },
    {
      text: 'Calendly',
      url: 'http://calendly.com/filemarket'
    }
  ]
  const Cards: Array<{ img: string, text: string, url: string }> = [
    {
      img: TwitterImg,
      text: 'Twitter',
      url: 'https://twitter.com/filemarket_xyz'
    },
    {
      img: DiscordImg,
      text: 'Discord',
      url: 'https://discord.gg/9pe5CUqqz4'
    },
    {
      img: TelegramImg,
      text: 'Telegram',
      url: 'https://t.me/FileMarketChat'
    },
    {
      img: YoutubeImg,
      text: 'Youtube',
      url: 'https://www.youtube.com/@filemarket_xyz'
    },
    {
      img: MediumImg,
      text: 'Medium',
      url: 'https://medium.com/filemarket-xyz'
    },
    {
      img: LinkedinImg,
      text: 'LinkedIn',
      url: 'https://www.linkedin.com/company/filemarketxyz/'
    }
  ]
  return (
        <TopSectionStyle>
            <div className="section first">
                <img src={FileMarketIcon} alt="" />
                <Text>FileMarket is a multi-chain platform that serves as NFT shop builder and central marketplace/explorer utilizing Filecoin decentralized storage with privacy protocol for NFTs - Encrypted FileToken (EFT)</Text>
            </div>
            <div className="section second">
                <HeaderText>Marketplace</HeaderText>
                <SecondContent>{MarketPlaceItems.map((item, index) => <Text href={item.url} target={'_blank'} key={index}>{item.text}</Text>)}</SecondContent>
            </div>
            <div className="section second">
                <HeaderText>Links</HeaderText>
                <SecondContent>{Links.map((item, index) => <Text href={item.url} target={'_blank'} key={index}>{item.text}</Text>)}</SecondContent>
            </div>
            <div className="section second">
                <HeaderText>Company</HeaderText>
                <SecondContent>{Company.map((item, index) => <Text href={item.url} target={'_blank'} key={index}>{item.text}</Text>)}</SecondContent>
            </div>
            <div className="section third">
                <HeaderText>Join our community</HeaderText>
                <ThirdContent>{Cards.map((item, index) => <Card href={item.url} target={'_blank'} key={index}><img src={item.img} /><Text>{item.text}</Text></Card>)}</ThirdContent>
            </div>
        </TopSectionStyle>
  )
}

export default TopSection
