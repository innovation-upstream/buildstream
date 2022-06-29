import { expect } from "chai";
import { waffle, ethers } from "hardhat";
const { deployMockContract, provider } = waffle;

const getContractInstances = async () => {
  const [deployerOfContract] = provider.getWallets();

  const orgArtifact = require("../../artifacts/contracts/Organization.sol/Organization.json");
  const orgContract = await deployMockContract(
    deployerOfContract,
    orgArtifact.abi
  );

  const tokenArtifact = require("../../artifacts/contracts/ReputationToken.sol/SBTToken.json");
  const tokenContract = await deployMockContract(
    deployerOfContract,
    tokenArtifact.abi
  );

  const task = await ethers.getContractFactory("TaskContract");
  const contractInstance = await task.deploy(
    tokenContract.address,
    orgContract.address,
    {
      gasLimit: 3e7,
    }
  );
  await contractInstance.deployed();

  return { tokenContract, contractInstance, orgContract };
};

describe("Unit test: Task contract", function () {
  it("Should init contract and task count should be 0", async function () {
    const { contractInstance } = await getContractInstances();
    expect(await contractInstance.getTaskCount(0, true, true)).to.be.equal(0);
  });

  it("Should add task", async function () {
    const { contractInstance, orgContract } = await getContractInstances();

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

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );

    const event = await creationEvent;

    const taskId = event.taskId.toNumber();
    expect(await contractInstance.getTaskCount(0, true, true)).to.be.equal(1);
    expect(await (await contractInstance.getTask(taskId)).title).to.be.equal(
      "update ethers version"
    );
  });

  it("Should assign task", async function () {
    const { contractInstance, orgContract, tokenContract } =
      await getContractInstances();
    const [, addr1] = await ethers.getSigners();

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await tokenContract.mock.balanceOf.returns(1);
    await tokenContract.mock.stake.returns(true);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );
    const taskId = (await contractInstance.getTask(0)).id;
    expect(await contractInstance.getState(taskId.toNumber())).to.be.equal(
      "OPEN"
    );
    await contractInstance.connect(addr1).assignSelf(0);
    expect(await contractInstance.getState(taskId.toNumber())).to.be.equal(
      "ASSIGNED"
    );
  });

  it("Should fail to assign 2 tasks", async function () {
    const { contractInstance, orgContract, tokenContract } =
      await getContractInstances();
    const [, addr1] = await ethers.getSigners();

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await tokenContract.mock.balanceOf.returns(1);
    await tokenContract.mock.stake.returns(true);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );
    await contractInstance.connect(addr1).assignSelf(0);
    await tokenContract.mock.stake.revertsWithReason("Tokens are locked");
    await expect(
      contractInstance.connect(addr1).assignSelf(0)
    ).to.be.revertedWith("Tokens are locked");
  });

  it("Should fail to assign task due to low reputation", async function () {
    const { contractInstance, orgContract, tokenContract } =
      await getContractInstances();
    const [, addr1] = await ethers.getSigners();

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await tokenContract.mock.balanceOf.returns(0);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      4
    );
    await expect(
      contractInstance.connect(addr1).assignSelf(0)
    ).to.be.revertedWith("Not enough reputation tokens");
  });

  it("Should let assignee submit task", async function () {
    const { contractInstance, orgContract, tokenContract } =
      await getContractInstances();
    const [, addr1] = await ethers.getSigners();

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await tokenContract.mock.balanceOf.returns(1);
    await tokenContract.mock.stake.returns(true);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );
    await contractInstance.connect(addr1).assignSelf(0);
    await contractInstance.connect(addr1).submitTask(0);
  });

  it("Should let reviewer confirm task", async function () {
    const { contractInstance, orgContract, tokenContract } =
      await getContractInstances();
    const [, addr1, addr2] = await ethers.getSigners();

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await tokenContract.mock.balanceOf.returns(1);
    await tokenContract.mock.stake.returns(true);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );
    await contractInstance.connect(addr1).assignSelf(0);
    await contractInstance.connect(addr1).submitTask(0);
    await contractInstance.connect(addr2).confirmTask(0);
  });

  it("Should fail to confirm unsubmitted task", async function () {
    const { contractInstance, orgContract, tokenContract } =
      await getContractInstances();
    const [, addr1, addr2] = await ethers.getSigners();

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await tokenContract.mock.balanceOf.returns(1);
    await tokenContract.mock.stake.returns(true);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );
    await contractInstance.connect(addr1).assignSelf(0);
    await expect(
      contractInstance.connect(addr2).confirmTask(0)
    ).to.be.revertedWith("Task is not submitted");
  });

  it("Should let reviewer close task", async function () {
    const { contractInstance, orgContract, tokenContract } =
      await getContractInstances();
    const [, addr1, addr2, addr3] = await ethers.getSigners();

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await orgContract.mock.reward.returns(true);
    await orgContract.mock.getReviewers.returns([addr2.address, addr3.address]);
    await orgContract.mock.getRequiredReviewsCount.returns(2);
    await tokenContract.mock.balanceOf.returns(1);
    await tokenContract.mock.stake.returns(true);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );
    await contractInstance.connect(addr1).assignSelf(0);
    await contractInstance.connect(addr1).submitTask(0);
    await contractInstance.connect(addr2).confirmTask(0);
    await contractInstance.connect(addr3).confirmTask(0);
    await contractInstance.connect(addr3).closeTask(0);
  });

  it("Should fail to close unconfirmed task", async function () {
    const { contractInstance, orgContract, tokenContract } =
      await getContractInstances();
    const [, addr1, addr2, addr3] = await ethers.getSigners();

    await orgContract.mock.doesOrgExists.returns(true);
    await orgContract.mock.isReviewerAddress.returns(true);
    await orgContract.mock.reward.returns(true);
    await orgContract.mock.getReviewers.returns([addr2.address, addr3.address]);
    await orgContract.mock.getRequiredReviewsCount.returns(2);
    await tokenContract.mock.balanceOf.returns(1);
    await tokenContract.mock.stake.returns(true);
    await contractInstance.createTask(
      0,
      "update ethers version",
      "update ethers version to v2",
      "golang",
      1
    );
    await contractInstance.connect(addr1).assignSelf(0);
    await contractInstance.connect(addr1).submitTask(0);
    await contractInstance.connect(addr2).confirmTask(0);
    await expect(
      contractInstance.connect(addr3).closeTask(0)
    ).to.be.revertedWith("Insufficient confirmations");
  });
});
