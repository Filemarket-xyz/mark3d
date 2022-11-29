import { useAccount, useSigner } from 'wagmi'
import { useCallback } from 'react'
import lighthouse from '@lighthouse-web3/sdk'
import { assertSigner } from '../utils/assert'
import assert from 'assert'
import { lighthouseService } from '../../services/LighthouseService'

export function useUploadLighthouse() {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  return useCallback((file: File) => {
    assertSigner(signer)
    assert(address, 'user is not connected')
    const getAccessToken = async () => {
      const message = await lighthouseService.getMessage(address)
      const signedMessage = await signer.signMessage(message) // Sign message
      return await lighthouseService.getAccessToken(address, signedMessage)
    }

    const accessToken = await getAccessToken()

    const output = await lighthouse.upload({ target: { files: [file] } }, accessToken)

    return {
      url: `ipfs://${output.Hash}`,
      cid: output.Hash
    }
  }, [signer, address])
}
