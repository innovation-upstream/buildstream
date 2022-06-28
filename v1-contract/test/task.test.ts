import { expect } from "chai";
import { ethers } from "hardhat";

const getContractInstances = async () => {
  const [owner, addr2, addr3, addr4] = await ethers.getSigners();
  const org = await ethers.getContractFactory("Org");
  const orgContract = await org.deploy(
    [owner.address, addr2.address, addr3.address, addr4.address],
    2,
    {
      gasLimit: 3e7,
    }
  );
  await orgContract.deployed();

  const reputationToken = await ethers.getContractFactory("XPToken");
  const tokenContract = await reputationToken.deploy(orgContract.address);
  await tokenContract.deployed();

  const task = await ethers.getContractFactory("TaskContract");
  const contractInstance = await task.deploy(
    tokenContract.address,
    orgContract.address,
    {
      gasLimit: 3e7,
    }
  );
  await contractInstance.deployed();
  await tokenContract.updateTaskContractAddress(contractInstance.address);
  await orgContract.updateTaskContractAddress(contractInstance.address);
  await orgContract.updateReputationContract(tokenContract.address);

  return { tokenContract, contractInstance, orgContract };
};

describe("Task contract", function () {
  it("Should init contract and task count should be 0", async function () {
    const { contractInstance } = await getContractInstances();
    expect(await contractInstance.getTaskCount(true, true)).to.be.equal(0);
  });

  it("Should add task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, , , , addr5] = await ethers.getSigners();

    const creationEvent = new Promise<any>((resolve, reject) => {
      contractInstance.on("Creation", (taskId, event) => {
        event.removeListener();

        resolve({
          taskId: taskId,
        });
      });

      setTimeout(() => {
        reject(new Error("timeout"));
      }, 60000);
    });

    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      1
    );

    const event = await creationEvent;

    const taskId = event.taskId.toNumber();
    expect(await contractInstance.getTaskCount(true, true)).to.be.equal(1);
    expect(await (await contractInstance.getTask(taskId)).title).to.be.equal(
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

  it("Should fail to assign 2 tasks", async function () {
    const { contractInstance } = await getContractInstances();
    const [, , , , addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    await contractInstance.connect(addr6).assignSelf(0);
    await expect(
      contractInstance.connect(addr6).assignSelf(0)
    ).to.be.revertedWith("Tokens are locked");
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
    await tokenContract.updateOrganizationContractAddress(addr7.address);
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
    await contractInstance.connect(addr6).assignSelf(0);
    await contractInstance.connect(addr6).submitTask(0);
  });

  it("Should let reviewer confirm task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, addr1, , , addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    await contractInstance.connect(addr6).assignSelf(0);
    await contractInstance.connect(addr6).submitTask(0);
    await contractInstance.connect(addr1).confirmTask(0);
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
    await contractInstance.connect(addr6).assignSelf(0);
    await expect(
      contractInstance.connect(addr1).confirmTask(0)
    ).to.be.revertedWith("Task is not submitted");
  });

  it("Should let reviewer close task", async function () {
    const { contractInstance } = await getContractInstances();
    const [, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      0
    );
    await contractInstance.connect(addr6).assignSelf(0);
    await contractInstance.connect(addr6).submitTask(0);
    await contractInstance.connect(addr2).confirmTask(0);
    await contractInstance.connect(addr3).confirmTask(0);
    await contractInstance.connect(addr4).closeTask(0);
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
    await contractInstance.connect(addr6).assignSelf(0);
    await contractInstance.connect(addr6).submitTask(0);
    await contractInstance.connect(addr2).confirmTask(0);
    await expect(
      contractInstance.connect(addr4).closeTask(0)
    ).to.be.revertedWith("Insufficient confirmations");
  });

  it("Should get reward when task is closed", async function () {
    const { contractInstance, tokenContract, orgContract } =
      await getContractInstances();
    const [, addr2, addr3, addr4, addr5, addr6, addr7] =
      await ethers.getSigners();
    await contractInstance.createTask(
      "update ethers version",
      "update ethers version to v2",
      addr5.address,
      1
    );
    await tokenContract.updateOrganizationContractAddress(addr7.address);
    await tokenContract.connect(addr7).reward(addr6.address, 5);
    await tokenContract.updateOrganizationContractAddress(orgContract.address);

    await contractInstance.connect(addr6).assignSelf(0);
    await contractInstance.connect(addr6).submitTask(0);
    await contractInstance.connect(addr2).confirmTask(0);
    await contractInstance.connect(addr3).confirmTask(0);
    await contractInstance.connect(addr4).closeTask(0);
    expect(await tokenContract.balanceOf(addr6.address)).to.be.equal(6);
  });
});
