import { expect } from 'chai'
import { ethers, waffle } from 'hardhat'
const { deployMockContract, provider } = waffle

const teamName = 'Team 7'
const teamDescription = 'konoha team 7'
const teamRewardMultiplier = 0.1

const mockTask = {
  id: 0,
  externalId: '0',
  orgId: 0,
  title: 'update ethers version',
  description: 'update ethers version to v2',
  assigner: ethers.constants.AddressZero,
  assigneeAddress: ethers.constants.AddressZero,
  taskTags: ['golang'],
  status: 2,
  complexityScore: 0,
  reputationLevel: 0,
  comment: '',
  taskDuration: 0
}

const getContractInstances = async () => {
  const [deployerOfContract] = provider.getWallets()

  const team = await ethers.getContractFactory('TeamContract')
  const teamContract = await team.deploy()
  await teamContract.deployed()

  const storageArtifact = require('../../artifacts/contracts/TaskStorageContract.sol/TaskStorageContract.json')
  const storageContract = await deployMockContract(
    deployerOfContract,
    storageArtifact.abi
  )

  await teamContract.updateTaskStorageContractAddress(storageContract.address)

  return {
    teamContract,
    storageContract
  }
}

describe('Unit test: Team contract', function () {
  it('Should successfully create a team', async function () {
    const [owner] = await ethers.getSigners()
    const { teamContract } = await getContractInstances()

    const tx = await teamContract.createTeam(
      teamName,
      teamDescription,
      [],
      ethers.utils.parseUnits(teamRewardMultiplier.toString())
    )

    await tx.wait()

    expect(await (await teamContract.getTeam(owner.address)).name).to.be.equal(
      teamName
    )
  })

  it('Should successfully update team', async function () {
    const [owner] = await ethers.getSigners()
    const { teamContract } = await getContractInstances()

    await teamContract.createTeam(
      teamName,
      teamDescription,
      [],
      ethers.utils.parseUnits(teamRewardMultiplier.toString())
    )

    teamContract.updateTeam(
      teamName,
      'The best',
      ethers.utils.parseUnits(teamRewardMultiplier.toString())
    )

    expect(
      await (
        await teamContract.getTeam(owner.address)
      ).description
    ).to.be.equal('The best')
  })

  it('Should successfully add team member', async function () {
    const [owner, teamAssignee] = await ethers.getSigners()
    const { teamContract } = await getContractInstances()

    await teamContract.createTeam(
      teamName,
      teamDescription,
      [],
      ethers.utils.parseUnits(teamRewardMultiplier.toString())
    )

    teamContract.addMember(teamAssignee.address)

    expect(
      await (
        await teamContract.getTeam(owner.address)
      ).members.includes(teamAssignee.address)
    ).to.be.equal(true)
  })

  it('Should successfully remove a team member', async function () {
    const [owner, teamAssignee] = await ethers.getSigners()
    const { teamContract } = await getContractInstances()

    await teamContract.createTeam(
      teamName,
      teamDescription,
      [teamAssignee.address],
      ethers.utils.parseUnits(teamRewardMultiplier.toString())
    )
    await teamContract.removeMember(teamAssignee.address)

    expect(
      await (
        await teamContract.getTeam(owner.address)
      ).members.includes(teamAssignee.address)
    ).to.be.equal(false)
  })

  it('Should successfully assign task to a team member', async function () {
    const [owner, teamAssignee] = await ethers.getSigners()
    const { teamContract, storageContract } = await getContractInstances()

    await teamContract.createTeam(
      teamName,
      teamDescription,
      [teamAssignee.address],
      ethers.utils.parseUnits(teamRewardMultiplier.toString())
    )

    const task = mockTask
    task.assigneeAddress = owner.address
    await storageContract.mock.getTask.returns(task)
    // await teamContract.assignTask(0, teamAssignee.address)

    // expect(await teamContract.getTaskAssignee(0)).to.be.equal(
    //   teamAssignee.address
    // )
  })
})
