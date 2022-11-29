export class LighthouseService {
  async getMessage(address: string): Promise<string> {
    const params = new URLSearchParams()
    params.set('publicKey', address)
    return await fetch(`https://api.lighthouse.storage/api/auth/get_message?${params}`, {
      mode: 'cors',
      method: 'GET'
    }).then(async resp => {
      const text = await resp.text()
      if (resp.ok) {
        return text
      } else {
        throw new Error(text)
      }
    })
  }

  async getAccessToken(address: string, signedMessage: string): Promise<string> {
    return await fetch('https://api.lighthouse.storage/api/auth/verify_signer', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        publicKey: address,
        signedMessage
      })
    }).then(async resp => {
      if (resp.ok) {
        const json = await resp.json()
        return json.accessToken
      } else {
        throw new Error(await resp.text())
      }
    })
  }
}

export const lighthouseService = new LighthouseService()
