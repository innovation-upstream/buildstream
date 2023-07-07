import { expect } from 'chai'
import { ethers } from 'hardhat'

const getContractInstances = async () => {
  const org = await ethers.getContractFactory('Organization')
  const orgContract = await org.deploy({
    gasLimit: 3e7
  })
  await orgContract.deployed()

  return { contractInstance: orgContract }
}

describe('Unit test: Org contract', function () {
  it('Should init contract and org count should be 0', async function () {
    const { contractInstance } = await getContractInstances()
    expect(await contractInstance.getOrgCount()).to.be.equal(0)
  })

  it('Should create org', async function () {
    const { contractInstance } = await getContractInstances()
    const [, approver1, approver2] = await ethers.getSigners()

    const createOrgTx = await contractInstance.createOrg(
      'Buildstream',
      'Decentralized task management',
      [approver1.address, approver2.address],
      [ethers.constants.AddressZero],
      false
    )

    const orgCreateReceipt = await createOrgTx.wait()
    const orgCreateEvent = orgCreateReceipt?.events?.find(
      (e: any) => e.event === 'OrganizationCreation'
    )
    const orgId = orgCreateEvent?.args?.[0]?.toNumber()
    expect(await contractInstance.getOrgCount()).to.be.equal(1)
    expect(
      await (
        await contractInstance.getOrganization(orgId)
      ).name
    ).to.be.equal('Buildstream')
  })
})
