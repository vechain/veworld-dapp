const { VECHAIN_URL_SOLO } = require("@vechainfoundation/hardhat-vechain")
require("@vechainfoundation/hardhat-ethers")

module.exports = {
  solidity: {
    version: "0.8.17",
  },
  networks: {
    vechain: {
      url: VECHAIN_URL_SOLO,
    },
  },
  paths: {
    artifacts: "src/artifacts",
  },
}
