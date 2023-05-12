import { Collapse } from '@nextui-org/react'
import { useWeb3Modal } from '@web3modal/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import ArrowCollapseImg from '../../../../../assets/img/ArrowCollapse.svg'
import CursorSquare from '../../../../../assets/img/HowToGetStart/CursorSquare.svg'
import Danger from '../../../../../assets/img/HowToGetStart/Danger.svg'
import DownloadMinimalistic from '../../../../../assets/img/HowToGetStart/DownloadMinimalistic.svg'
import FolderWithFiles from '../../../../../assets/img/HowToGetStart/FolderWithFiles.svg'
import KeySquare2 from '../../../../../assets/img/HowToGetStart/KeySquare2.svg'
import LinkImg from '../../../../../assets/img/HowToGetStart/Link.svg'
import ListCheck from '../../../../../assets/img/HowToGetStart/ListCheck.svg'
import UserCheckRounded from '../../../../../assets/img/HowToGetStart/UserCheckRounded.svg'
import VerifiedCheck from '../../../../../assets/img/HowToGetStart/VerifiedCheck.svg'
import Wallet from '../../../../../assets/img/HowToGetStart/Wallet.svg'
import WatchSquareMinimalistic from '../../../../../assets/img/HowToGetStart/WatchSquareMinimalistic.svg'
import { styled } from '../../../../../styles'
import { Link, textVariant, Txt } from '../../../../UIkit'
import HowToGetStartCard from '../HowToGetStartCard/HowToGetStartCard'

const HowToGetStartStyle = styled('div', {
  color: '#232528',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  '@md': {
    gap: '24px'
  },
  '& img': {
    width: '32px'
  }
})

const ArrowContent = styled('div', {
  display: 'flex',
  gap: '12px',
  '& span': {
    '@md': {
      fontSize: '16px !important'
    },
    '@sm': {
      fontSize: '14px !important'
    }
  }

})

const Line = styled('div', {
  width: '100%',
  height: '1px',
  background: '$gray300',
  marginBottom: '24px',
  variants: {
    card: {
      true: {
        marginBottom: '$3',
        marginTop: '$3',
        '@lg': {
          marginBottom: '$2',
          marginTop: '$2'
        },
        '@sm': {
          marginBottom: '$1',
          marginTop: '$1'
        }
      }
    }
  }
})

const Block = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  fontSize: '16px',
  '@md': {
    fontSize: '12px'
  }
})

const Header = styled('h3', {
  ...textVariant('primary1').true,
  fontSize: '24px',
  lineHeight: '32px',
  '@md': {
    fontSize: '20px'
  }
})

const CardBlocks = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px'
})

const Text = styled('h4', {
  ...textVariant('primary1').true,
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: '600',
  '@md': {
    fontSize: '12px'
  },
  '@sm': {
    fontSize: '11px'
  },
  variants: {
    blue: {
      true: {
        color: '$blue500'
      }
    },
    linear: {
      true: {
        fontSize: '12px',
        fontStyle: 'Italic',
        fontWeight: '400',
        background: 'linear-gradient(90deg, #FC6076 0%, #FF9A44 100%)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        '@md': {
          fontSize: '12px'
        }
      }
    }
  }
})

const Title = styled('h3', {
  ...textVariant('primary1').true,
  fontWeight: '700',
  fontSize: '32px',
  color: '#0090FF',
  '@md': {
    fontSize: '24px'
  },
  '@sm': {
    fontSize: '16px'
  }
})

