import { observer } from 'mobx-react-lite'

import { useStores } from '../../hooks'

export const DialogManager = observer((): JSX.Element => {
  const { dialogStore } = useStores()

  return (
    <>
      {
        dialogStore.instances.map(instance => {
          const onClose = () => {
            dialogStore.closeDialogById(instance.id)
          }

          // instance.onClosed is called inside closeDialogById
          return (
            <instance.component
              {...instance.props}
              key={instance.id}
              open={instance.open}
              onClose={onClose}
            />
          )
        })
      }
    </>
  )
})
