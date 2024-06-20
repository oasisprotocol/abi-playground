notes

- [x] ROSY
  http://localhost:3000/?contractAddress=0x6665a6Cae3F52959f0f653E3D04270D54e6f13d8&network=23294
  https://old-explorer.sapphire.oasis.io/address/0x6665a6Cae3F52959f0f653E3D04270D54e6f13d8/read-contract#address-tabs

- [x] TryEmitTypes
  https://explorer.oasis.io/mainnet/emerald/address/0xEF15601B599F5C0696E38AB27f100c4075B36150
  http://localhost:3000/?contractAddress=0xEF15601B599F5C0696E38AB27f100c4075B36150&network=42262

- [x] supports nested structs
  http://localhost:3000/?contractAddress=0xEF15601B599F5C0696E38AB27f100c4075B36150&network=42262&methods=emitEvent2

- [ignore] DOM errors
  http://localhost:3000/?contractAddress=0xEF15601B599F5C0696E38AB27f100c4075B36150&network=42262&methods=emitEvent1%2CemitEvent2%2CemitUnnamed


- [x] asks to switch chain in metamask

- [x] validates inputs:
  "1" in uint256[]
  Value "1" is not a valid array.

- [ignore] doesn't display arrays like nested struct

- [x] large number validation is good
  -5789604461865809771178549250434395392663499233282028201972879200395656481996811
  `Number "-5.78960446186581e+78" is not in safe 256-bit signed integer range (-57896044618658097711785492504343953926634992332820282019728792003956564819968 to 57896044618658097711785492504343953926634992332820282019728792003956564819967)`

  true
  -5789604461865809771178549250434395392663499233282028201972879200395656481996811
  works


- [x] boolean validation is bad
  http://localhost:3000/?contractAddress=0xEF15601B599F5C0696E38AB27f100c4075B36150&network=42262&methods=emitEvent1%2CemitEvent2%2CemitUnnamed

  _booleanValue: 2  or  truee
  _integerValue: -121342343333331111111111111111111111111111
  _unsignedIntegerValue: 12311111111111111
  _addr: 0xC3ecf872F643C6238Aa20673798eed6F7dA199e9
  _b32: 0x7465737400000000000000000000000000000000000000000000000000000000 / "test"
  _str: test
  `The contract function "emitEvent1" reverted.`
  `invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field TransactionArgs.data of type hexutil.Bytes`
[ignore] it doesn't show an error anymore after workaround to avoid simulating contract write

  updated viem validates it https://github.com/wevm/viem/commit/4d52c74d318daf4eebb0dae43f581aa20ef62118
  could make checkbox https://github.com/scaffold-eth/scaffold-eth-2/blob/18dd946e961ac7bdf2a47cea4c5b21872750c223/packages/nextjs/app/debug/_components/contract/ContractInput.tsx#L37

  upstream:
    https://abi.ninja/0x0635513f179D50A207757E05759CbD106d7dFcE8/11155111?methods=setController
    https://abi.ninja/0xfed6a969aaa60e4961fcd3ebf1a2e8913ac65b72/11155111?methods=makeCommitment%2Cregister

- [x] crashes if you type "0." into deposit, but not into withdrawal
  https://abi-playground.oasis.io/?contractAddress=0xB759a0fbc1dA517aF257D5Cf039aB4D86dFB3b94&network=23295&methods=balanceOf%2Cwithdraw%2Cdeposit
  no issue upstream https://abi.ninja/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/1?methods=deposit

- [ ] wallet connect sometimes gets stuck:
  - incognito open https://abi-playground.oasis.io/?contractAddress=0xB759a0fbc1dA517aF257D5Cf039aB4D86dFB3b94&network=23295&methods=balanceOf%2Cwithdraw%2Cdeposit
  - wallet connect
  - scan qr code in metamask app and connect
  - try to deposit
  - just keeps "Awaiting for user confirmation" without a prompt
- [ ] same on mobile chrome: click send, choose metamask, asks what app to open with, choose metamask, get into metamask, confirm allow connecting, get back into chrome, click send again, confirm switching network in metamask, get back into chrome, click send again, just keeps "Awaiting for user confirmation" without a prompt

- [ ] page started using full cpu after completing withdraw through walletconnect


- [ ] displayed icons are blocks, not jazzicons
- [ ] rm blockexplorer.html?

- [ ] supports proxy contracts
    says so
    check it on sapphire

- [ ] make encrypted txs


Connects to
  walletconnect.com
  anyabi.xyz (gets data from Etherscan, Routescan, Sourcify)
    sometimes slow
  ~Etherscan~ removed
  ~Alchemy~ removed
- [ ] use oasis nexus as ABI source first

- [x] sapphire doesn't work
    sender is zero
    "ERC20: burn from the zero address"
    https://abi-playground.oasis.io/?contractAddress=0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3&network=23294&methods=deposit%2Cwithdraw%2CbalanceOf

    https://github.com/wevm/wagmi/commit/c2af20b88cf16970d087faaec10b463357a5836e
      supportsSimulation

    packages/nextjs/node_modules/@wagmi/core/dist/chunk-TSH6VVF4.js
      if (config2.mode === "prepared") {
    Fixed in https://github.com/oasisprotocol/sapphire-abi-playground/commit/6da59d45ca125152689f43ca5661903d72f25a77


- [x] subpage doesn't work after reload
  https://abi-playground.oasis.io/?contractAddress=0xcA11bde05977b3631167028862bE2a173976CA11&network=23294

- [x] will nested structs get evm-parsed on explorer?
  yes on PRD https://github.com/oasisprotocol/oasis-wallet-web/wiki/lukaw3d-bookmarklets#switch-to-nexusprd-api
  https://explorer.oasis.io/mainnet/emerald/tx/0x8c3de7ea493e6ce9c7a8f100739a144e588eb295dcfc2fd845ea1c0e4586e173
    [1] a 2 [3,4]
  https://explorer.oasis.io/mainnet/emerald/tx/0xc3e82da39628e0a95f47bae5a9c45c5332860d683e3fbe823b91ac24b30756dd
    [65535, 65535] 65535
  https://explorer.oasis.io/mainnet/emerald/tx/0x8c4ac733390969f55df6c2acff671028175a90dd26d1c490ca863a2d7e645f03
    true
    -57896044618658097711785492504343953926634992332820282019728792003956564819968
    12311111111111111
    0xC3ecf872F643C6238Aa20673798eed6F7dA199e9
    0x7465737400000000000000000000000000000000000000000000000000000000
    test
