import { IHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { HiddenFileProcessorFactory } from '../HiddenFileProcessorFactory/HiddenFileProcessorFactory'

const factory = new HiddenFileProcessorFactory()

export function useHiddenFileProcessorFactory(): IHiddenFileProcessorFactory {
  return factory
}
