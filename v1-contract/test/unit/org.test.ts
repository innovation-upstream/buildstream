import { expect } from "chai";
import { ethers } from "hardhat";

const getContractInstances = async () => {
  const org = await ethers.getContractFactory("Organization");
  const orgContract = await org.deploy({
    gasLimit: 3e7,
  });
  await orgContract.deployed();

  return { contractInstance: orgContract };
};

describe("Unit test: Org contract", function () {
  it("Should init contract and org count should be 0", async function () {
    const { contractInstance } = await getContractInstances();
    expect(await contractInstance.getOrgCount()).to.be.equal(0);
  });

  it("Should create org", async function () {
    const { contractInstance } = await getContractInstances();
    const [, approver1, approver2] = await ethers.getSigners();

    const creationEvent = new Promise<any>((resolve, reject) => {
      contractInstance.on("Creation", (orgId, event) => {
        event.removeListener();

        resolve({
          orgId: orgId,
        });
      });

      setTimeout(() => {
        reject(new Error("timeout"));
      }, 60000);
    });

    await contractInstance.createOrg(
      "Buildstream",
      "Decentralized task management",
      2,
      ethers.constants.AddressZero,
      [ethers.constants.AddressZero],
      [approver1.address, approver2.address],
      [ethers.constants.AddressZero],
      1,
      1
    );

    const event = await creationEvent;

    const orgId = event.orgId.toNumber();
    expect(await contractInstance.getOrgCount()).to.be.equal(1);
    expect(
      await (
        await contractInstance.getOrganization(orgId)
      ).name
    ).to.be.equal("Buildstream");
  });
});
