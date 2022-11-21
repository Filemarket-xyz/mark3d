export function assertContract<Contract>(contract: Contract, contractName: string): asserts contract {
  if (!contract) {
    throw Error(`${contractName} is undefined. Please, try again`)
  }
}

export function assertSigner<Signer>(signer: Signer): asserts signer {
  if (!signer) {
    throw Error('User must have connected wallet to create collection')
  }
}
