import { CardProps } from '../../components/Card/Card'
import EFTImg from '../../../../../assets/img/MainPage/EFT.jpg'
import EarnCryptoImg from '../../../../../assets/img/MainPage/EarnCryptocurrency.jpg'
import JoinTheSaleImg from '../../../../../assets/img/MainPage/JoinTheSale.jpg'
import { Button } from '../../../../UIkit'

export const CardWhiteOptions: CardProps[] = [
  {
    headerText: 'FileBunnies: Join the sale of the most anticipated NFT collection on FVM',
    img: JoinTheSaleImg,
    text: <>
      <span>The first NFT collection on the first NFT marketplace using the Filecoin Virtual Machine, with real value inside each NFT.</span>
      <span>Inside: Bonuses and gifts from FileMarket partners and friends, Filecoin ecosystem catalog, branded wallpapers, 3D Filecoin coin model for printing, Filecoin soundtrack, and a chance to find one of 100 unique FileBunny Jammy cards!</span>
    </>,
    rightBottomContent: <Button primary style={{ width: '240px' }}>Mint FileBunny</Button>,
    cardType: 'info',
    linear: true
  },
  {
    headerText: 'Earn cryptocurrency by selling files',
    img: EarnCryptoImg,
    text: <>
      <span>{'We didn\'t just create an NFT marketplace for digital art and speculation with publicly available content. We created a Web3 service and opened a market for trading access to any files that may have value for someone.'}</span>
      <span>{'You tokenize a file in encrypted form, and from that moment on, it\'s not just data; it\'s a decentralized digital asset subject to market laws.'}</span>
      </>,
    rightBottomContent: <div style={{ display: 'flex', gap: '32px' }}><Button primary style={{ width: '240px' }}>1. Create Collection</Button><Button primary style={{ width: '240px' }}>2. Mint NFT File</Button></div>,
    cardType: 'info',
    isImgRight: true
  },
  {
    headerText: 'FileBunnies: Join the sale of the most anticipated NFT collection on FVM',
    img: EFTImg,
    text: <>
      <span>The FileMarket team has developed a new approach based on the well-known NFT standard ERC-721 and decentralized storage Filecoin and FVM - Encrypted FileToken©.</span>
      <span>This standard allows for truly decentralized storage of protected files within NFTs and access transfer through NFT sales.</span>
      <span>NFTs now genuinely enable you to possess unique content accessible only to you.</span>
    </>,
    rightBottomContent: <Button primary style={{ width: '320px' }}>Technical description of EFT</Button>,
    cardType: 'info'
  }
]
export const CardBlackOptions: CardProps[] = [
  {
    headerText: 'FileBunnies: Join the sale of the most anticipated NFT collection on FVM',
    img: JoinTheSaleImg,
    text: <>
      <span>The first NFT collection on the first NFT marketplace using the Filecoin Virtual Machine, with real value inside each NFT.</span>
      <span>Inside: Bonuses and gifts from FileMarket partners and friends, Filecoin ecosystem catalog, branded wallpapers, 3D Filecoin coin model for printing, Filecoin soundtrack, and a chance to find one of 100 unique FileBunny Jammy cards!</span>
    </>,
    rightBottomContent: <Button primary style={{ width: '240px' }}>Mint FileBunny</Button>,
    cardType: 'info'
  },
  {
    headerText: 'Earn cryptocurrency by selling files',
    img: EarnCryptoImg,
    text: <>
      <span>{'We didn\'t just create an NFT marketplace for digital art and speculation with publicly available content. We created a Web3 service and opened a market for trading access to any files that may have value for someone.'}</span>
      <span>{'You tokenize a file in encrypted form, and from that moment on, it\'s not just data; it\'s a decentralized digital asset subject to market laws.'}</span>
    </>,
    rightBottomContent: <div style={{ display: 'flex', gap: '32px' }}><Button primary style={{ width: '240px' }}>1. Create Collection</Button><Button primary style={{ width: '240px' }}>2. Mint NFT File</Button></div>,
    cardType: 'info',
    isImgRight: true
  }
]

export const CardLinearOptions: CardProps[] = [
  {
    headerText: 'FileBunnies: Join the sale of the most anticipated NFT collection on FVM',
    img: JoinTheSaleImg,
    text: <>
      <span>The first NFT collection on the first NFT marketplace using the Filecoin Virtual Machine, with real value inside each NFT.</span>
      <span>Inside: Bonuses and gifts from FileMarket partners and friends, Filecoin ecosystem catalog, branded wallpapers, 3D Filecoin coin model for printing, Filecoin soundtrack, and a chance to find one of 100 unique FileBunny Jammy cards!</span>
    </>,
    rightBottomContent: <Button primary style={{ width: '240px' }}>Mint FileBunny</Button>,
    cardType: 'info',
    linear: true
  },
  {
    headerText: 'Earn cryptocurrency by selling files',
    img: EarnCryptoImg,
    text: <>
      <span>{'We didn\'t just create an NFT marketplace for digital art and speculation with publicly available content. We created a Web3 service and opened a market for trading access to any files that may have value for someone.'}</span>
      <span>{'You tokenize a file in encrypted form, and from that moment on, it\'s not just data; it\'s a decentralized digital asset subject to market laws.'}</span>
    </>,
    rightBottomContent: <div style={{ display: 'flex', gap: '32px' }}><Button primary style={{ width: '240px' }}>1. Create Collection</Button><Button primary style={{ width: '240px' }}>2. Mint NFT File</Button></div>,
    cardType: 'info',
    isImgRight: true
  }
]
