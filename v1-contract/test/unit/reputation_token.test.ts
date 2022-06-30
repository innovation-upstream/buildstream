import { expect } from "chai";
import { ethers } from "hardhat";

const getContractInstance = async () => {
  const reputationToken = await ethers.getContractFactory("SBTToken");
  const contractInstance = await reputationToken.deploy();
  await contractInstance.deployed();

  return { contractInstance };
};

describe("Unit test: Reputation token contract", function () {
  it("Should fail reward because it's not tokenContract account", async function () {
    const { contractInstance } = await getContractInstance();
    const [, addr2] = await ethers.getSigners();
    await expect(
      contractInstance.reward(addr2.address, 0, 1)
    ).to.be.revertedWith("Permission denied");
  });

  it("Should create new token", async function () {
    const { contractInstance } = await getContractInstance();
    await contractInstance.creatNewToken(0);
    expect(await contractInstance.doesTokenExist(0)).to.be.equal(true);
  });

  it("Should update task contract address and reward", async function () {
    const { contractInstance } = await getContractInstance();
    const [, addr1, addr2] = await ethers.getSigners();
    await contractInstance.updateTaskContractAddress(addr1.address);
    await contractInstance.creatNewToken(0);
    await contractInstance.connect(addr1).reward(addr2.address, 0, 1);
    await expect(
      await contractInstance.balanceOf(addr2.address, 0)
    ).to.be.equal(1);
  });

  it("Should fail update with reward limit exceeded", async function () {
    const { contractInstance } = await getContractInstance();
    const [, addr1, addr2] = await ethers.getSigners();
    await contractInstance.updateTaskContractAddress(addr1.address);
    await contractInstance.creatNewToken(0);
    await expect(
      contractInstance.connect(addr1).reward(addr2.address, 0, 6)
    ).revertedWith("Maximum tokens allowed exceeded");
  });

  it("Should fail transfer", async function () {
    const { contractInstance } = await getContractInstance();
    const [, addr1, addr2, addr3] = await ethers.getSigners();
    await contractInstance.updateTaskContractAddress(addr1.address);
    await contractInstance.creatNewToken(0);
    await contractInstance.connect(addr1).reward(addr2.address, 0, 2);
    await expect(
      contractInstance
        .connect(addr2)
        .safeTransferFrom(
          addr2.address,
          addr3.address,
          0,
          1,
          ethers.utils.toUtf8Bytes("")
        )
    ).revertedWith("Feature is disabled");
  });
});
