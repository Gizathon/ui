export const enzymeGraphQuery = `query TokenSwapTransaction($vaultProxy: Address!, $comptrollerProxy: Address!, $exchange: Exchange!, $expectedIncomingAmount: BigInt!, $incoming: Address!, $maxSlippage: Float!, $network: Deployment!, $originAddress: Address, $outgoing: Address!, $quantity: BigInt!, $userAddress: Address!) {
  tokenSwapTransaction(
vaultProxy: $vaultProxy
comptrollerProxy: $comptrollerProxy
exchange: $exchange
expectedIncomingAmount: $expectedIncomingAmount
incoming: $incoming
maxSlippage: $maxSlippage
network: $network
originAddress: $originAddress
outgoing: $outgoing
quantity: $quantity
userAddress: $userAddress
) {
  reason
  status
  transaction {
    data
    to
    value
    __typename
  }
  __typename
  }
}`;

export const enzyGraphQueryVaultBalances = `query VaultBalances($currency: CurrencyOrAddress!, 
$network: Deployment!, 
$vault: Address!) {
  vaultBalances(currency: $currency, network: $network, vault: $vault) {
    asset
    balance
    value
    valid
    price
    __typename
  }
}`;

export const exnzymeGraphQueryUserVaultDetails = `query VaultList($ids: [ID!]!) {
  accounts(where: {id_in: $ids}) {
    id
    depositorSince
    ownerSince
    ownerships(first: 1000) {
      ...VaultListItem
      __typename
    }
    deposits(first: 1000) {
      id
      shares
      vault {
        ...VaultListItem
        __typename
      }
      __typename
    }
    assetManagements {
      ...VaultListItem
      __typename
    }
    __typename
  }
}

fragment VaultListItem on Vault {
  id
  name
  inception
  depositCount
  release {
    id
    __typename
  }
  comptroller {
    id
    denomination {
      ...Asset
      __typename
    }
    __typename
  }
  __typename
}

fragment Asset on Asset {
  id
  name
  symbol
  decimals
  __typename
}`
