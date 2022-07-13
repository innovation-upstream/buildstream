/* eslint-disable node/no-unpublished-import */
import { ethers } from "hardhat";
const fs = require("fs");
const path = require("path");
const { waitForInput } = require("../utils/helpers.ts");

async function main() {
  await waitForInput("Contracts: initialize contracts");

  const OrgContract = fs.readFileSync(path.join(__dirname, "../abis/Org.json"));
  const SBTToken = fs.readFileSync(path.join(__dirname, "../abis/Token.json"));
  const TaskStorage = fs.readFileSync(
    path.join(__dirname, "../abis/TaskStorage.json")
  );
  const Task = fs.readFileSync(path.join(__dirname, "../abis/Task.json"));
  const Action = fs.readFileSync(path.join(__dirname, "../abis/Action.json"));
  const Treasury = fs.readFileSync(
    path.join(__dirname, "../abis/Treasury.json")
  );

  const org = await ethers.getContractFactory("Organization");
  const orgContract = await org.attach(OrgContract.address);

  const token = await ethers.getContractFactory("SBTToken");
  const tokenContract = await token.attach(SBTToken.address);

  const task = await ethers.getContractFactory("TaskContract");
  const taskContract = await task.attach(Task.address);

  const taskStorage = await ethers.getContractFactory("TaskStorageContract");
  const taskStorageContract = await taskStorage.attach(TaskStorage.address);

  await waitForInput("Organization: update action contract address");
  await orgContract.updateActionContract(Action.address);

  await waitForInput("Organization: update treasury contract address");
  await orgContract.updateTreasuryContract(Treasury.address);

  await waitForInput("Task: update treasury contract address");
  await taskContract.updateTreasuryContract(Treasury.address);

  await waitForInput("Token: update task contract address");
  await tokenContract.updateTaskContractAddress(Task.address);

  await waitForInput("Task Storage: updated task contract address");
  await taskStorageContract.updateTaskContractAddress(Task.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
