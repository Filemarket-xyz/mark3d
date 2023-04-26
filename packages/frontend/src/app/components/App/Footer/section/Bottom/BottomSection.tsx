import React from 'react';
import {Link, Txt} from "../../../../../UIkit";
import Twitter from "../../img/Twitter.svg";
import Telegram from "../../img/Telegram.svg";
import {styled} from "../../../../../../styles";


const SocialsContainer = styled('div', {
    display: 'flex',
    gap: '10px'
})

const SocialImage = styled('img', { width: '32px', height: '32px' })

const Info = styled('div', {
    display: 'flex',
    gap: '$4',
    '@sm': {
        flexDirection: 'column',
        gap: '0',
        alignItems: 'center'
    }
})

const Divider = styled('div', {
    width: '1px',
    height: '18px',
    background: '$gray200',
    borderRadius: '2px',
    '@sm': {
        display: 'none'
    }
})

const date = new Date()

const BottomSection = () => {
    return (
        <div>
            <Info>
                <Txt secondary1 css={{ fontSize: 14 }}>
                    Copyright © {date.getFullYear()} FileMarket
                </Txt>
                <Divider />
                <Link footer>Privacy policy</Link>
                <Link footer>Terms of Service</Link>
            </Info>
            <SocialsContainer>
                <Link
                    href='https://twitter.com/filemarket_xyz'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <SocialImage src={Twitter} />
                </Link>

                <Link
                    href='https://t.me/filemarketchat'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <SocialImage src={Telegram} />
                </Link>

                <Link
                    href='https://t.me/FileMarket_xyz'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <SocialImage src={Telegram} />
                </Link>
            </SocialsContainer>
        </div>
    );
};

export default BottomSection;