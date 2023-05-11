/* eslint-disable node/no-unpublished-import */
import { ethers } from 'hardhat'
const path = require('path')
const { waitForInput, readJson } = require('../utils/helpers.ts')

async function main() {
  await waitForInput('Contracts: initialize contracts')

  const taskLib = readJson(
    path.join(__dirname, '../../app/src/contracts/TaskLibrary.json')
  )
  const taskLogicLib = readJson(
    path.join(__dirname, '../../app/src/contracts/TaskControlLogicLibrary.json')
  )
  const OrgContract = readJson(
    path.join(__dirname, '../../app/src/contracts/Org.json')
  )
  const SBTToken = readJson(
    path.join(__dirname, '../../app/src/contracts/Token.json')
  )
  const TaskStorage = readJson(
    path.join(__dirname, '../../app/src/contracts/TaskStorage.json')
  )
  const Task = readJson(
    path.join(__dirname, '../../app/src/contracts/Task.json')
  )
  const Action = readJson(
    path.join(__dirname, '../../app/src/contracts/Action.json')
  )
  const Treasury = readJson(
    path.join(__dirname, '../../app/src/contracts/Treasury.json')
  )
  const Team = readJson(
    path.join(__dirname, '../../app/src/contracts/Team.json')
  )

  const org = await ethers.getContractFactory('Organization')
  const orgContract = await org.attach(OrgContract.address)

  const token = await ethers.getContractFactory('SBTToken')
  const tokenContract = await token.attach(SBTToken.address)

  const task = await ethers.getContractFactory('TaskContract', {
    libraries: {
      TaskControlLogicLibrary: taskLogicLib.address
    }
  })
  const taskContract = await task.attach(Task.address)

  const taskStorage = await ethers.getContractFactory('TaskStorageContract', {
    libraries: {
      TaskLibrary: taskLib.address
    }
  })
  const taskStorageContract = await taskStorage.attach(TaskStorage.address)

  const treasury = await ethers.getContractFactory('Treasury')
  const treasuryContract = await treasury.attach(Treasury.address)

  const team = await ethers.getContractFactory('TeamContract')
  const teamContract = await team.attach(Team.address)

  const postdeploySteps = [
    {
      func: () => orgContract.updateActionContract(Action.address),
      message: 'Organization: update action contract address'
    },
    {
      func: () => orgContract.updateTreasuryContract(Treasury.address),
      message: 'Organization: update treasury contract address'
    },
    {
      func: () => taskContract.updateTreasuryContract(Treasury.address),
      message: 'Task: update treasury contract address'
    },
    {
      func: () => taskContract.updateTeamContract(Team.address),
      message: 'Task: update team contract address'
    },
    {
      func: () => tokenContract.updateTaskContractAddress(Task.address),
      message: 'Token: update task contract address'
    },
    {
      func: () => taskStorageContract.updateTaskContractAddress(Task.address),
      message: 'Task Storage: update task contract address'
    },
    {
      func: () => treasuryContract.updateTaskContractAddress(Task.address),
      message: 'Treasury: update task contract address'
    },
    {
      func: () =>
        teamContract.updateTaskStorageContractAddress(TaskStorage.address),
      message: 'Team: update task contract address'
    }
  ]

  for (let i = 0; i < postdeploySteps.length; i++) {
    const step = postdeploySteps[i]
    try {
      await waitForInput(step.message)
    } catch {
      continue
    }
    const tx = await step.func()
    await tx.wait()
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
