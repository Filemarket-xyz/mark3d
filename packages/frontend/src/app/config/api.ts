import { Api, ApiConfig } from '../../swagger/Api'

const apiConfig: ApiConfig = {
  baseUrl: '/api'
}

export const api = new Api(apiConfig)
