// eslint-disable-next-line node/no-unpublished-import
import { ethers } from 'hardhat'
const fs = require('fs')
const path = require('path')
const { readJson } = require('../utils/helpers.ts')

async function main() {
  const contract = await ethers.getContractFactory('ActionContract')

  const OrgContract = readJson(
    path.join(__dirname, '../../app/src/contracts/Org.json')
  )
  const contractInstance = await contract.deploy(OrgContract.address)

  await contractInstance.deployed()

  console.log('Action contract deployed to:', contractInstance.address)

  const data = {
    address: contractInstance.address,
    abi: JSON.parse(contractInstance.interface.format('json') as string)
  }
  fs.writeFileSync(
    path.join(__dirname, '../../app/src/contracts/Action.json'),
    JSON.stringify(data, null, 2)
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

export default main
