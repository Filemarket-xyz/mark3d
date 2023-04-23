import { FC } from 'react'
import {useAccount} from 'wagmi'
import { Link, Txt } from '../../../UIkit'
import { PressEvent } from '@react-types/shared/src/events'
import {useSeed} from "../../../processing/SeedProvider/useSeed";
import {useInfoModal} from "../../../hooks/useInfoModal";
import {useSeedProvider} from "../../../processing";
import {observer} from "mobx-react-lite";
export interface ChangeMnemonicButton {
    onPress?: (e: PressEvent) => void
}

export const ViewMnemonicButton: FC<ChangeMnemonicButton> = observer(({ onPress }) => {
    const { address } = useAccount()
    const mnemonic = useSeed(address)

    const { setModalBody, setModalOpen, setModalHeader } =
        useInfoModal({})

    const { seedProvider } = useSeedProvider(address)

    return (
        <Link
            type="button"
            onPress={(e) => {
                console.log(mnemonic)
                if (mnemonic) {
                    setModalHeader('Your seed-phrases')
                    setModalBody(<Txt h5>{seedProvider?.mnemonic}</Txt>)
                    setModalOpen(true)
                }
            }}
        >
            View mnemonic
        </Link>
    )
})
