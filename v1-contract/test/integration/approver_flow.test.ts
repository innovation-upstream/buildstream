/* eslint-disable node/no-missing-import */
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { actionType } from '../../utils/globals'

const multiplier = 0.00001
const requiredConfirmations = 2
const requiredApprovals = 1
const rewardSlashMultiplier = 0.01
const slashRewardEvery = 86400

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

describe('Integration test: Approver flow', function () {
  it('Should add approver', async function () {
    const [owner, signer, approver1, approver2] = await ethers.getSigners()
    const { actionContract, orgContract } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [approver1.address],
      [owner.address, signer.address],
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

    const actionCreateTx = await actionContract[
      'createAction(uint256,address,uint8,bytes,uint256)'
    ](
      orgId,
      approver2.address,
      actionType.ADD_APPROVER,
      ethers.utils.toUtf8Bytes(''),
      0
    )

    const actionCreateReceipt = await actionCreateTx.wait()
    const actionCreateEvent = actionCreateReceipt?.events?.find(
      (e: any) => e.event === 'ActionCreation'
    )
    const actionId = actionCreateEvent?.args?.[0]?.toNumber()

    await actionContract.confirmAction(actionId)
    await actionContract.connect(signer).confirmAction(actionId)

    await orgContract.executeAction(actionId)

    expect(
      await (await orgContract.getApprovers(orgId)).includes(approver2.address)
    ).to.be.equal(true)
  })

  it('Should remove approver', async function () {
    const [owner, signer, approver1, approver2, approver3] =
      await ethers.getSigners()
    const { actionContract, orgContract } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [approver1.address, approver2.address],
      [owner.address, signer.address],
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

    const tx0 = await actionContract[
      'createAction(uint256,address,uint8,bytes,uint256)'
    ](
      orgId,
      approver3.address,
      actionType.ADD_APPROVER,
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
      approver3.address,
      actionType.REMOVE_APPROVER,
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

    const approvers = await orgContract.getApprovers(orgId)

    expect(await approvers.includes(approver3.address)).to.be.equal(false)
  })
})
