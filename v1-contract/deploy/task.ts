/* eslint-disable node/no-unpublished-import */
import { ethers } from 'hardhat'
const { readJson } = require('../utils/helpers.ts')
const fs = require('fs')
const path = require('path')

async function main() {
  const contract = await ethers.getContractFactory('TaskContract')

  const OrgContract = readJson(
    path.join(__dirname, '../../app/src/contracts/Org.json')
  )
  const SBTToken = readJson(
    path.join(__dirname, '../../app/src/contracts/Token.json')
  )
  const Storage = readJson(
    path.join(__dirname, '../../app/src/contracts/TaskStorage.json')
  )

  const contractInstance = await contract.deploy(
    SBTToken.address,
    OrgContract.address,
    Storage.address
  )

  await contractInstance.deployed()

  console.log('Task contract deployed to:', contractInstance.address)

  const data = {
    address: contractInstance.address,
    abi: JSON.parse(contractInstance.interface.format('json') as string)
  }
  fs.writeFileSync(
    path.join(__dirname, '../../app/src/contracts/Task.json'),
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
