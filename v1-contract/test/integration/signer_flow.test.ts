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

describe('Integration test: Signer flow', function () {
  it('Should add signer', async function () {
    const [, signer, signer1, signer2] = await ethers.getSigners()
    const { actionContract, orgContract } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [ethers.constants.AddressZero],
      [ethers.constants.AddressZero],
      [signer.address, signer1.address]
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

    const actionCreateTx = await actionContract[
      'createAction(uint256,address,uint8,bytes,uint256)'
    ](
      orgId,
      signer2.address,
      actionType.ADD_SIGNER,
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
      await (await orgContract.getSigners(orgId)).includes(signer2.address)
    ).to.be.equal(true)
  })

  it('Should remove signer', async function () {
    const [, signer, signer1, signer2, signer3] = await ethers.getSigners()
    const { actionContract, orgContract } = await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [ethers.constants.AddressZero],
      [ethers.constants.AddressZero],
      [signer.address, signer1.address, signer2.address]
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
      signer3.address,
      actionType.ADD_SIGNER,
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
      signer3.address,
      actionType.REMOVE_SIGNER,
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

    const reviewers = await orgContract.getSigners(orgId)

    expect(await reviewers.includes(signer3.address)).to.be.equal(false)
  })
})
