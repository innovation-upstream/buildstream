import { expect } from 'chai'
import { ethers } from 'hardhat'

const rewardSlashDivisor = 20
const slashRewardEvery = 1
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

  return {
    tokenContract,
    taskContract,
    orgContract,
    treasuryContract,
    storageContract
  }
}

describe('Integration test: Task flow', function () {
  it('Should successfully complete the task flow', async function () {
    const [owner, approver1, approver2, assignee] = await ethers.getSigners()
    const {
      orgContract,
      taskContract,
      tokenContract,
      treasuryContract,
      storageContract
    } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [ethers.constants.AddressZero],
      [approver1.address, approver2.address],
      [ethers.constants.AddressZero]
    )

    const orgCreateReceipt = await createOrgTx.wait()
    const orgCreateEvent = orgCreateReceipt?.events?.find(
      (e: any) => e.event === 'OrganizationCreation'
    )
    const orgId = orgCreateEvent?.args?.[0]?.toNumber()

    const addOrgConfigTx = await orgContract.addOrgConfig(
      orgId,
      ethers.utils.parseUnits(multiplier.toString()),
      ethers.constants.AddressZero,
      requiredConfirmations,
      requiredApprovals,
      rewardSlashDivisor,
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        orgId,
        'update ethers version',
        'update ethers version to v2',
        ['golang'],
        complexityScore,
        reputationLevel,
        (await ethers.provider.getBlockNumber()) + dueDate
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

    await taskContract
      .connect(approver1)
      .approveAssignRequest(taskId, assignee.address)

    // Submit task
    await taskContract
      .connect(assignee)
      .submitTask(taskId, 'https://github.com')
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

  it('Should successfully slash reward', async function () {
    const [owner, approver1, approver2, assignee] = await ethers.getSigners()
    const {
      orgContract,
      taskContract,
      tokenContract,
      treasuryContract,
      storageContract
    } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [ethers.constants.AddressZero],
      [approver1.address, approver2.address],
      [ethers.constants.AddressZero]
    )

    const orgCreateReceipt = await createOrgTx.wait()
    const orgCreateEvent = orgCreateReceipt?.events?.find(
      (e: any) => e.event === 'OrganizationCreation'
    )
    const orgId = orgCreateEvent?.args?.[0]?.toNumber()

    const addOrgConfigTx = await orgContract.addOrgConfig(
      orgId,
      ethers.utils.parseUnits(multiplier.toString()),
      ethers.constants.AddressZero,
      requiredConfirmations,
      requiredApprovals,
      rewardSlashDivisor,
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const taskDueDate = (await ethers.provider.getBlockNumber()) + dueDate
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        orgId,
        'update ethers version',
        'update ethers version to v2',
        ['golang'],
        complexityScore,
        reputationLevel,
        taskDueDate
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )
    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

    await taskContract
      .connect(approver1)
      .approveAssignRequest(taskId, assignee.address)

    const blocksToMine =
      taskDueDate + 5 - (await ethers.provider.getBlockNumber())
    await ethers.provider.send('hardhat_mine', [
      `0x${(blocksToMine >= 0 ? blocksToMine : 0).toString(16)}`
    ])

    // Submit task
    await taskContract
      .connect(assignee)
      .submitTask(taskId, 'https://github.com')
    const initialBalance = await ethers.provider.getBalance(assignee.address)

    // Approvers can confirm task
    await taskContract.connect(approver1).approveTask(taskId)
    await taskContract.connect(approver2).approveTask(taskId)

    // Assignee should receive reward

    const reward = ethers.utils
      .parseUnits(multiplier.toString())
      .mul(1 + complexityScore)
      .mul(rewardSlashDivisor - 6)
      .div(rewardSlashDivisor)
    const newBalance = await ethers.provider.getBalance(assignee.address)
    const expectedBalance = initialBalance.add(reward.isNegative() ? 0 : reward)
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
