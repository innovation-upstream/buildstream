/* eslint-disable node/no-unpublished-import */
import { ethers } from "hardhat";
const { waitForInput } = require("../utils/helpers.ts");
const fs = require("fs");
const path = require("path");

const multiplier = 0.000001;
const complexityScore = 0;
const requiredConfirmations = 1;
const requiredApprovals = 1;
const reputationLevel = 1;

async function main() {
  await waitForInput("Contracts: initialize contracts");

  const OrgContract = fs.readFileSync(path.join(__dirname, "../abis/Org.json"));
  const SBTToken = fs.readFileSync(path.join(__dirname, "../abis/Token.json"));
  const Task = fs.readFileSync(path.join(__dirname, "../abis/Task.json"));
  const Treasury = fs.readFileSync(
    path.join(__dirname, "../abis/Treasury.json")
  );

  const [signer] = await ethers.getSigners();
  const org = await ethers.getContractFactory("Organization");
  const orgContract = await org.attach(OrgContract.address);

  const token = await ethers.getContractFactory("SBTToken");
  const tokenContract = await token.attach(SBTToken.address);

  const task = await ethers.getContractFactory("TaskContract");
  const taskContract = await task.attach(Task.address);

  const treasury = await ethers.getContractFactory("Treasury");
  const treasuryContract = await treasury.attach(Treasury.address);

  // Create organization
  await waitForInput("Organization: create organization");
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
    ethers.utils.parseUnits(multiplier.toString()),
    ethers.constants.AddressZero,
    [signer.address],
    [signer.address],
    [signer.address],
    requiredConfirmations,
    requiredApprovals
  );

  const orgEvent = await orgCreationEvent;
  const orgId = orgEvent.orgId.toNumber();

  // Make deposit in treasury for orgainization
  await waitForInput("Treasury: make deposit for organization");
  await treasuryContract["deposit(uint256)"](orgId, {
    from: signer.address,
    value: ethers.utils.parseEther("0.00001"),
  });

  // Create task using org id created earlier
  await waitForInput("Task: create task");
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
    orgId,
    "update ethers version",
    "update ethers version to v2",
    ["golang"],
    complexityScore,
    reputationLevel
  );

  const taskEvent = await taskCreationEvent;
  const taskId = taskEvent.taskId.toNumber();

  // Assign task created above to self
  await waitForInput("Task: assign task");
  await taskContract.assignSelf(taskId);

  // Approve assign task request
  await waitForInput("Task: approve assign task");
  await taskContract.approveAssignRequest(taskId, signer.address);

  // Submit task
  await waitForInput("Task: submit task");
  await taskContract.submitTask(taskId);

  const initialBalance = await ethers.provider.getBalance(signer.address);

  // Approvers can confirm task
  await waitForInput("Task: approve task");
  await taskContract.approveTask(taskId);

  // Assignee should receive reward
  await waitForInput("Task: check reward");
  const reward = ethers.utils
    .parseUnits(multiplier.toString())
    .mul(1 + complexityScore);
  const newBalance = await ethers.provider.getBalance(signer.address);
  const expectedBalance = reward.add(initialBalance);

  const tokenBal = await tokenContract.balanceOf(
    signer.address,
    complexityScore
  );
  console.log("Token balance: ", tokenBal);
  console.log("ETH balance: ", newBalance);
  console.log("expected ETH balance: ", expectedBalance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
