import { expect } from 'chai'
import { ethers } from 'hardhat'

const rewardSlashMultiplier = 0.01
const slashRewardEvery = 86400
const multiplier = 0.00001
const complexityScore = 0
const requiredConfirmations = 1
const requiredApprovals = 2
const reputationLevel = 1
const taskDuration = 86400
const teamRewardMultiplier = 0.1
const SOLIDITY_TAG = 0
const doNotOpenTask = false
const shouldOpenTask = true
const disableSelfAssign = false

const contractDefaults = {
  multiplier: 0.0001,
  rewardSlashMultiplier: 0.01,
  requiredConfirmations: 1,
  requiredApprovals: 2
}

const getContractInstances = async () => {
  const taskLibrary = await ethers.getContractFactory('TaskLibrary')
  const taskLib = await taskLibrary.deploy()
  await taskLib.deployed()

  const taskLogicLibrary = await ethers.getContractFactory(
    'TaskControlLogicLibrary'
  )
  const taskLogicLib = await taskLogicLibrary.deploy()
  await taskLogicLib.deployed()

  const org = await ethers.getContractFactory('Organization')
  const orgContract = await org.deploy({
    gasLimit: 3e7
  })
  await orgContract.deployed()

  const reputationToken = await ethers.getContractFactory('SBTToken')
  const tokenContract = await reputationToken.deploy()
  await tokenContract.deployed()

  const taskStorage = await ethers.getContractFactory('TaskStorageContract', {
    libraries: {
      TaskLibrary: taskLib.address
    }
  })
  const storageContract = await taskStorage.deploy()
  await storageContract.deployed()

  const task = await ethers.getContractFactory('TaskContract', {
    libraries: {
      TaskControlLogicLibrary: taskLogicLib.address
    }
  })
  const taskContract = await task.deploy(
    tokenContract.address,
    orgContract.address,
    storageContract.address,
    {
      gasLimit: 3e7
    }
  )
  await taskContract.deployed()

  const team = await ethers.getContractFactory('TeamContract')
  const teamContract = await team.deploy()
  await teamContract.deployed()

  const treasury = await ethers.getContractFactory('Treasury')
  const treasuryContract = await treasury.deploy(
    orgContract.address,
    taskContract.address
  )
  await treasuryContract.deployed()

  await tokenContract.updateTaskContractAddress(taskContract.address)
  await tokenContract.createTokens(1)
  await storageContract.updateTaskContractAddress(taskContract.address)
  await taskContract.updateTreasuryContract(treasuryContract.address)
  await taskContract.updateTeamContract(teamContract.address)
  await teamContract.updateTaskStorageContractAddress(storageContract.address)

  return {
    tokenContract,
    taskContract,
    orgContract,
    treasuryContract,
    storageContract,
    teamContract
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
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

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
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should successfully complete the task flow when we create and open task simultaneously', async function () {
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
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create and open task using org id created earlier
    const requestAssignment = false
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        shouldOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

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
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should successfully complete the task flow using default values', async function () {
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
      [approver1.address, approver2.address],
      [owner.address],
      true
    )

    const orgCreateReceipt = await createOrgTx.wait()
    const orgCreateEvent = orgCreateReceipt?.events?.find(
      (e: any) => e.event === 'OrganizationCreation'
    )
    const orgId = orgCreateEvent?.args?.[0]?.toNumber()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

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

    // Assignee should receive reward

    const reward = ethers.utils
      .parseUnits(contractDefaults.multiplier.toString())
      .mul(1 + complexityScore)
    const newBalance = await ethers.provider.getBalance(assignee.address)
    const expectedBalance = reward.add(initialBalance)
    const isEqual = expectedBalance.eq(newBalance)

    expect(
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
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
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )
    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

    await taskContract
      .connect(approver1)
      .approveAssignRequest(taskId, assignee.address)

    const overtimeSlashRatio = 2
    await ethers.provider.send('evm_increaseTime', [overtimeSlashRatio * 86400])
    await ethers.provider.send('hardhat_mine', [`0x1`])

    // Submit task
    await taskContract
      .connect(assignee)
      .submitTask(taskId, 'https://github.com')
    const initialBalance = await ethers.provider.getBalance(assignee.address)

    // Approvers can confirm task
    await taskContract.connect(approver1).approveTask(taskId)
    await taskContract.connect(approver2).approveTask(taskId)

    // Assignee should receive reward

    const initialReward = ethers.utils
      .parseUnits(multiplier.toString())
      .mul(1 + complexityScore)

    const slashAmount = initialReward
      .mul(overtimeSlashRatio)
      .mul(ethers.utils.parseUnits(rewardSlashMultiplier.toString()))
      .div(ethers.utils.parseEther('1'))
    const newBalance = await ethers.provider.getBalance(assignee.address)
    const reward = initialReward.sub(slashAmount)
    const expectedBalance = initialBalance.add(reward.isNegative() ? 0 : reward)
    const isEqual = expectedBalance.eq(newBalance)

    expect(
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should successfully slash reward using contract defaults', async function () {
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
      [approver1.address, approver2.address],
      [owner.address],
      true
    )

    const orgCreateReceipt = await createOrgTx.wait()
    const orgCreateEvent = orgCreateReceipt?.events?.find(
      (e: any) => e.event === 'OrganizationCreation'
    )
    const orgId = orgCreateEvent?.args?.[0]?.toNumber()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )
    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

    await taskContract
      .connect(approver1)
      .approveAssignRequest(taskId, assignee.address)

    const overtimeSlashRatio = 2
    await ethers.provider.send('evm_increaseTime', [overtimeSlashRatio * 86400])
    await ethers.provider.send('hardhat_mine', [`0x1`])

    // Submit task
    await taskContract
      .connect(assignee)
      .submitTask(taskId, 'https://github.com')
    const initialBalance = await ethers.provider.getBalance(assignee.address)

    // Approvers can confirm task
    await taskContract.connect(approver1).approveTask(taskId)

    // Assignee should receive reward

    const initialReward = ethers.utils
      .parseUnits(contractDefaults.multiplier.toString())
      .mul(1 + complexityScore)

    const slashAmount = initialReward
      .mul(overtimeSlashRatio)
      .mul(
        ethers.utils.parseUnits(
          contractDefaults.rewardSlashMultiplier.toString()
        )
      )
      .div(ethers.utils.parseEther('1'))
    const newBalance = await ethers.provider.getBalance(assignee.address)
    const reward = initialReward.sub(slashAmount)
    const expectedBalance = initialBalance.add(reward.isNegative() ? 0 : reward)
    const isEqual = expectedBalance.eq(newBalance)

    expect(
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should successfully complete the task flow as a team', async function () {
    const [owner, approver1, approver2, assignee, teamAssignee] =
      await ethers.getSigners()
    const {
      orgContract,
      taskContract,
      tokenContract,
      treasuryContract,
      storageContract,
      teamContract
    } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

    await taskContract
      .connect(approver1)
      .approveAssignRequest(taskId, assignee.address)

    await teamContract
      .connect(assignee)
      .createTeam(
        'Team 7',
        'konoha team 7',
        [teamAssignee.address],
        ethers.utils.parseUnits(teamRewardMultiplier.toString())
      )
    await teamContract
      .connect(assignee)
      .assignTask(taskId, teamAssignee.address)

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
    const teamReward = reward
      .mul(ethers.utils.parseUnits(teamRewardMultiplier.toString()))
      .div(ethers.utils.parseEther('1'))
    const newBalance = await ethers.provider.getBalance(assignee.address)
    const expectedBalance = teamReward.add(initialBalance)
    const isEqual = expectedBalance.eq(newBalance)

    expect(
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should successfully complete the task revision flow', async function () {
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
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

    await taskContract
      .connect(approver1)
      .approveAssignRequest(taskId, assignee.address)

    // Submit task
    await taskContract
      .connect(assignee)
      .submitTask(taskId, 'https://github.com')

    await taskContract
      .connect(approver1)
      .requestForTaskRevision(
        taskId,
        ethers.utils.formatBytes32String('3ed5'),
        ethers.utils.formatBytes32String('3ed5re'),
        0
      )

    await storageContract
      .connect(assignee)
      .requestForTaskRevisionDurationExtension(taskId, 0, 3000)

    await taskContract
      .connect(approver1)
      .requestForTaskRevision(
        taskId,
        ethers.utils.formatBytes32String('3ed5'),
        ethers.utils.formatBytes32String('3ed5re'),
        3000
      )
    await storageContract.connect(assignee).acceptTaskRevision(taskId, 1)

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
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should successfully assign task to task creator and complete task flow', async function () {
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
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = true
    const createTaskTx = await taskContract
      .connect(assignee)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open and assign task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

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
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should successfully complete the task flow when self-assign is enabled', async function () {
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
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const reputationLevel = 0
    const complexityScore = 0
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

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
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should successfully complete the task flow when self-assign is disabled', async function () {
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
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const disableSelfAssign = true
    const reputationLevel = 0
    const complexityScore = 0
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

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
      await tokenContract['balanceOf(address,uint256,uint256,uint256)'](
        assignee.address,
        SOLIDITY_TAG,
        complexityScore,
        orgId
      )
    ).to.be.equal(1)
    expect(isEqual).to.be.equal(true)
  })

  it('Should fail to self-assign when self-assign is disabled', async function () {
    const [owner, approver1, approver2, assignee] = await ethers.getSigners()
    const { orgContract, taskContract, treasuryContract, storageContract } =
      await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [approver1.address, approver2.address],
      [owner.address],
      false
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
      ethers.utils.parseUnits(rewardSlashMultiplier.toString()),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    // Create task using org id created earlier
    const requestAssignment = false
    const disableSelfAssign = true
    const reputationLevel = 0
    const complexityScore = 0
    const createTaskTx = await taskContract
      .connect(approver1)
      .createTask(
        '',
        orgId,
        'update ethers version',
        'update ethers version to v2',
        [SOLIDITY_TAG],
        complexityScore,
        reputationLevel,
        taskDuration,
        requestAssignment,
        doNotOpenTask,
        disableSelfAssign
      )

    const taskCreateReceipt = await createTaskTx.wait()
    const eventFilter = storageContract.filters.TaskCreation()
    const events = await storageContract.queryFilter(eventFilter)

    const taskEvent = events?.find(
      (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
    )

    const taskId = taskEvent?.args?.[0]?.toNumber() as number

    // Open task
    const assignCreator = true
    await taskContract
      .connect(approver1)
      .openTask(taskId, ethers.constants.AddressZero, assignCreator)

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId)

    // Check if assignee is assigned to task
    expect((await storageContract.getTask(taskId)).assigneeAddress).to.be.equal(
      ethers.constants.AddressZero
    )
  })
})
