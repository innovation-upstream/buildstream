import { expect } from 'chai'
import { ethers } from 'hardhat'

const multiplier = 0.00001
const complexityScore = 0
const requiredConfirmations = 1
const requiredApprovals = 2
const reputationLevel = 1
const dueDate = 10

const getContractInstances = async () => {
  const org = await ethers.getContractFactory('Organization')
  const orgContract = await org.deploy({
    gasLimit: 3e7
  })
  await orgContract.deployed()

  const reputationToken = await ethers.getContractFactory('SBTToken')
  const tokenContract = await reputationToken.deploy()
  await tokenContract.deployed()

  const taskStorage = await ethers.getContractFactory('TaskStorageContract')
  const storageContract = await taskStorage.deploy()
  await storageContract.deployed()

  const task = await ethers.getContractFactory('TaskContract')
  const taskContract = await task.deploy(
    tokenContract.address,
    orgContract.address,
    storageContract.address,
    {
      gasLimit: 3e7
    }
  )
  await taskContract.deployed()
  await tokenContract.updateTaskContractAddress(taskContract.address)

  await storageContract.updateTaskContractAddress(taskContract.address)

  const treasury = await ethers.getContractFactory('Treasury')
  const treasuryContract = await treasury.deploy(
    orgContract.address,
    taskContract.address
  )
  await treasuryContract.deployed()

  await taskContract.updateTreasuryContract(treasuryContract.address)

  return { tokenContract, taskContract, orgContract, treasuryContract }
}

describe('Integration test: Task flow', function () {
  it('Should successfully complete the task flow', async function () {
    const [owner, approver1, approver2, assignee] = await ethers.getSigners()
    const { orgContract, taskContract, tokenContract, treasuryContract } =
      await getContractInstances()

    // Create organization
    const orgCreationEvent = new Promise<any>((resolve, reject) => {
      orgContract.on('Creation', (orgId, event) => {
        event.removeListener()
        resolve({
          orgId: orgId
        })
      })

      setTimeout(() => {
        reject(new Error('timeout'))
      }, 60000)
    })

    await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      ethers.utils.parseUnits(multiplier.toString()),
      ethers.constants.AddressZero,
      [ethers.constants.AddressZero],
      [approver1.address, approver2.address],
      [ethers.constants.AddressZero],
      requiredConfirmations,
      requiredApprovals
    )

    const orgEvent = await orgCreationEvent
    const orgId = orgEvent.orgId.toNumber()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const taskCreationEvent = new Promise<any>((resolve, reject) => {
      taskContract.on('Creation', (taskId, event) => {
        event.removeListener()
        resolve({
          taskId: taskId
        })
      })

      setTimeout(() => {
        reject(new Error('timeout'))
      }, 60000)
    })

    await taskContract
      .connect(approver1)
      .createTask(
        orgId,
        'update ethers version',
        'update ethers version to v2',
        ['golang'],
        complexityScore,
        reputationLevel,
        dueDate
      )

    const taskEvent = await taskCreationEvent
    const taskId = taskEvent.taskId.toNumber()

    // Open task
    await taskContract.connect(approver1)['openTask(uint256)'](taskId)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

    await taskContract
      .connect(approver1)
      .approveAssignRequest(taskId, assignee.address)

    // Submit task
    await taskContract.connect(assignee).submitTask(taskId)
    const initialBalance = await ethers.provider.getBalance(assignee.address)

    // Approvers can confirm task
    await taskContract.connect(approver1).approveTask(taskId)
    await taskContract.connect(approver2).approveTask(taskId)

    // Assignee should receive reward

    const reward = ethers.utils
      .parseUnits(multiplier.toString())
      .mul(1 + complexityScore)
    const newBalance = await ethers.provider.getBalance(assignee.address)
    const expectedBalance = reward.add(initialBalance)
    const isEqual = expectedBalance.eq(newBalance)

    expect(
      await tokenContract['balanceOf(address,uint256,uint256)'](
        assignee.address,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })
})
