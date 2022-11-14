/**
 *
 * ### Процессинг
 * Папка отдана процессингу - некоему набору абстракций (классов, хуков), осуществляющему взаимодействие с бч,
 * реализующему юзкейсы.
 * Фулл дока - https://outline.customapp.tech/doc/proektirovanie-processinga-bTCd9yogEc
 *
 * ### Юзкейсы
 *
 * - Минтинг коллекции
 *
 * - Минтинг NFT в коллекцию
 *
 * - Передача NFT через аукцион
 *
 * - Передача NFT без аукциона
 *
 * - Обработка случаев недобросовестного поведения при передаче nft через аукцион или нет.
 */

export * from './crypto'
export * from './HiddenFileBase'
export * from './HiddenFileBuyer'
export * from './HiddenFileOwner'
export * from './HiddenFileProcessorFactory'
export * from './SecureStorage'
export * from './StatefulCryptoProvider'
export * from './StorageProvider'
export * from './StorageSecurityProvider'
