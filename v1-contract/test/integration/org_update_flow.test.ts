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
  REMOVE_SIGNER: 6,
  UPDATE_NAME: 7,
  UPDATE_DESCRIPTION: 8
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

describe('Integration test: Organization update flow', function () {
  it('Should change name', async function () {
    const [, signer, approver1] = await ethers.getSigners()
    const { actionContract, orgContract } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [ethers.constants.AddressZero],
      [approver1.address],
      [signer.address]
    )

    const orgCreateReceipt = await createOrgTx.wait()
    const orgCreateEvent = orgCreateReceipt?.events?.find(
      (e: any) => e.event === 'Creation'
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
      'createAction(uint256,address,uint8,bytes)'
    ](
      orgId,
      ethers.constants.AddressZero,
      actionType.UPDATE_NAME,
      ethers.utils.toUtf8Bytes('Builder stream')
    )

    const receipt0 = await tx0.wait()
    const event = receipt0?.events?.find((e: any) => e.event === 'Creation')
    const actionId = event?.args?.[1]?.toNumber()

    await actionContract.confirmAction(actionId)
    await actionContract.connect(signer).confirmAction(actionId)

    await orgContract.executeAction(actionId)

    expect(await (await orgContract.getOrganization(orgId)).name).to.be.equal(
      'Builder stream'
    )
  })

  it('Should change description', async function () {
    const [, signer, approver1] = await ethers.getSigners()
    const { actionContract, orgContract } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [ethers.constants.AddressZero],
      [approver1.address],
      [signer.address]
    )

    const orgCreateReceipt = await createOrgTx.wait()
    const orgCreateEvent = orgCreateReceipt?.events?.find(
      (e: any) => e.event === 'Creation'
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
      'createAction(uint256,address,uint8,bytes)'
    ](
      orgId,
      ethers.constants.AddressZero,
      actionType.UPDATE_DESCRIPTION,
      ethers.utils.toUtf8Bytes('Decentralized task managers app')
    )

    const receipt0 = await tx0.wait()
    const event = receipt0?.events?.find((e: any) => e.event === 'Creation')
    const actionId = event?.args?.[1]?.toNumber()

    await actionContract.confirmAction(actionId)
    await actionContract.connect(signer).confirmAction(actionId)

    await orgContract.executeAction(actionId)

    expect(
      await (
        await orgContract.getOrganization(orgId)
      ).description
    ).to.be.equal('Decentralized task managers app')
  })
})
