import {FC, useState} from 'react'
import {useAccount} from 'wagmi'
import { Link, Txt } from '../../../UIkit'
import { PressEvent } from '@react-types/shared/src/events'
import {useSeed} from "../../../processing/SeedProvider/useSeed";
import {useInfoModal} from "../../../hooks/useInfoModal";
import {useSeedProvider} from "../../../processing";
import {observer} from "mobx-react-lite";
import {UnlockSection} from "../ConnectFileWalletDialog/sections/UnlockSection";
import {InfoModal} from "../../Modal/InfoModal";
import {useStores} from "../../../hooks";
import {ViewMnemonicDialog} from "../ViewMnemonicDialog/ViewMnemonicDialog";
export interface ChangeMnemonicButton {
    onPress?: (e: PressEvent) => void
}

export const ViewMnemonicButton: FC<ChangeMnemonicButton> = observer(({ onPress }) => {
    const { dialogStore } = useStores()

    const openWindow = () => {
        dialogStore.openDialog({
            component: ViewMnemonicDialog,
            props: { }
        })
    }


    return (
        <Link
            type="button"
            onPress={(e) => {
                    openWindow()
            }}
        >
            Files wallet seed phrase
        </Link>
    )
})
