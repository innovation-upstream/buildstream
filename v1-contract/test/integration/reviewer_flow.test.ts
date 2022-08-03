import { expect } from 'chai'
import { ethers } from 'hardhat'

const multiplier = 0.00001
const requiredConfirmations = 2
const requiredApprovals = 1

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
    const orgCreationEvent = new Promise<any>((resolve, reject) => {
      orgContract.on('Creation', (orgId, event) => {
        event.removeListener()
        resolve({
          orgId: orgId
        })
      })

      setTimeout(() => {
        reject(new Error('timeout'))
      }, 60000)
    })

    await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      ethers.utils.parseUnits(multiplier.toString()),
      ethers.constants.AddressZero,
      [signer.address],
      [ethers.constants.AddressZero],
      [signer.address],
      requiredConfirmations,
      requiredApprovals
    )

    const orgEvent = await orgCreationEvent
    const orgId = orgEvent.orgId.toNumber()

    const actionCreationEvent = new Promise<any>((resolve, reject) => {
      actionContract.on('Creation', (orgId, actionId, event) => {
        event.removeListener()
        resolve({
          actionId: actionId
        })
      })

      setTimeout(() => {
        reject(new Error('timeout'))
      }, 60000)
    })

    await actionContract['createAction(uint256,address,uint8,bytes)'](
      orgId,
      reviewer1.address,
      actionType.ADD_REVIEWER,
      ethers.utils.toUtf8Bytes('')
    )

    const actionEvent = await actionCreationEvent
    const actionId = actionEvent.actionId.toNumber()

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
    const orgCreationEvent = new Promise<any>((resolve, reject) => {
      orgContract.on('Creation', (orgId, event) => {
        event.removeListener()
        resolve({
          orgId: orgId
        })
      })

      setTimeout(() => {
        reject(new Error('timeout'))
      }, 60000)
    })

    await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      ethers.utils.parseUnits(multiplier.toString()),
      ethers.constants.AddressZero,
      [reviewer1.address, reviewer2.address],
      [ethers.constants.AddressZero],
      [signer.address],
      requiredConfirmations,
      requiredApprovals
    )

    const orgEvent = await orgCreationEvent
    const orgId = orgEvent.orgId.toNumber()

    const tx0 = await actionContract[
      'createAction(uint256,address,uint8,bytes)'
    ](
      orgId,
      reviewer3.address,
      actionType.ADD_REVIEWER,
      ethers.utils.toUtf8Bytes('')
    )

    const receipt0 = await tx0.wait()
    const event = receipt0?.events?.find((e: any) => e.event === 'Creation')
    const actionId0 = event?.args?.[1]?.toNumber()

    await actionContract.confirmAction(actionId0)
    await actionContract.connect(signer).confirmAction(actionId0)

    await orgContract.executeAction(actionId0)

    const tx = await actionContract[
      'createAction(uint256,address,uint8,bytes)'
    ](
      orgId,
      reviewer3.address,
      actionType.REMOVE_REVIEWER,
      ethers.utils.toUtf8Bytes('')
    )

    const receipt = await tx.wait()
    const actionEvent = receipt?.events?.find(
      (e: any) => e.event === 'Creation'
    )
    const actionId = actionEvent?.args?.[1]?.toNumber()

    await actionContract.confirmAction(actionId)
    await actionContract.connect(signer).confirmAction(actionId)

    await orgContract.executeAction(actionId)

    const reviewers = await orgContract.getReviewers(orgId)

    expect(await reviewers.includes(reviewer3.address)).to.be.equal(false)
  })
})
