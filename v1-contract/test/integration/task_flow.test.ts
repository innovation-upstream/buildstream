import { expect } from "chai";
import { ethers } from "hardhat";

const getContractInstances = async () => {
  const org = await ethers.getContractFactory("Organization");
  const orgContract = await org.deploy({
    gasLimit: 3e7,
  });
  await orgContract.deployed();

  const reputationToken = await ethers.getContractFactory("SBTToken");
  const tokenContract = await reputationToken.deploy();
  await tokenContract.deployed();

  const task = await ethers.getContractFactory("TaskContract");
  const taskContract = await task.deploy(
    tokenContract.address,
    orgContract.address,
    {
      gasLimit: 3e7,
    }
  );
  await taskContract.deployed();
  await tokenContract.updateTaskContractAddress(taskContract.address);

  return { tokenContract, taskContract, orgContract };
};

describe("Integration test: Task flow", function () {
  it("Should successfully complete the task flow", async function () {
    const [, approver1, approver2, assignee] = await ethers.getSigners();
    const { orgContract, taskContract, tokenContract } =
      await getContractInstances();

    // Create organization
    const orgCreationEvent = new Promise<any>((resolve, reject) => {
      orgContract.on("Creation", (orgId, event) => {
        event.removeListener();
        resolve({
          orgId: orgId,
        });
      });

      setTimeout(() => {
        reject(new Error("timeout"));
      }, 60000);
    });

    await orgContract.createOrg(
      "Buildstream",
      "Decentralized task managers",
      [],
      [approver1.address, approver2.address]
    );

    const orgEvent = await orgCreationEvent;
    const orgId = orgEvent.orgId.toNumber();

    // Create task using org id created earlier
    const taskCreationEvent = new Promise<any>((resolve, reject) => {
      taskContract.on("Creation", (taskId, event) => {
        event.removeListener();
        resolve({
          taskId: taskId,
        });
      });

      setTimeout(() => {
        reject(new Error("timeout"));
      }, 60000);
    });

    await taskContract
      .connect(approver1)
      .createTask(
        orgId,
        "update ethers version",
        "update ethers version to v2",
        ["golang"],
        0,
        0,
        2
      );

    const taskEvent = await taskCreationEvent;

    const taskId = taskEvent.taskId.toNumber();

    // Open task
    await taskContract.connect(approver1).openTask(taskId);

    // Assign task created above to self
    await taskContract.connect(assignee).assignSelf(taskId);

    // Submit task
    await taskContract.connect(assignee).submitTask(taskId);

    // Reviewers can confirm task
    await taskContract.connect(approver1).approveTask(taskId);
    await taskContract.connect(approver2).approveTask(taskId);

    // Assignee should receive reward
    expect(await tokenContract.balanceOf(assignee.address, 0)).to.be.equal(1);
  });
});