const HowToGetStart = () => {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  return (
      <Collapse title={<Title>How to use FileMarket?</Title>}
                css={{
                  background: 'white',
                  border: '1px solid #0090FF',
                  borderRadius: '24px',
                  padding: '12px 32px',
                  '& .nextui-collapse-title-content': {
                    width: '80%'
                  }
                }} arrowIcon={<ArrowContent><Txt primary1 style={{ fontWeight: '500', fontSize: '24px', color: '#0090FF' }}>Expand</Txt><img src={ArrowCollapseImg} /></ArrowContent>}
      >          <Line />
        <HowToGetStartStyle>
        <Block>
          <Header>{'If it\'s your first time on FileMarket'}</Header>
          <CardBlocks>
            <HowToGetStartCard number={1} content={
              <Link iconRedirect
                    howToGetStart
                    href={'https://medium.com/filemarket-xyz/how-to-buy-fil-and-use-fil-in-the-filecoin-virtual-machine-d67fa90764d5'}
                    style={{
                      textDecoration: 'underline'
                    }}
              >Top up your wallet with $FIL
              </Link>} img={LinkImg} size={'medium'} />
            <HowToGetStartCard number={2} content={
              <Link
                    howToGetStart
                    onPress={() => {
                      !isConnected && open()
                    }}
                    style={{
                      textDecoration: 'underline'
                    }}
              >Connect your crypto wallet
              </Link>} img={Wallet} size={'medium'} />
            <HowToGetStartCard number={3} content={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text blue
              >Create a FileWallet and set a password for it
              </Text>
              <Text linear>
                *Be sure to save the Seed phrase!
              </Text>
              </div>} img={KeySquare2} size={'medium'} />
            <HowToGetStartCard number={4} content={
                <Link
                  howToGetStart
                  onPress={() => {
                    navigate('/market')
                  }}
                  style={{
                    textDecoration: 'underline'
                  }}
                >{'You\'re now ready to buy and sell EFTs'}</Link>
            } img={VerifiedCheck} size={'medium'} />
          </CardBlocks>
        </Block>
        <Block style={{
          gap: '16px'
        }}>
          <Txt h5 style={{ fontWeight: '600', fontSize: '1.25em' }}>*Why create a FileWallet?</Txt>
          <Txt h5 style={{ fontWeight: '400', fontSize: '1.25em' }}>Each file hidden inside an NFT using EFT© Protocol
            is encrypted with a special cryptographic key. This key belongs only to the EFT owner,
            providing reliable protection against unauthorized content downloading.
            FileWallet stores all these keys so you can decrypt and download all your files from any device.
          </Txt>
        </Block>
          <Block>
            <Header>{'If FileWallet has already been created'}</Header>
            <CardBlocks>
              <HowToGetStartCard number={1} content={
                <Link
                  howToGetStart
                  onPress={() => {
                    !isConnected && open()
                  }}
                  style={{
                    textDecoration: 'underline'
                  }}
                >Connect your crypto wallet
                </Link>} img={KeySquare2} size={'small'} />
              <HowToGetStartCard number={1} content={
                <div>
                  <div>
                    <Text style={{ lineHeight: '1' }}> If the FileWallet was created on the same device</Text>
                    <Text blue style={{ lineHeight: '1' }}>Connect your FileWallet by entering your password</Text>
                  </div>
                  <Line card />
                  <div>
                    <Text style={{ lineHeight: '1' }}>If the FileWallet was created on the another device</Text>
                    <Text blue style={{ lineHeight: '1' }}>Connect your FileWallet by entering the seed phrase and creating a password for it</Text>
                  </div>
                </div>
               } img={FolderWithFiles} size={'big'} />
            </CardBlocks>
          </Block>
          <Line style={{ margin: 0 }} />
          <Block>
            <Header>{'To sell an EFT with attached encrypted file'}</Header>
            <CardBlocks>
              <HowToGetStartCard number={1} content={
                <Link
                      howToGetStart
                      href={'/create/collection'}
                      target={'_blank'}
                      style={{
                        textDecoration: 'underline'
                      }}
                >Create a collection
                </Link>} img={LinkImg} size={'small'} />
              <HowToGetStartCard number={2} content={
                <Link
                  howToGetStart
                  href={'/create/nft'}
                  target={'_blank'}
                  style={{
                    textDecoration: 'underline'
                  }}
                >Mint an EFT with a hidden file
                </Link>} img={Danger} size={'small'} />
              <HowToGetStartCard number={3} content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text>List your EFT and place an order</Text>
                </div>} img={Wallet} size={'small'} />
              <HowToGetStartCard number={4} content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text>Await a purchase request</Text>
                </div>} img={WatchSquareMinimalistic} size={'small'} />
              <HowToGetStartCard number={5} content={
                <Text>{'Click Transfer Hidden File from the EFT page'}</Text>
              } img={CursorSquare} size={'small'} />
              <HowToGetStartCard number={6} content={
                <Text>{'Wait for the buyer\'s transaction confirmation'}</Text>
              } img={UserCheckRounded} size={'small'} />
            </CardBlocks>
          </Block>
          <Block>
            <Header>{'To buy an EFT with attached encrypted file'}</Header>
            <CardBlocks>
              <HowToGetStartCard number={1} content={
                <Link
                      howToGetStart
                      onPress={() => {
                        navigate('/market')
                      }}
                      style={{
                        textDecoration: 'underline'
                      }}
                >Select an EFT in the storefront
                </Link>} img={LinkImg} size={'small'} />
              <HowToGetStartCard number={2} content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text>Press the Buy button</Text>
                </div>} img={CursorSquare} size={'small'} />
              <HowToGetStartCard number={3} content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text>Wait for the seller to transfer
                    the hidden file</Text>
                </div>} img={WatchSquareMinimalistic} size={'small'} />
              <HowToGetStartCard number={4} content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text>Download the file from the EFT page</Text>
                </div>} img={DownloadMinimalistic} size={'medium'} />
              <HowToGetStartCard number={5} content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text>Confirm the deal</Text>
                </div>} img={ListCheck} size={'medium'} />
            </CardBlocks>
          </Block>
        </HowToGetStartStyle>
      </Collapse>
  )
}

export default HowToGetStart
