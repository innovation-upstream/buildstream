import { expect } from "chai";
import { ethers } from "hardhat";

const getContractInstances = async () => {
  const reputationToken = await ethers.getContractFactory("SBTToken");
  const tokenContract = await reputationToken.deploy();
  await tokenContract.deployed();

  const task = await ethers.getContractFactory("TaskContract");
  const [owner, addr2, addr3, addr4] = await ethers.getSigners();
  const contractInstance = await task.deploy(
    [owner.address, addr2.address, addr3.address, addr4.address],
    2,
    tokenContract.address,
    {
      gasLimit: 3e7,
    }
  );
  await contractInstance.deployed();

  return { tokenContract, contractInstance };
};

describe("Task contract", function () {
  it("Should init contract and task count should be 0", async function () {
    const { contractInstance } = await getContractInstances();
    expect(await contractInstance.getTaskCount(true, true)).to.be.equal(0);
  });

  it("Should add task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, , , , addr5] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      1
    );
    expect(await contractInstance.getTaskCount(true, true)).to.be.equal(1);
    expect(await (await contractInstance.getTask(0)).title).to.be.equal(
      "update ethers version"
    );
  });

  it("Should assign task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, , , , addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    const taskId = (await contractInstance.getTask(0)).id;
    expect(await contractInstance.getState(taskId.toNumber())).to.be.equal(
      "OPEN"
    );
    await contractInstance.connect(addr6).assignSelf(0);
    expect(await contractInstance.getState(taskId.toNumber())).to.be.equal(
      "ASSIGNED"
    );
  });

  it("Should fail to assign task due to low reputation", async function () {
    const { contractInstance } = await getContractInstances();
    const [, , , , addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      4
    );
    await expect(
      contractInstance.connect(addr6).assignSelf(0)
    ).to.be.revertedWith("Not enough reputation tokens");
  });

  it("Should get reputation token and assign task", async function () {
    const { contractInstance, tokenContract } = await getContractInstances();
    const [, , , , addr5, addr6, addr7] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      4
    );
    const taskId = (await contractInstance.getTask(0)).id;
    expect(await contractInstance.getState(taskId.toNumber())).to.be.equal(
      "OPEN"
    );
    await tokenContract.updateTaskContractAddress(addr7.address);
    await tokenContract.connect(addr7).reward(addr6.address, 5);
    await contractInstance.connect(addr6).assignSelf(0);
    expect(await contractInstance.getState(taskId.toNumber())).to.be.equal(
      "ASSIGNED"
    );
  });

  it("Should let assignee submit task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, , , , addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    contractInstance.connect(addr6).assignSelf(0);
    contractInstance.connect(addr6).submitTask(0);
  });

  it("Should let owner confirm task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, addr1, , , addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    contractInstance.connect(addr6).assignSelf(0);
    contractInstance.connect(addr6).submitTask(0);
    contractInstance.connect(addr1).confirmTask(0);
  });

  it("Should fail to confirm unsubmitted task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, addr1, , , addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    contractInstance.connect(addr6).assignSelf(0);
    await expect(
      contractInstance.connect(addr1).confirmTask(0)
    ).to.be.revertedWith("Task is not submitted");
  });

  it("Should let owner close task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    contractInstance.connect(addr6).assignSelf(0);
    contractInstance.connect(addr6).submitTask(0);
    contractInstance.connect(addr2).confirmTask(0);
    contractInstance.connect(addr3).confirmTask(0);
    contractInstance.connect(addr4).closeTask(0);
  });

  it("Should fail to close unconfirmed task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, addr2, , addr4, addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    contractInstance.connect(addr6).assignSelf(0);
    contractInstance.connect(addr6).submitTask(0);
    contractInstance.connect(addr2).confirmTask(0);
    await expect(
      contractInstance.connect(addr4).closeTask(0)
    ).to.be.revertedWith("Insufficient confirmations");
  });
});
