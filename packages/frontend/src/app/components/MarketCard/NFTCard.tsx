import React from 'react'
import {styled} from '../../../styles'
import {gradientPlaceholderImg, NavButton, textVariant, Txt} from '../../UIkit'
import BasicCard, {BasicCardControls, BasicCardSquareImg} from './BasicCard'
import {useNavigate} from 'react-router-dom'
import {BigNumber, utils} from 'ethers'
import {mark3dConfig} from '../../config/mark3d'
import {useCollectionTokenListStore} from "../../hooks/useCollectionTokenListStore";
import {getHttpLinkFromIpfsString} from "../../utils/nfts/getHttpLinkFromIpfsString";

export const CardControls = styled(BasicCardControls, {
    height: '172px',
    position: 'absolute',
    left: 0,
    right: 0,
    transform: 'translateY(0)',
    transition: 'all 0.25s ease-in-out',
    bottom: '-65px',
    paddingTop: '12px',
    border: '1px solid #E9E9EA',
    borderRadius: '16px'
})

export const CardTitle = styled('h5', {
    ...textVariant('primary2').true,
    marginBottom: '$1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '$gray500',
    transitionDelay: '0.35s'
})

const generateHoverStylesForCard = () => {
    const hoverStyles: any = {}
    hoverStyles[`&:hover ${CardControls.selector}`] = {
        transform: 'translateY(-73px)',
        transitionDelay: '0s'
    }

    hoverStyles[`&:hover ${CardTitle.selector}`] = {
        color: '$blue900',
        transitionDelay: '0s'
    }
    hoverStyles['&:hover'] = {
        border: '2px solid transparent',
        background:
            'linear-gradient($white 0 0) padding-box, $gradients$main border-box',
        transitionDelay: '0s'
    }

    return hoverStyles
}

export const CardCollection = styled('p', {
    ...textVariant('secondary3').true,
    marginBottom: '$1'
})

export const PriceInfo = styled('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '$3',
    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), $gray800',
    borderRadius: '8px',
    height: '32px',
    width: '100%',
    padding: '0 8px',
    marginTop: '8px',
    variants: {
        noneOpacity: {
            true: {
                opacity: 0
            }
        }
    }
})

export const UserContainer = styled('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '$gray500',
    height: 20
})

export const UserImg = styled('img', {
    width: '20px',
    height: '20px',
    borderRadius: '50%'
})

export const UserName = styled('p', {
    ...textVariant('primary3').true,
    lineHeight: '$body2'
})

export const Price = styled('span', {
    ...textVariant('primary2'),
    color: '$blue900',
    fontWeight: '600',
    lineHeight: '$body2'
})

export const ButtonContainer = styled('div', {
    display: 'flex',
    justifyContent: 'center'
})

export interface NFTCardProps {
    imageURL: string
    title: string
    collection: string
    user: {
        img: string
        username: string
    }
    button: {
        text: string
        link: string
    }
    price?: string
    hiddenFile?: string
}

export const Card = styled(BasicCard, {
    cursor: 'pointer'
})

export const BorderLayout = styled('div', {
    background: 'rgba(255,255,255,0.9)',
    width: '259px',
    height: '383px',
    borderRadius: 'calc($3 + 2px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '12px',
    border: '1px solid #E9E9EA',
    ...generateHoverStylesForCard()
})

export default function NFTCard(props: NFTCardProps) {
    console.log(props)
    const navigate = useNavigate()
    const { data: collectionAndNfts } =
        useCollectionTokenListStore(props.collection)
    return (
        <BorderLayout>
            <Card onClick={() => {
                navigate(props.button.link)
            }}>
                <BasicCardSquareImg
                    src={props.imageURL}
                    onError={({currentTarget}) => {
                        currentTarget.onerror = null
                        currentTarget.src = gradientPlaceholderImg
                    }}
                />
                <CardControls>
                    <CardTitle title={props.title}>{props.title}</CardTitle>
                    <CardCollection>{collectionAndNfts.collection?.name}</CardCollection>
                    <UserContainer>
                        <UserImg src={props.user.img}/>
                        <UserName>{props.user.username}</UserName>
                    </UserContainer>
                        <PriceInfo noneOpacity={props.price === undefined}>
                            <Price>{`${utils.formatUnits(BigNumber.from(props.price ?? '0'), mark3dConfig.chain.nativeCurrency.decimals)} ${mark3dConfig.chain.nativeCurrency.symbol}`}</Price>
                        </PriceInfo>
                    <ButtonContainer>
                        <NavButton
                            primary
                            to={props.button.link}
                            small={true}
                            css={{
                                textDecoration: 'none',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '100%'
                            }}
                        >
                            <Txt primary3>{props.button.text}</Txt>
                        </NavButton>
                    </ButtonContainer>
                </CardControls>
            </Card>
        </BorderLayout>
    )
}
