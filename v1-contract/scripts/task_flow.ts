import { ethers } from 'hardhat'
const { waitForInput, readJson } = require('../utils/helpers.ts')
const path = require('path')

const rewardSlashMultiplier = 0.01
const slashRewardEvery = 1
const multiplier = 0.000001
const complexityScore = 0
const requiredConfirmations = 1
const requiredApprovals = 1
const reputationLevel = 1
const dueDate = 10

async function main() {
  await waitForInput('Contracts: initialize contracts')

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
  const Treasury = readJson(
    path.join(__dirname, '../../app/src/contracts/Treasury.json')
  )

  const [signer] = await ethers.getSigners()
  const org = await ethers.getContractFactory('Organization')
  const orgContract = await org.attach(OrgContract.address)

  const token = await ethers.getContractFactory('SBTToken')
  const tokenContract = await token.attach(SBTToken.address)

  const taskStorage = await ethers.getContractFactory('TaskStorageContract')
  const taskStorageContract = await taskStorage.attach(TaskStorage.address)

  const task = await ethers.getContractFactory('TaskContract')
  const taskContract = await task.attach(Task.address)

  const treasury = await ethers.getContractFactory('Treasury')
  const treasuryContract = await treasury.attach(Treasury.address)

  // Create organization
  await waitForInput('Organization: create organization')
  const createOrgTx = await orgContract.createOrg(
    'Buildstream',
    'Decentralized task managers',
    [signer.address],
    [signer.address],
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
  await waitForInput('Treasury: make deposit for organization')
  const depositTx = await treasuryContract['deposit(uint256)'](orgId, {
    from: signer.address,
    value: ethers.utils.parseEther('0.00001')
  })
  await depositTx.wait()

  // Create task using org id created earlier
  await waitForInput('Task: create task')
  const createTaskTx = await taskContract.createTask(
    orgId,
    'update ethers version',
    'update ethers version to v2',
    ['golang'],
    complexityScore,
    reputationLevel,
    (await ethers.provider.getBlockNumber()) + dueDate
  )

  const taskCreateReceipt = await createTaskTx.wait()

  const eventFilter = taskStorageContract.filters.TaskCreation()
  const events = await taskStorageContract.queryFilter(eventFilter)

  const taskEvent = events?.find(
    (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
  )
  const taskId = taskEvent?.args?.[0]?.toNumber() as number

  // Open task
  await waitForInput('Task: open task')
  const openTx = await taskContract.openTask(
    taskId,
    ethers.constants.AddressZero
  )
  await openTx.wait()

  // Assign task created above to self
  await waitForInput('Task: assign task')
  const assignTx = await taskContract.assignSelf(taskId)
  await assignTx.wait()

  // Approve assign task request
  await waitForInput('Task: approve assign task')
  const approveAssignTx = await taskContract.approveAssignRequest(
    taskId,
    signer.address
  )
  await approveAssignTx.wait()

  // Submit task
  await waitForInput('Task: submit task')
  const submitTx = await taskContract.submitTask(taskId, 'https:github.com')
  await submitTx.wait()

  const initialBalance = await ethers.provider.getBalance(signer.address)

  // Approvers can confirm task
  await waitForInput('Task: approve task')
  const approveTx = await taskContract.approveTask(taskId)
  await approveTx.wait()

  // Assignee should receive reward
  await waitForInput('Task: check reward')
  const reward = ethers.utils
    .parseUnits(multiplier.toString())
    .mul(1 + complexityScore)
  const newBalance = await ethers.provider.getBalance(signer.address)
  const expectedBalance = reward.add(initialBalance)

  const tokenBal = await tokenContract['balanceOf(address,uint256,uint256)'](
    signer.address,
    complexityScore,
    orgId
  )
  console.log('Token balance: ', tokenBal)
  console.log('ETH balance: ', newBalance)
  console.log('expected ETH balance: ', expectedBalance)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
