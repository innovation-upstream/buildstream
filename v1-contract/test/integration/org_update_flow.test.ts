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
      [ethers.constants.AddressZero],
      [approver1.address],
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
      ethers.constants.AddressZero,
      actionType.UPDATE_NAME,
      ethers.utils.toUtf8Bytes('Builder stream')
    )

    const actionEvent = await actionCreationEvent
    const actionId = actionEvent.actionId.toNumber()

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
      [ethers.constants.AddressZero],
      [approver1.address],
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
      ethers.constants.AddressZero,
      actionType.UPDATE_DESCRIPTION,
      ethers.utils.toUtf8Bytes('Decentralized task managers app')
    )

    const actionEvent = await actionCreationEvent
    const actionId = actionEvent.actionId.toNumber()

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
