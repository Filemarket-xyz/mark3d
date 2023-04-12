import { Tooltip } from '@nextui-org/react';
import React from 'react';
import {styled} from "../../../styles";
import {Button, Txt} from '../../UIkit';
import FakeMintNftSection from "./FakeMintNftSection/FakeMintNftSection";

const FakeMintStyle = styled('div', {
    background: 'linear-gradient(9.52deg, #55A8E7 7.18%, #4AC6D1 92.82%)',
    backgroundBlendMode: 'overlay, normal',
    mixBlendMode: 'normal',
    width: '100vw',
    minHeight: '992px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    color: 'white',
    padding: '160px 0 80px',
    '& a': {
        color: 'white'
    },
    '& .topText': {
        marginBottom: '24px'
    },
    '& .buttons': {
        maxWidth: '1590px',
        margin: '48px 120px 0',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',

        '& button': {
            color: '$blue500',
            width: '40vw',
            height: '60px',
            background: 'white',
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
            borderRadius: '24px',
            textDecoration: 'dashed',
            textDecorationLine: 'underline',
            textUnderlineOffset: '5px'
        }
    },
    '@xl': {
        '& .buttons': {
            '& button': {
                width: '37vw',
            }
        },
    },
    '@lg': {
        '& .buttons': {
            '& button': {
                width: '35vw',
            }
        },
    },
    '@md': {
        '& .buttons': {
            '& button': {
                width: '100%',
            }
        },
    },
    '@sm': {
        '& .buttons': {
            padding: '20px 0 0',
            '& button': {
                margin: '0 auto',
                width: '300px'
            }
        },
    }
})

const FakeMint = () => {
    return (
        <FakeMintStyle>
            <div className="topText">
                <Txt h1><a href={'/'}>FileBunnies</a> Minting</Txt>
            </div>
            <FakeMintNftSection/>
            <div className="buttons">
                <Tooltip content={"Все подписываемся на канал демона и андроида!!!"} rounded color="primary">
                    <Button>How NFT with EFT works?</Button>
                </Tooltip>
                <Tooltip content={"Потому что нам не похуй на андроида!!!"} rounded color="primary">
                    <Button>How to MINT FileBunnies?</Button>
                </Tooltip>
            </div>
        </FakeMintStyle>
    );
};

export default FakeMint;