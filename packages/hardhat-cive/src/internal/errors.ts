import type { Link } from './bytecode.js'

import { NomicLabsHardhatPluginError } from 'hardhat/plugins.js'

export class HardhatCiveError extends NomicLabsHardhatPluginError {
  constructor(message: string, parent?: Error) {
    super('hardhat-viem', message, parent)
  }
}

export class NetworkNotFoundError extends HardhatCiveError {
  constructor(chainId: number) {
    super(
      `No network with chain id ${chainId} found. You can override the chain by passing it as a parameter to the client getter:

import { someChain } from "viem/chains";
const client = await hre.viem.getPublicClient({
  chain: someChain,
  ...
});

You can find a list of supported networks here: https://github.com/wevm/viem/blob/main/src/chains/index.ts`,
    )
  }
}

export class MultipleMatchingNetworksError extends HardhatCiveError {
  constructor(chainId: number) {
    super(
      `Multiple networks with chain id ${chainId} found. You can override the chain by passing it as a parameter to the client getter:

import { someChain } from "viem/chains";
const client = await hre.viem.getPublicClient({
  chain: someChain,
  ...
});

You can find a list of supported networks here: https://github.com/wevm/viem/blob/main/src/chains/index.ts`,
    )
  }
}

export class DefaultWalletClientNotFoundError extends HardhatCiveError {
  constructor(networkName: string) {
    super(
      `Default wallet client not found. This can happen if no accounts were configured for this network (network: '${networkName}').

Alternatively, you can set a custom wallet client by passing it as a parameter in the deployContract function:

const walletClient = await hre.viem.getWalletClient(address);
const contractA = await hre.viem.deployContract("A", [], { walletClient });
const contractB = await hre.viem.getContractAt("B", address, { walletClient });`,
    )
  }
}

export class InvalidConfirmationsError extends HardhatCiveError {
  constructor() {
    super(
      'deployContract does not support 0 confirmations. Use sendDeploymentTransaction if you want to handle the deployment transaction yourself.',
    )
  }
}

export class DeployContractError extends HardhatCiveError {
  constructor(txHash: string, blockHash: string) {
    super(
      `The deployment transaction '${txHash}' was mined in block '${blockHash}' but its receipt doesn't contain a contract address`,
    )
  }
}

export class AmbigousLibraryNameError extends HardhatCiveError {
  constructor(
    contractName: string,
    libraryName: string,
    matchingLibraries: string[],
  ) {
    super(
      `The library name "${libraryName}" is ambiguous for the contract "${contractName}".
It may resolve to one of the following libraries:
${matchingLibraries.map((fqn) => `\n\t* ${fqn}`).join(',')}

To fix this, choose one of these fully qualified library names and replace where appropriate.`,
    )
  }
}

export class OverlappingLibraryNamesError extends HardhatCiveError {
  constructor(sourceName: string, libraryName: string) {
    super(
      `The library name "${libraryName}" and "${sourceName}:${libraryName}" are both linking to the same library. Please use one of them, or If they are not the same library, use fully qualified names instead.`,
    )
  }
}

export class UnnecessaryLibraryLinkError extends HardhatCiveError {
  constructor(contractName: string, libraryName: string) {
    super(
      `The library name "${libraryName}" was linked but it's not referenced by the "${contractName}" contract.`,
    )
  }
}

export class MissingLibraryAddressError extends HardhatCiveError {
  constructor(
    contractName: string,
    missingLibraries: Pick<Link, 'sourceName' | 'libraryName'>[],
  ) {
    super(
      `The libraries needed are:
${missingLibraries
  .map(({ sourceName, libraryName }) => `\t* "${sourceName}:${libraryName}"`)
  .join(',\n')}
Please deploy them first and link them while deploying "${contractName}"`,
    )
  }
}

export class UnsupportedNetworkError extends HardhatCiveError {
  constructor() {
    super(
      'hardhat-cive only support conflux mainnet testnet and private network, please add endpoint url to config file',
    )
  }
}
