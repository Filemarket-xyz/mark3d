import { observer } from 'mobx-react-lite'
import { Button, PageLayout } from '../../UIkit'
import { Input } from '../../UIkit/Form/Input'
import {
  Form,
  FormControl,
  Label,
  Title
} from '../CreatePage/CreateCollectionPage'
import { ChangeEventHandler, FormEventHandler, useCallback, useState } from 'react'
import { useStores } from '../../hooks'
import { stringifyError } from '../../utils/error'

interface FormState {
  address: string
  word: string
}

export const HackathonFormPage = observer(() => {
  const [form, setForm] = useState<FormState>({ address: '', word: '' })
  const { dialogStore } = useStores()

  const handleAddress = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    const address = event.target.value
    setForm({ ...form, address })
  }, [form, setForm])

  const handleWord = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    const word = event.target.value
    setForm({ ...form, word })
  }, [form, setForm])

  const handleSubmit = useCallback<FormEventHandler>((event) => {
    event.preventDefault()
    const searchParams = new URLSearchParams()
    searchParams.set('address', form.address)
    searchParams.set('word', form.word)
    fetch(`http://localhost:9300/api/invoke_count_matches?${searchParams}`, {
      method: 'POST'
    }).then(resp => {
      if (resp.ok) {
        dialogStore.showSuccess('Form submitted!')
      } else {
        void resp.text().then(text => {
          dialogStore.showError(`An error occurred: ${text}`)
        })
      }
    }).catch(err => {
      dialogStore.showError(`An error occurred: ${stringifyError(err)}`)
    })
  }, [form])
  return (
    <PageLayout
      css={{
        minHeight: '100vh',
        paddingBottom: '$4'
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Title>Hack FEVM demo</Title>

        {/* <FormControl> */}
        {/*  <Label css={{ marginBottom: '$3' }}>Upload an image</Label> */}
        {/*  <ImageLoader /> */}
        {/* </FormControl> */}

        <FormControl>
          <Label>Address</Label>
          <Input placeholder='0xDFF3...B4' onChange={handleAddress} />
        </FormControl>

        <FormControl>
          <Label>Word</Label>
          <Input placeholder='Any string' onChange={handleWord} />
        </FormControl>

        <Button type='submit' primary>
          Submit
        </Button>
      </Form>
    </PageLayout>
  )
})
