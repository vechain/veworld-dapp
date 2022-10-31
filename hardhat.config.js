require("@nomicfoundation/hardhat-toolbox")
require("@vechain.energy/hardhat-thor")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    vechain: {
      url: "https://testnet.veblocks.net",
      //"thor --solo": denial kitchen pet squirrel other broom bar gas better priority spoil cross
      privateKey:
        "0x99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36",
      blockGasLimit: 10000000,
    },
  },
  paths: {
    artifacts: "src/artifacts",
  },
}
