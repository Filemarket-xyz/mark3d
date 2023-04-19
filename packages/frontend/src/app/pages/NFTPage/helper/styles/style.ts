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

export const GridBlock = styled('div')