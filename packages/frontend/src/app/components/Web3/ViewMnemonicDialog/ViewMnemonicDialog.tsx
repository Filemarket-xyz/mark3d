import React, {useState} from 'react';
import {useMediaMui} from "../../../hooks/useMediaMui";
import {Modal} from "@nextui-org/react";
import {ModalTitle} from "../../Modal/Modal";
import {AppDialogProps} from "../../../utils/dialog";
import {Txt} from "../../../UIkit";
import {UnlockSection} from "../ConnectFileWalletDialog/sections/UnlockSection";
import {useAccount} from "wagmi";
import {useSeedProvider} from "../../../processing";
import {styled} from "../../../../styles";

const MnemonicStyle = styled('div', {
    paddingBottom: '16px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
})

export function ViewMnemonicDialog({ open, onClose }: AppDialogProps<{}>): JSX.Element{
    const { adaptive } = useMediaMui()
    const { address } = useAccount()
    const [canWatch, setCanWatch] = useState<boolean>(false)
    const { seedProvider } = useSeedProvider(address)
    return (
        <Modal
            closeButton
            aria-labelledby='modal-title'
            open={open}
            onClose={onClose}
            width={adaptive({
                sm: !canWatch ? '300px' : '400px',
                md: !canWatch ? '300px' : '650px',
                lg: !canWatch ? '400px' : '950px',
                defaultValue: !canWatch ? '500px' : '950px'
            })}
        >
            <ModalTitle>{canWatch && 'Your seed-phrases'}</ModalTitle>
            <Modal.Body>{canWatch ? <MnemonicStyle><Txt h5>{seedProvider?.mnemonic}</Txt></MnemonicStyle> : <UnlockSection onSuccess={() => {
            console.log('SUCCESS')
            setCanWatch(true)
            }}/>}</Modal.Body>
        </Modal>
    )
};