import { expect } from 'chai'
import { ethers, waffle } from 'hardhat'
const { deployMockContract, provider } = waffle

const TaskStatus = {
  PROPOSED: 0,
  OPEN: 1,
  ASSIGNED: 2,
  SUBMITTED: 3,
  CLOSED: 4
}

const getMockTask = ({
  complexityScore = 1,
  requiredApprovals = 1,
  reputationLevel = 0,
  assigneeAddress = ethers.constants.AddressZero
}) => ({
  id: 0,
  orgId: 0,
  title: 'update ethers version',
  description: 'update ethers version to v2',
  assigneeAddress,
  taskTags: ['golang'],
  status: 0,
  complexityScore,
  reputationLevel,
  requiredApprovals,
  rewardAmount: 0,
  rewardToken: ethers.constants.AddressZero
})

const getMockOrganization = ({
  reviewers = [],
  approvers = [],
  signers = []
}) => ({
  id: 0,
  name: 'Buildstream',
  description: '',
  reviewers,
  approvers,
  signers,
  requiredConfirmations: 2,
  rewardMultiplier: 2,
  requiredTaskApprovals: 1,
  rewardToken: ethers.constants.AddressZero
})

const getContractInstances = async () => {
  const [deployerOfContract] = provider.getWallets()

  const orgArtifact = require('../../artifacts/contracts/Organization.sol/Organization.json')
  const orgContract = await deployMockContract(
    deployerOfContract,
    orgArtifact.abi
  )
  await orgContract.mock.getOrganization.returns(getMockOrganization({}))

  const tokenArtifact = require('../../artifacts/contracts/ReputationToken.sol/SBTToken.json')
  const tokenContract = await deployMockContract(
    deployerOfContract,
    tokenArtifact.abi
  )

  const storageArtifact = require('../../artifacts/contracts/TaskStorage.sol/TaskStorageContract.json')
  const storageContract = await deployMockContract(
    deployerOfContract,
    storageArtifact.abi
  )

  const treasuryArtifact = require('../../artifacts/contracts/Treasury.sol/Treasury.json')
  const treasuryContract = await deployMockContract(
    deployerOfContract,
    treasuryArtifact.abi
  )

  const task = await ethers.getContractFactory('TaskContract')
  const contractInstance = await task.deploy(
    tokenContract.address,
    orgContract.address,
    storageContract.address,
    {
      gasLimit: 3e7
    }
  )
  await contractInstance.deployed()
  await contractInstance.updateTreasuryContract(treasuryContract.address)

  return {
    tokenContract,
    contractInstance,
    orgContract,
    storageContract,
    treasuryContract
  }
}

