declare module '*.module.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

declare module '@lighthouse-web3/sdk' {
  async function upload(
    // an event fired by <input type="file"> element
    e: React.ChangeEvent<HTMLInputElement> | { target: { files: File[] } },
    // token, obtained via lighthouse api
    accessToken: string,
    uploadProgressCallback: (progress: {
      progress: number
      total: number
      uploaded: number
    }) => void = null,
  ): Promise< {
    Name: string
    Size: number
    Hash: string
  }>
}
