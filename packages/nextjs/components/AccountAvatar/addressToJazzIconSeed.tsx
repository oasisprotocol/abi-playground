const ethAddressToSeed = (address_eth: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L20-L25
  // https://github.com/MetaMask/metamask-extension/blob/v10.7.0/ui/helpers/utils/icon-factory.js#L84-L88
  const addr = address_eth.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
};

export function addressToJazzIconSeed(account: { address_eth: `0x${string}` }) {
  return ethAddressToSeed(account.address_eth);
}
