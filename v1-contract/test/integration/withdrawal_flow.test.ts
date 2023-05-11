/* eslint-disable node/no-missing-import */
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { actionType } from '../../utils/globals'

const multiplier = 0.00001
const withdrawAmount = 0.0001
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

  const treasury = await ethers.getContractFactory('Treasury')
  const treasuryContract = await treasury.deploy(
    orgContract.address,
    ethers.constants.AddressZero
  )
  await treasuryContract.deployed()

  const action = await ethers.getContractFactory('ActionContract')
  const actionContract = await action.deploy(orgContract.address)
  await actionContract.deployed()

  await orgContract.updateActionContract(actionContract.address)
  await orgContract.updateTreasuryContract(treasuryContract.address)

  return { actionContract, orgContract, treasuryContract }
}

describe('Integration test: Withdrawal', function () {
  it('Should successfully withdraw ETH', async function () {
    const [owner, signer, withdrawee] = await ethers.getSigners()
    const { actionContract, orgContract, treasuryContract } =
      await getContractInstances()

    // Create organization
    const createOrgTx = await orgContract.createOrg(
      'Buildstream',
      'Decentralized task managers',
      [ethers.constants.AddressZero],
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

    // Make deposit in treasury for orgainization
    await treasuryContract['deposit(uint256)'](orgId, {
      from: owner.address,
      value: ethers.utils.parseEther('0.001')
    })

    const tx0 = await actionContract[
      'createAction(uint256,address,uint256,address,uint8,bytes,bool)'
    ](
      orgId,
      withdrawee.address,
      ethers.utils.parseEther(withdrawAmount.toString()),
      ethers.constants.AddressZero,
      actionType.WITHDRAWAL,
      ethers.utils.toUtf8Bytes(''),
      autoExecute
    )

    const receipt0 = await tx0.wait()
    const event = receipt0?.events?.find(
      (e: any) => e.event === 'ActionCreation'
    )
    const actionId = event?.args?.[1]?.toNumber()

    const initialBalance = await ethers.provider.getBalance(withdrawee.address)

    await actionContract.confirmAction(actionId)
    await actionContract.connect(signer).confirmAction(actionId)

    // Assignee should receive reward

    const reward = ethers.utils.parseUnits(withdrawAmount.toString())
    const expectedBalance = reward.add(initialBalance)
    const newBalance = await ethers.provider.getBalance(withdrawee.address)
    const isEqual = expectedBalance.eq(newBalance)

    expect(isEqual).to.be.equal(true)
  })
})
