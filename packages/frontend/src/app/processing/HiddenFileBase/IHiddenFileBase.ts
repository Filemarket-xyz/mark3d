import { IStatefulCryptoProvider } from '../StatefulCryptoProvider'

export interface IHiddenFileBase {
  readonly cryptoProvider: IStatefulCryptoProvider
  readonly surrogateId: string
}
