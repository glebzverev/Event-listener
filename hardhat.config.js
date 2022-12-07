require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");

require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY
const endpoint = process.env.URL
const apiKeyEtherscan = process.env.API_KEY_ETHERSCAN

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "ethereum",
  networks: {
    hardhat: {
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    ethereum: {
      url: `${endpoint}`,
      accounts: [`0x${privateKey}`]
    },
  },
  etherscan: {
    apiKey: {
      etherscanApiKey: apiKeyEtherscan
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};