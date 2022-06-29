import { expect } from "chai";
import { ethers } from "hardhat";

const getContractInstance = async () => {
  const [, addr1] = await ethers.getSigners();
  const reputationToken = await ethers.getContractFactory("SBTToken");
  const contractInstance = await reputationToken.deploy(addr1.address);
  await contractInstance.deployed();

  return { contractInstance };
};

describe("Unit test: Reputation token contract", function () {
  it("Should fail reward because it's not tokenContract account", async function () {
    const { contractInstance } = await getContractInstance();
    const [, addr2] = await ethers.getSigners();
    await expect(contractInstance.reward(addr2.address, 1)).to.be.revertedWith(
      "Permission denied"
    );
  });

  it("Should update organization contract address and reward", async function () {
    const { contractInstance } = await getContractInstance();
    const [, addr1, addr2] = await ethers.getSigners();
    await contractInstance.updateOrganizationContractAddress(addr1.address);
    await contractInstance.connect(addr1).reward(addr2.address, 1);
    await expect(await contractInstance.balanceOf(addr2.address)).to.be.equal(
      1
    );
  });

  it("Should fail update with reward limit exceeded", async function () {
    const { contractInstance } = await getContractInstance();
    const [, addr1, addr2] = await ethers.getSigners();
    await contractInstance.updateOrganizationContractAddress(addr1.address);
    await expect(
      contractInstance.connect(addr1).reward(addr2.address, 6)
    ).revertedWith("Maximum tokens allowed exceeded");
  });

  it("Should fail transfer", async function () {
    const { contractInstance } = await getContractInstance();
    const [, addr1, addr2, addr3] = await ethers.getSigners();
    await contractInstance.updateOrganizationContractAddress(addr1.address);
    await contractInstance.connect(addr1).reward(addr2.address, 2);
    await expect(
      contractInstance.connect(addr2).transfer(addr3.address, 1)
    ).revertedWith("Permission denied");
  });
});
