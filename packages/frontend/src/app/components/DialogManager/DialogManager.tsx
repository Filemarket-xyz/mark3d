import { observer } from 'mobx-react-lite'
import { useStores } from '../../hooks'

export const DialogManager = observer((): JSX.Element => {
  const { dialogStore } = useStores()
  return (
    <>
      {
        dialogStore.open.map(instance => {
          const onClose = () => {
            dialogStore.closeDialogById(instance.id)
            if (instance.onClosed) {
              instance.onClosed()
            }
          }
          return (
            <instance.component
              {...instance.props}
              key={instance.id}
              open
              onClose={onClose}
            >
            </instance.component>
          )
        })
      }
    </>
  )
})
