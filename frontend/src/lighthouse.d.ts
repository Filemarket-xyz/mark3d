declare module '@lighthouse-web3/sdk' {
  async function upload(
    // an event fired by <input type="file"> element
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { files: File[] }; persist: () => void },
    // token, obtained via lighthouse api
    accessToken: string,
    uploadProgressCallback: (progress: {
      progress: number
      total: number
      uploaded: number
    }) => void
  ): Promise<{
    data: {
      Name: string
      Size: number
      Hash: string
    }
  }>
}
