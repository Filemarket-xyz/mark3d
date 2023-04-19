import {styled} from "../../../styles";
import {textVariant} from "../Txt";

export const BlueText = styled('h5', {
    ...textVariant('primary2').true,
    color: '$blue500'
})

export const Tag = styled(BlueText, {
    padding: '6px 16px',
    background: '#FFFFFF',
    boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
    borderRadius: '20px'
})