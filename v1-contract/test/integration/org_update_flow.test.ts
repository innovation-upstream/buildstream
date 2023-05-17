/* eslint-disable node/no-missing-import */
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { actionType } from '../../utils/globals'

const multiplier = 0.00001
const requiredConfirmations = 2
const requiredApprovals = 1
const rewardSlashMultiplier = 0.01
const slashRewardEvery = 86400
const autoExecute = true

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
    const [owner, signer, approver1] = await ethers.getSigners()
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

    const tx0 = await actionContract[
      'createAction(uint256,address,uint8,bytes,uint256,bool)'
    ](
      orgId,
      ethers.constants.AddressZero,
      actionType.UPDATE_NAME,
      ethers.utils.toUtf8Bytes('Builder stream'),
      0,
      autoExecute
    )

    const receipt0 = await tx0.wait()
    const event = receipt0?.events?.find(
      (e: any) => e.event === 'ActionCreation'
    )
    const actionId = event?.args?.[1]?.toNumber()

    await actionContract.connect(signer).confirmAction(actionId)

    expect(await (await orgContract.getOrganization(orgId)).name).to.be.equal(
      'Builder stream'
    )
  })

  it('Should change description', async function () {
    const [owner, signer, approver1] = await ethers.getSigners()
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

    const tx0 = await actionContract[
      'createAction(uint256,address,uint8,bytes,uint256,bool)'
    ](
      orgId,
      ethers.constants.AddressZero,
      actionType.UPDATE_DESCRIPTION,
      ethers.utils.toUtf8Bytes('Decentralized task managers app'),
      0,
      autoExecute
    )

    const receipt0 = await tx0.wait()
    const event = receipt0?.events?.find(
      (e: any) => e.event === 'ActionCreation'
    )
    const actionId = event?.args?.[1]?.toNumber()

    await actionContract.connect(signer).confirmAction(actionId)

    expect(
      await (
        await orgContract.getOrganization(orgId)
      ).description
    ).to.be.equal('Decentralized task managers app')
  })
})
