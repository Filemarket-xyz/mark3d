import { Modal } from '@nextui-org/react'
import { useHookToCallback } from '../../../hooks/useHookToCallback'
import { useStatusModal } from '../../../hooks/useStatusModal'
import { ModalTitle } from '../../Modal/Modal'
import {usePlaceOrder} from "../../../processing/hooks";
import {AppDialogProps} from "../../../utils/dialog";
import {styled} from "../../../../styles";
import {Button, ToolCard, Txt} from "../../../UIkit";
import React from "react";
import {ToolCardContent, ToolCardInfo, ToolTitle, ToolDescription} from "../../../pages/MainPage/Blocks/WelcomeBlock";
import {rootStore} from "../../../stores/RootStore";
import {InputWindow} from "../InputWindow/InputWindow";
import {useDisconnect} from "wagmi";
import {onCreateAccountButtonHandle, onImportAccountButtonHandle} from "./utils/functions";
import {validateImportMnemonic} from "./utils/validate";

const ConnectWalletWindowContentStyle = styled('div', {
    fontSize: '12px',
    '& .headText': {
        textAlign: 'center',
        paddingBottom: '1em'
    },
    '& .mainContent': {
        display: 'flex',
        '& svg': {
            width: '8.33em',
            height: '8.33em'
        },
        justifyContent: 'center',
        gap: '1em',
        '& button': {
            background: 'white'
        }
    },
    paddingBottom: '2em',
    '@md': {
        fontSize: '10px'
    },
    '@sm': {
        '& .mainContent': {
            fontSize: '8px',
            flexDirection: 'column'
        }
    }
})

const ConnectWalletWindowStyle = styled('div', {
    background: 'red',
    '& .nextui-backdrop-content': {
        maxWidth: 'inherit'
    }
})

const ToolCardConnectWallet = styled(ToolCard, {
    width: '29em',
    '@sm': {
        width: '100%'
    }
})

const ToolCardContentWallet = styled(ToolCardContent, {
    '@sm': {
        minHeight: '250px'
    }
})

type ConnectWalletWindowProps = AppDialogProps<{
    callback?: () => void
}>

export const ConnectWalletWindow = ({ callback, open, onClose }: ConnectWalletWindowProps) => {
    const { placeOrder, ...statuses } = useHookToCallback(usePlaceOrder, 'placeOrder', { callbackOk: callback })
    const { disconnect } = useDisconnect()
    const { isLoading } = statuses
    const { modalProps } = useStatusModal({
        statuses,
        okMsg: 'Order placed! Now be ready to transfer hidden files, if someone fulfills the order.',
        loadingMsg: 'Placing order'
    })

    const openImportAccountDialog = () => {
        rootStore.dialogStore.openDialog({
            component: InputWindow,
            props: {
                onCloseCallback: () => {disconnect()},
                textContent: <Txt h4>Input Seed Phrase</Txt>,
                onPressButton: async (value) => {onImportAccountButtonHandle(value)},
                validateFunc: (value: string): 'valid' | 'invalid' => {
                    return validateImportMnemonic(value) === 'valid' ? 'valid' : 'invalid'
                },
                buttonText: <Txt h4>Import</Txt>
            }
        })
    }

    return (
        <ConnectWalletWindowStyle>
            <Modal
                closeButton
                open={open}
                onClose={() => {
                    disconnect()
                    onClose()
                }}
                width={'inherit'}
                css={{
                    width: '900px',
                    margin: '0 auto'
                }}
            >
                <ModalTitle>Подключение аккаунта</ModalTitle>
                <Modal.Body>
                    <ConnectWalletWindowContentStyle>
                        <div className="headText">
                            <Txt h3>Create or Import Account</Txt>
                        </div>
                        <div className="mainContent">
                            <div className="section">
                                <ToolCardConnectWallet>
                                    <ToolCardContentWallet>
                                        <ToolCardInfo>
                                            <ToolTitle style={{textAlign: 'center'}}>Create Account</ToolTitle>
                                            <ToolDescription style={{textAlign: 'center'}}>
                                                Создайте новый аккаунт
                                            </ToolDescription>
                                        </ToolCardInfo>
                                        <Button onClick={() => {
                                            onCreateAccountButtonHandle()
                                        }}>
                                            Create
                                        </Button>
                                    </ToolCardContentWallet>
                                </ToolCardConnectWallet>
                            </div>
                            <div className="section">
                                    <ToolCardConnectWallet>
                                        <ToolCardContentWallet>
                                            <ToolCardInfo>
                                                <ToolTitle style={{textAlign: 'center'}}>Import Account</ToolTitle>
                                                <ToolDescription style={{textAlign: 'center'}}>
                                                    Импортируйте ваш аккаунт, используя seed-фразу, полученную при регистрации
                                                </ToolDescription>
                                            </ToolCardInfo>
                                            <Button onClick={() => {
                                                openImportAccountDialog()
                                            }}>
                                                Import
                                            </Button>
                                        </ToolCardContentWallet>
                                    </ToolCardConnectWallet>
                            </div>
                        </div>
                    </ConnectWalletWindowContentStyle>
                </Modal.Body>
            </Modal>
        </ConnectWalletWindowStyle>
    )
}
