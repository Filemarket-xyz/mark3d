import {styled} from "../../../../../styles";
import {textVariant} from "../../../../UIkit";
import RedirectImg from '../../../../../assets/img/Redirect.svg'
export const PropertyTitle = styled('h2', {
    ...textVariant('h5').true,
    color: '#656669',
    marginBottom: '$3',
    fontWeight: '400'
})

export const P = styled('p', {
    ...textVariant('body4').true,
    color: '$gray800',
    fontWeight: 400
})

export const Link = styled('a', {
    ...textVariant('primary2').true,
    textDecoration: 'none',
    color: '$blue500',
    position: 'relative',
    '&:after': {
        content: `url(${RedirectImg})`,
        position: 'absolute',
        top: 0,
        right: '-20px'
    }
})

export const GridBlock = styled('div')