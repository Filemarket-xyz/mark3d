export function assertContract<Contract>(contract: Contract, contractName: string): asserts contract {
  if (!contract) {
    throw Error(`${contractName} is undefined. Please, try again`)
  }
}

export function assertSigner<Signer>(signer: Signer): asserts signer {
  if (!signer) {
    throw Error('User must have connected wallet to call contracts')
  }
}

export function assertAccount(account?: string): asserts account {
  if (!account) {
    throw new Error('need to connect wallet')
  }
}

export function assertCollection(collectionAddress?: string): asserts collectionAddress {
  if (!collectionAddress) {
    throw new Error('collectionAddress is not provided')
  }
}

export function assertTokenId(tokenId?: string): asserts tokenId {
  if (!tokenId) {
    throw new Error('tokenId is not provided')
  }
}

export function assertSeed(seed?: ArrayBuffer): asserts seed {
  if (!seed) {
    throw new Error('seed not found')
  }
}
