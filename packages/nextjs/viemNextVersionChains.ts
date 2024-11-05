import { defineChain } from "viem/utils";

// From https://github.com/wevm/viem/blob/36da346561767c5aecccf09b36d3f7a9f99e6844/src/chains/definitions/sapphire.ts
export const sapphire = /*#__PURE__*/ defineChain({
  id: 23294,
  name: "Oasis Sapphire",
  network: "sapphire",
  nativeCurrency: { name: "Sapphire Rose", symbol: "ROSE", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://sapphire.oasis.io"],
      webSocket: ["wss://sapphire.oasis.io/ws"],
    },
    public: {
      http: ["https://sapphire.oasis.io"],
      webSocket: ["wss://sapphire.oasis.io/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasis Explorer",
      url: "https://explorer.oasis.io/mainnet/sapphire",
    },
    blockscout: {
      name: "Oasis Sapphire Explorer",
      url: "https://old-explorer.sapphire.oasis.io",
      apiUrl: "https://old-explorer.sapphire.oasis.io/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 734531,
    },
  },
});

// https://github.com/wevm/viem/blob/36da346561767c5aecccf09b36d3f7a9f99e6844/src/chains/definitions/sapphireTestnet.ts
export const sapphireTestnet = /*#__PURE__*/ defineChain({
  id: 23295,
  name: "Oasis Sapphire Testnet",
  network: "sapphire-testnet",
  nativeCurrency: { name: "Sapphire Test Rose", symbol: "TEST", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet.sapphire.oasis.dev"],
      webSocket: ["wss://testnet.sapphire.oasis.dev/ws"],
    },
    public: {
      http: ["https://testnet.sapphire.oasis.dev"],
      webSocket: ["wss://testnet.sapphire.oasis.dev/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasis Explorer",
      url: "https://explorer.oasis.io/testnet/sapphire",
    },
    blockscout: {
      name: "Oasis Sapphire Testnet Explorer",
      url: "https://testnet.old-explorer.sapphire.oasis.dev",
      apiUrl: "https://testnet.old-explorer.sapphire.oasis.dev/api",
    },
  },
  testnet: true,
});

export const sapphireLocalnet = /*#__PURE__*/ defineChain({
  id: 23293,
  name: "Oasis Sapphire Localnet",
  network: "sapphire-localnet",
  nativeCurrency: { name: "Sapphire Local Rose", symbol: "TEST", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasis Explorer",
      url: "http://localhost:3000/testnet/sapphire",
    },
  },
  testnet: true,
});

export const emerald = /*#__PURE__*/ defineChain({
  id: 42262,
  name: "Oasis Emerald",
  network: "emerald",
  nativeCurrency: { name: "Emerald Rose", symbol: "ROSE", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://emerald.oasis.io"],
      webSocket: ["wss://emerald.oasis.io/ws"],
    },
    public: {
      http: ["https://emerald.oasis.io"],
      webSocket: ["wss://emerald.oasis.io/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasis Explorer",
      url: "https://explorer.oasis.io/mainnet/emerald",
    },
    blockscout: {
      name: "Oasis Emerald Explorer",
      url: "https://old-explorer.emerald.oasis.io",
      apiUrl: "https://old-explorer.emerald.oasis.io/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 1481392,
    },
  },
});

export const emeraldTestnet = /*#__PURE__*/ defineChain({
  id: 42261,
  name: "Oasis Emerald Testnet",
  network: "emerald-testnet",
  nativeCurrency: { name: "Emerald Test Rose", symbol: "TEST", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet.emerald.oasis.dev"],
      webSocket: ["wss://testnet.emerald.oasis.dev/ws"],
    },
    public: {
      http: ["https://testnet.emerald.oasis.dev"],
      webSocket: ["wss://testnet.emerald.oasis.dev/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasis Explorer",
      url: "https://explorer.oasis.io/testnet/emerald",
    },
    blockscout: {
      name: "Oasis Emerald Testnet Explorer",
      url: "https://testnet.old-explorer.emerald.oasis.dev",
      apiUrl: "https://testnet.old-explorer.emerald.oasis.dev/api",
    },
  },
  testnet: true,
});
