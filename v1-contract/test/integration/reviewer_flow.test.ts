import { expect } from 'chai'
import { ethers } from 'hardhat'

const multiplier = 0.00001
const requiredConfirmations = 2
const requiredApprovals = 1
const rewardSlashDivisor = 0.01
const slashRewardEvery = 1

const actionType = {
  WITHDRAWAL: 0,
  ADD_REVIEWER: 1,
  ADD_APPROVER: 2,
  ADD_SIGNER: 3,
  REMOVE_REVIEWER: 4,
  REMOVE_APPROVER: 5,
  REMOVE_SIGNER: 6
}

const getContractInstances = async () => {
  const org = await ethers.getContractFactory('Organization')
  const orgContract = await org.deploy({
    gasLimit: 3e7
  })
  await orgContract.deployed()

  const action = await ethers.getContractFactory('ActionContract')
  const actionContract = await action.deploy(orgContract.address)
  await actionContract.deployed()

  await orgContract.updateActionContract(actionContract.address)

  return { actionContract, orgContract }
}

describe('Integration test: Reviewer flow', function () {
  it('Should add reviewer', async function () {
    const [, signer, reviewer1] = await ethers.getSigners()
    const { actionContract, orgContract } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [signer.address],
      [ethers.constants.AddressZero],
      [signer.address]
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
      ethers.utils.parseUnits(rewardSlashDivisor.toString(), 4),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    const tx0 = await actionContract[
      'createAction(uint256,address,uint8,bytes,uint256)'
    ](
      orgId,
      reviewer1.address,
      actionType.ADD_REVIEWER,
      ethers.utils.toUtf8Bytes(''),
      0
    )

    const receipt0 = await tx0.wait()
    const event = receipt0?.events?.find(
      (e: any) => e.event === 'ActionCreation'
    )
    const actionId = event?.args?.[1]?.toNumber()

    await actionContract.confirmAction(actionId)
    await actionContract.connect(signer).confirmAction(actionId)

    await orgContract.executeAction(actionId)

    expect(
      await (await orgContract.getReviewers(orgId)).includes(reviewer1.address)
    ).to.be.equal(true)
  })

  it('Should remove reviewer', async function () {
    const [, signer, reviewer1, reviewer2, reviewer3] =
      await ethers.getSigners()
    const { actionContract, orgContract } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [reviewer1.address, reviewer2.address],
      [ethers.constants.AddressZero],
      [signer.address]
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
      ethers.utils.parseUnits(rewardSlashDivisor.toString(), 4),
      slashRewardEvery
    )
    await addOrgConfigTx.wait()

    const tx0 = await actionContract[
      'createAction(uint256,address,uint8,bytes,uint256)'
    ](
      orgId,
      reviewer3.address,
      actionType.ADD_REVIEWER,
      ethers.utils.toUtf8Bytes(''),
      0
    )

    const receipt0 = await tx0.wait()
    const event = receipt0?.events?.find(
      (e: any) => e.event === 'ActionCreation'
    )
    const actionId0 = event?.args?.[1]?.toNumber()

    await actionContract.confirmAction(actionId0)
    await actionContract.connect(signer).confirmAction(actionId0)

    await orgContract.executeAction(actionId0)

    const tx = await actionContract[
      'createAction(uint256,address,uint8,bytes,uint256)'
    ](
      orgId,
      reviewer3.address,
      actionType.REMOVE_REVIEWER,
      ethers.utils.toUtf8Bytes(''),
      0
    )

    const receipt = await tx.wait()
    const actionEvent = receipt?.events?.find(
      (e: any) => e.event === 'ActionCreation'
    )
    const actionId = actionEvent?.args?.[1]?.toNumber()

    await actionContract.confirmAction(actionId)
    await actionContract.connect(signer).confirmAction(actionId)

    await orgContract.executeAction(actionId)

    const reviewers = await orgContract.getReviewers(orgId)

    expect(await reviewers.includes(reviewer3.address)).to.be.equal(false)
  })
})
