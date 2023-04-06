import * as dotenv from 'dotenv'

import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import { HardhatUserConfig, task } from 'hardhat/config'
import 'solidity-coverage'
require('hardhat-contract-sizer')

dotenv.config({ path: '.env.example' })
dotenv.config({ override: true })

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const {
  PRIVATE_KEY = '',
  ALCHEMY_API_KEY = '',
  ALCHEMY_MUMBAI_API_KEY = ''
} = process.env
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      // url: `https://goerli.infura.io/v3/9d07ec1f6bc34391931225ed84d8f7b0`,
      gasPrice: 20000000000,
      gas: 2100000,
      accounts: [PRIVATE_KEY]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_MUMBAI_API_KEY}`,
      chainId: 80001,
      gasPrice: 2000000000,
      gas: 2100000,
      accounts: [PRIVATE_KEY]
    },
    ganache: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      gasPrice: 20000000000,
      gas: 2100000
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD'
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}

export default config
