import React from 'react';
import {Link, Txt} from "../../../../../UIkit";
import {styled} from "../../../../../../styles";
import EmailImg from '../../../../../../assets/img/Email.svg'

const BottomSectionStyle = styled('div', {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    gap: '$3'
})

const Info = styled('div', {
    display: 'flex',
    gap: '$4',
    flexWrap: 'wrap',
    '@sm': {
        flexDirection: 'column',
        gap: '0',
        alignItems: 'center'
    }
})

const Divider = styled('div', {
    width: '1px',
    height: '18px',
    background: '#232528',
    borderRadius: '2px',
    '@sm': {
        display: 'none'
    }
})

const Email = styled('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '& img': {
        width: '16px',
        height: '13px'
    }
})

const date = new Date()

const BottomSection = () => {
    return (
        <BottomSectionStyle>
            <Info>
                <Txt secondary1 css={{ fontSize: 14 }}>
                    © {date.getFullYear()} FileMarket.xyz, Inc
                </Txt>
                <Divider />
                <Link footer>Privacy policy</Link>
                <Link footer>Terms of Service</Link>
            </Info>
            <Email>
                <img src={EmailImg}/>
                <Txt secondary1 css={{ fontSize: 14 }}>
                    genesis@filemarket.xyz
                </Txt>
            </Email>
        </BottomSectionStyle>
    );
};

export default BottomSection;