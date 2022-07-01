/* eslint-disable node/no-unpublished-import */
import { ethers } from "hardhat";
const pressAnyKey = require("press-any-key");
const OrgContract = require("../abis/Org.json");
const SBTToken = require("../abis/Token.json");
const Task = require("../abis/Task.json");

const waitForInput = async () => {
  await pressAnyKey("Press any key to continue, or CTRL+C to reject", {
    ctrlC: "reject",
  });
};

async function main() {
  const [signer] = await ethers.getSigners();
  const org = await ethers.getContractFactory("Organization");
  const orgContract = await org.attach(OrgContract.address);

  const token = await ethers.getContractFactory("SBTToken");
  const tokenContract = await token.attach(SBTToken.address);

  const task = await ethers.getContractFactory("TaskContract");
  const taskContract = await task.attach(Task.address);

  console.log("======== initialized contracts");
  await waitForInput();

  // Update task contract address in token contract
  await tokenContract.updateTaskContractAddress(Task.address);

  console.log("========= updated task contract address");
  await waitForInput();

  // Create new token
  await tokenContract.creatNewToken(0);

  console.log("========= created token");
  await waitForInput();

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
    ["0xC41Fb0beD6e5d0DC637aE6Ab97292f4908f8C7cc"],
    1
  );

  const orgEvent = await orgCreationEvent;
  const orgId = orgEvent.orgId.toNumber();

  console.log("========= created org", orgId);
  await waitForInput();

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

  await taskContract.createTask(
    0,
    "update ethers version",
    "update ethers version to v2",
    0,
    0
  );

  const taskEvent = await taskCreationEvent;

  const taskId = taskEvent.taskId.toNumber();

  console.log("========= created task", taskId);
  await waitForInput();

  // Assign task created above to self
  await taskContract.assignSelf(0);

  console.log("========= assigned");
  await waitForInput();

  // Submit task
  await taskContract.submitTask(taskId);

  console.log("========= submitted");
  await waitForInput();

  // Reviewers can confirm task
  await taskContract.confirmTask(taskId);

  console.log("========= confirmed");
  await waitForInput();

  // Anyone can close task
  await taskContract.closeTask(taskId);

  console.log("========= closed");
  await waitForInput();

  // Assignee should receive reward
  const balance = await tokenContract.balanceOf(signer.address, 1);

  console.log("My balance:", balance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