describe('Unit test: Task contract', function () {
  it('Should init contract and task count should be 0', async function () {
    const { contractInstance } = await getContractInstances()
    expect(await contractInstance.getTaskCount(0, true, true)).to.be.equal(0)
  })

  it('Should add task', async function () {
    const { contractInstance, orgContract, tokenContract, storageContract } =
      await getContractInstances()

    const creationEvent = new Promise<any>((resolve, reject) => {
      contractInstance.on('Creation', (taskId, event) => {
        event.removeListener()

        resolve({
          taskId: taskId
        })
      })

      setTimeout(() => {
        reject(new Error('timeout'))
      }, 60000)
    })

    await orgContract.mock.doesOrgExists.returns(true)
    await orgContract.mock.isApproverAddress.returns(true)
    await orgContract.mock.getTaskApprovals.returns(1)
    await tokenContract.mock.doesTokenExist.returns(true)
    await storageContract.mock.createTask.returns(0)
    await contractInstance.createTask(
      0,
      'update ethers version',
      'update ethers version to v2',
      ['golang'],
      1,
      0
    )

    const event = await creationEvent

    const taskId = event.taskId.toNumber()
    expect(await contractInstance.getTaskCount(0, true, true)).to.be.equal(1)
    await storageContract.mock.getTask.returns(getMockTask({}))
    expect(await (await contractInstance.getTask(taskId)).title).to.be.equal(
      'update ethers version'
    )
  })

  it('Should assign task', async function () {
    const {
      contractInstance,
      orgContract,
      tokenContract,
      storageContract,
      treasuryContract
    } = await getContractInstances()
    const [, addr1] = await ethers.getSigners()

    await orgContract.mock.doesOrgExists.returns(true)
    await orgContract.mock.isApproverAddress.returns(true)
    await orgContract.mock.getTaskApprovals.returns(1)
    await tokenContract.mock.balanceOf.returns(1)
    await tokenContract.mock.stake.returns(true)
    await tokenContract.mock.doesTokenExist.returns(true)
    await storageContract.mock.createTask.returns(0)
    await contractInstance.createTask(
      0,
      'update ethers version',
      'update ethers version to v2',
      ['golang'],
      1,
      0
    )
    const taskId = 0
    expect(await contractInstance.getState(taskId)).to.be.equal(
      TaskStatus.PROPOSED
    )
    await storageContract.mock.getTask.returns(getMockTask({}))
    await treasuryContract.mock['lockBalance(uint256,uint256)'].returns()
    await storageContract.mock['openTask(uint256,uint256)'].returns()
    await contractInstance['openTask(uint256)'](taskId)
    expect(await contractInstance.getState(taskId)).to.be.equal(TaskStatus.OPEN)
    await storageContract.mock.assign.returns()
    await contractInstance.connect(addr1).assignSelf(taskId)
    expect(await contractInstance.getState(taskId)).to.be.equal(
      TaskStatus.ASSIGNED
    )
  })

  it('Should fail to assign task due to low reputation', async function () {
    const {
      contractInstance,
      orgContract,
      tokenContract,
      storageContract,
      treasuryContract
    } = await getContractInstances()
    const [, addr1] = await ethers.getSigners()

    await orgContract.mock.doesOrgExists.returns(true)
    await orgContract.mock.isApproverAddress.returns(true)
    await orgContract.mock.getTaskApprovals.returns(1)
    await tokenContract.mock.balanceOf.returns(0)
    await tokenContract.mock.stake.returns(true)
    await tokenContract.mock.doesTokenExist.returns(true)
    await storageContract.mock.createTask.returns(0)
    await contractInstance.createTask(
      0,
      'update ethers version',
      'update ethers version to v2',
      ['golang'],
      4,
      1
    )
    const taskId = 0
    await storageContract.mock.getTask.returns(
      getMockTask({ reputationLevel: 1 })
    )
    await treasuryContract.mock['lockBalance(uint256,uint256)'].returns()
    await storageContract.mock['openTask(uint256,uint256)'].returns()
    await contractInstance['openTask(uint256)'](0)
    await contractInstance.connect(addr1).assignSelf(taskId)
    expect(await contractInstance.getState(taskId)).to.be.equal(TaskStatus.OPEN)
  })

  it('Should unassign task', async function () {
    const {
      contractInstance,
      orgContract,
      tokenContract,
      storageContract,
      treasuryContract
    } = await getContractInstances()
    const [, addr1] = await ethers.getSigners()

    await orgContract.mock.doesOrgExists.returns(true)
    await orgContract.mock.isApproverAddress.returns(true)
    await orgContract.mock.getTaskApprovals.returns(1)
    await tokenContract.mock.balanceOf.returns(1)
    await tokenContract.mock.stake.returns(true)
    await tokenContract.mock.unStake.returns(true)
    await tokenContract.mock.doesTokenExist.returns(true)
    await storageContract.mock.createTask.returns(0)
    await contractInstance.createTask(
      0,
      'update ethers version',
      'update ethers version to v2',
      ['golang'],
      1,
      0
    )
    const taskId = 0
    await storageContract.mock.getTask.returns(
      getMockTask({ assigneeAddress: addr1.address })
    )
    await treasuryContract.mock['lockBalance(uint256,uint256)'].returns()
    await storageContract.mock['openTask(uint256,uint256)'].returns()
    await contractInstance['openTask(uint256)'](0)
    await storageContract.mock.assign.returns()
    await contractInstance['openTask(uint256)'](taskId)

    await contractInstance.connect(addr1).assignSelf(taskId)
    expect(await contractInstance.getState(taskId)).to.be.equal(
      TaskStatus.ASSIGNED
    )
    await storageContract.mock.unassign.returns()
    await contractInstance.connect(addr1).unassignSelf(taskId)
    expect(await contractInstance.getState(taskId)).to.be.equal(TaskStatus.OPEN)
  })

  it('Should let assignee submit task', async function () {
    const {
      contractInstance,
      orgContract,
      tokenContract,
      storageContract,
      treasuryContract
    } = await getContractInstances()
    const [, addr1] = await ethers.getSigners()

    await orgContract.mock.doesOrgExists.returns(true)
    await orgContract.mock.isApproverAddress.returns(true)
    await orgContract.mock.getTaskApprovals.returns(1)
    await tokenContract.mock.balanceOf.returns(1)
    await tokenContract.mock.stake.returns(true)
    await tokenContract.mock.doesTokenExist.returns(true)
    await storageContract.mock.createTask.returns(0)
    await contractInstance.createTask(
      0,
      'update ethers version',
      'update ethers version to v2',
      ['golang'],
      1,
      0
    )
    const taskId = 0
    await storageContract.mock.getTask.returns(
      getMockTask({ assigneeAddress: addr1.address })
    )
    await treasuryContract.mock['lockBalance(uint256,uint256)'].returns()
    await storageContract.mock['openTask(uint256,uint256)'].returns()
    await contractInstance['openTask(uint256)'](taskId)
    await storageContract.mock.assign.returns()
    await storageContract.mock.submitTask.returns()
    await contractInstance['openTask(uint256)'](taskId)
    await contractInstance.connect(addr1).assignSelf(taskId)
    await contractInstance.connect(addr1).submitTask(taskId)
  })

  it('Should let approver confirm task', async function () {
    const {
      contractInstance,
      orgContract,
      tokenContract,
      storageContract,
      treasuryContract
    } = await getContractInstances()
    const [, addr1, addr2] = await ethers.getSigners()

    await orgContract.mock.doesOrgExists.returns(true)
    await orgContract.mock.isApproverAddress.returns(true)
    await orgContract.mock.getApprovers.returns([addr2.address])
    await orgContract.mock.getTaskApprovals.returns(2)
    await tokenContract.mock.balanceOf.returns(1)
    await tokenContract.mock.stake.returns(true)
    await tokenContract.mock.doesTokenExist.returns(true)
    await tokenContract.mock.reward.returns(true)
    await storageContract.mock.createTask.returns(0)
    await contractInstance.createTask(
      0,
      'update ethers version',
      'update ethers version to v2',
      ['golang'],
      1,
      0
    )
    const taskId = 0
    await storageContract.mock.getTask.returns(
      getMockTask({ assigneeAddress: addr1.address, requiredApprovals: 2 })
    )
    await treasuryContract.mock['lockBalance(uint256,uint256)'].returns()
    await storageContract.mock['openTask(uint256,uint256)'].returns()
    await contractInstance['openTask(uint256)'](taskId)
    await storageContract.mock.assign.returns()
    await storageContract.mock.submitTask.returns()
    await contractInstance['openTask(uint256)'](taskId)
    await contractInstance.connect(addr1).assignSelf(taskId)
    await contractInstance.connect(addr1).submitTask(taskId)
    await contractInstance.connect(addr2).approveTask(taskId)
  })

  it('Should fail to confirm unsubmitted task', async function () {
    const {
      contractInstance,
      orgContract,
      tokenContract,
      storageContract,
      treasuryContract
    } = await getContractInstances()
    const [, addr1, addr2] = await ethers.getSigners()

    await orgContract.mock.doesOrgExists.returns(true)
    await orgContract.mock.isApproverAddress.returns(true)
    await orgContract.mock.getTaskApprovals.returns(1)
    await tokenContract.mock.balanceOf.returns(1)
    await tokenContract.mock.stake.returns(true)
    await tokenContract.mock.doesTokenExist.returns(true)
    await storageContract.mock.createTask.returns(0)
    await contractInstance.createTask(
      0,
      'update ethers version',
      'update ethers version to v2',
      ['golang'],
      1,
      0
    )
    const taskId = 0
    await storageContract.mock.getTask.returns(
      getMockTask({ assigneeAddress: addr1.address })
    )
    await treasuryContract.mock['lockBalance(uint256,uint256)'].returns()
    await storageContract.mock['openTask(uint256,uint256)'].returns()
    await contractInstance['openTask(uint256)'](taskId)
    await storageContract.mock.assign.returns()
    await contractInstance['openTask(uint256)'](taskId)
    await contractInstance.connect(addr1).assignSelf(taskId)
    await expect(
      contractInstance.connect(addr2).approveTask(taskId)
    ).to.be.revertedWith('Task not submitted')
  })

  it('Should let approver close task', async function () {
    const {
      contractInstance,
      orgContract,
      tokenContract,
      storageContract,
      treasuryContract
    } = await getContractInstances()
    const [, addr1, addr2, addr3] = await ethers.getSigners()

    await orgContract.mock.doesOrgExists.returns(true)
    await orgContract.mock.isApproverAddress.returns(true)
    await orgContract.mock.getApprovers.returns([addr2.address, addr3.address])
    await orgContract.mock.getTaskApprovals.returns(2)
    await tokenContract.mock.balanceOf.returns(1)
    await tokenContract.mock.stake.returns(true)
    await tokenContract.mock.unStake.returns(true)
    await tokenContract.mock.doesTokenExist.returns(true)
    await tokenContract.mock.reward.returns(true)
    await storageContract.mock.createTask.returns(0)
    await contractInstance.createTask(
      0,
      'update ethers version',
      'update ethers version to v2',
      ['golang'],
      1,
      0
    )
    const taskId = 0
    await storageContract.mock.getTask.returns(
      getMockTask({ assigneeAddress: addr1.address, requiredApprovals: 2 })
    )
    await treasuryContract.mock['lockBalance(uint256,uint256)'].returns()
    await treasuryContract.mock.reward.returns()
    await storageContract.mock['openTask(uint256,uint256)'].returns()
    await contractInstance['openTask(uint256)'](taskId)
    await storageContract.mock.assign.returns()
    await storageContract.mock.submitTask.returns()
    await storageContract.mock.closeTask.returns()
    await contractInstance['openTask(uint256)'](taskId)
    await contractInstance.connect(addr1).assignSelf(taskId)
    await contractInstance.connect(addr1).submitTask(taskId)
    await contractInstance.connect(addr2).approveTask(taskId)
    expect(await contractInstance.getState(taskId)).to.be.equal(
      TaskStatus.SUBMITTED
    )
    await contractInstance.connect(addr3).approveTask(taskId)
    expect(await contractInstance.getState(taskId)).to.be.equal(
      TaskStatus.CLOSED
    )
  })
})
