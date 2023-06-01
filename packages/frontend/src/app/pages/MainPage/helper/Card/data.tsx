import EarnCryptoImg from '../../../../../assets/img/MainPage/EarnCryptocurrency.jpg'
import EFTImg from '../../../../../assets/img/MainPage/EFT.jpg'
import JoinTheSaleImg from '../../../../../assets/img/MainPage/JoinTheSale.jpg'
import { Button } from '../../../../UIkit'
import { CardProps } from '../../components/Card/Card'

export const CardWhiteOptions: CardProps[] = [
  {
    headerText: 'FileBunnies: Join the sale of the most anticipated NFT collection on FVM',
    img: JoinTheSaleImg,
    text: (
      <>
        <span>{'The first NFT collection on the first NFT marketplace using the Filecoin Virtual Machine, with real value inside each NFT.'}</span>
        <span>{'Inside: Bonuses and gifts from FileMarket partners and friends, Filecoin ecosystem catalog, branded wallpapers, 3D Filecoin coin model for printing, Filecoin soundtrack, and a chance to find one of 100 unique FileBunny Jammy cards!'}</span>
      </>
    ),
    rightBottomContent: <Button mediumMxWidth primary style={{ width: '240px' }}>Mint FileBunny</Button>,
    cardType: 'info',
    linear: true,
  },
  {
    headerText: 'Earn cryptocurrency by selling files',
    img: EarnCryptoImg,
    text: (
      <>
        <span>{'We didn\'t just create an NFT marketplace for digital art and speculation with publicly available content. We created a Web3 service and opened a market for trading access to any files that may have value for someone.'}</span>
        <span>{'You tokenize a file in encrypted form, and from that moment on, it\'s not just data; it\'s a decentralized digital asset subject to market laws.'}</span>
      </>
    ),
    rightBottomContent: (
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <Button mediumMxWidth primary style={{ width: '240px' }}>1. Create Collection</Button>
        <Button mediumMxWidth primary style={{ width: '240px' }}>2. Mint NFT File</Button>
      </div>
    ),
    cardType: 'info',
    isImgRight: true,
  },
  {
    headerText: 'FileBunnies: Join the sale of the most anticipated NFT collection on FVM',
    img: EFTImg,
    text: (
      <>
        <span>{'The FileMarket team has developed a new approach based on the well-known NFT standard ERC-721 and decentralized storage Filecoin and FVM - Encrypted FileToken©.'}</span>
        <span>{'This standard allows for truly decentralized storage of protected files within NFTs and access transfer through NFT sales.'}</span>
        <span>{'NFTs now genuinely enable you to possess unique content accessible only to you.'}</span>
      </>
    ),
    rightBottomContent: <Button smallMxWidth primary style={{ maxWidth: '320px' }}>Technical description of EFT</Button>,
    cardType: 'info',
  },
]
export const CardBlackOptions: CardProps[] = [
  {
    headerText: 'Build your community around NFTs',
    img: EarnCryptoImg,
    text: (
      <>
        <span>{'FileMarket allows you to create your own NFT file stores for opinion leaders, influencers, creative authors, and business people.'}</span>
        <span>{'This will be your separate storefront on your domain with your personal design, where you can invite only your audience.'}</span>
      </>
    ),
    rightBottomContent: <Button mediumMxWidth primary style={{ maxWidth: '320px' }}>Apply for an NFT storefront</Button>,
    cardType: 'info',
  },
  {
    headerText: 'We\'re building a DAO',
    img: EarnCryptoImg,
    text: (
      <>
        <span>{'Our product is built on a DAO model, and anyone can become our contributor, make joint decisions about the project\'s future, and what it should be like.'}</span>
        <span>{'Our goal is to achieve an acceptable level of decentralization to 2024-2025.'}</span>
        <span>{'A community of creators and entrepreneurs is being formed right now. Become a part of it!'}</span>
      </>
    ),
    rightBottomContent: <Button mediumMxWidth primary style={{ width: '240px' }}>Discord</Button>,
    cardType: 'info',
    isImgRight: true,
  },
]

export const CardGradientOptions: CardProps[] = [
  {
    headerText: 'More than a marketplace',
    img: EarnCryptoImg,
    text: <span>{'FileMarket is an SDK and API for the entire web3 market, enabling the integration of Encrypted FileToken© Protocol for transferring hidden content in any mechanics, whether it be freelance exchanges, educational portals, or other content access services.'}</span>,
    rightBottomContent: <Button mediumMxWidth primary style={{ maxWidth: '320px' }}>API (under development)</Button>,
    cardType: 'info',
    linear: true,
  },
  {
    headerText: 'DeFi, staking, and the future',
    img: EarnCryptoImg,
    text: (
      <>
        <span>{'In the near future, NFTs will not only have additional value inside but will also become a tool of the Data economy being created today with Filecoin and hundreds of other projects.'}</span>
        <span>{'We are already preparing unique staking mechanics, loans, and derivatives with many of them.'}</span>
        <span>{'If you want to be the first users of DeFi tools based on EFT - apply now.'}</span>
      </>
    ),
    rightBottomContent: <Button mediumMxWidth primary style={{ width: '240px' }}>Join the waitlist</Button>,
    cardType: 'info',
    isImgRight: true,
  },
]
