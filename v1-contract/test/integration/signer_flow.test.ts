import { expect } from "chai";
import { ethers } from "hardhat";

const multiplier = 0.00001;
const requiredConfirmations = 2;
const requiredApprovals = 1;

const actionType = {
  WITHDRAWAL: 0,
  ADD_REVIEWER: 1,
  ADD_APPROVER: 2,
  ADD_SIGNER: 3,
  REMOVE_REVIEWER: 4,
  REMOVE_APPROVER: 5,
  REMOVE_SIGNER: 6,
};

const getContractInstances = async () => {
  const org = await ethers.getContractFactory("Organization");
  const orgContract = await org.deploy({
    gasLimit: 3e7,
  });
  await orgContract.deployed();

  const action = await ethers.getContractFactory("ActionContract");
  const actionContract = await action.deploy(orgContract.address);
  await actionContract.deployed();

  await orgContract.updateActionContract(actionContract.address);

  return { actionContract, orgContract };
};

describe("Integration test: Signer flow", function () {
  it("Should add signer", async function () {
    const [, signer, signer1, signer2] = await ethers.getSigners();
    const { actionContract, orgContract } = await getContractInstances();

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
      ethers.utils.parseUnits(multiplier.toString()),
      ethers.constants.AddressZero,
      [ethers.constants.AddressZero],
      [ethers.constants.AddressZero],
      [signer.address, signer1.address],
      requiredConfirmations,
      requiredApprovals
    );

    const orgEvent = await orgCreationEvent;
    const orgId = orgEvent.orgId.toNumber();

    const actionCreationEvent = new Promise<any>((resolve, reject) => {
      actionContract.on("Creation", (orgId, actionId, event) => {
        event.removeListener();
        resolve({
          actionId: actionId,
        });
      });

      setTimeout(() => {
        reject(new Error("timeout"));
      }, 60000);
    });

    await actionContract["createAction(uint256,address,uint8,bytes)"](
      orgId,
      signer2.address,
      actionType.ADD_SIGNER,
      ethers.utils.toUtf8Bytes("")
    );

    const actionEvent = await actionCreationEvent;
    const actionId = actionEvent.actionId.toNumber();

    await actionContract.confirmAction(actionId);
    await actionContract.connect(signer).confirmAction(actionId);

    await orgContract.executeAction(actionId);

    expect(
      await (await orgContract.getSigners(orgId)).includes(signer2.address)
    ).to.be.equal(true);
  });

  it("Should remove signer", async function () {
    const [, signer, signer1, signer2] = await ethers.getSigners();
    const { actionContract, orgContract } = await getContractInstances();

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
      ethers.utils.parseUnits(multiplier.toString()),
      ethers.constants.AddressZero,
      [ethers.constants.AddressZero],
      [ethers.constants.AddressZero],
      [signer.address, signer1.address, signer2.address],
      requiredConfirmations,
      requiredApprovals
    );

    const orgEvent = await orgCreationEvent;
    const orgId = orgEvent.orgId.toNumber();

    const actionCreationEvent = new Promise<any>((resolve, reject) => {
      actionContract.on("Creation", (orgId, actionId, event) => {
        event.removeListener();
        resolve({
          actionId: actionId,
        });
      });

      setTimeout(() => {
        reject(new Error("timeout"));
      }, 60000);
    });

    await actionContract["createAction(uint256,address,uint8,bytes)"](
      orgId,
      signer1.address,
      actionType.REMOVE_SIGNER,
      ethers.utils.toUtf8Bytes("")
    );

    const actionEvent = await actionCreationEvent;
    const actionId = actionEvent.actionId.toNumber();

    await actionContract.confirmAction(actionId);
    await actionContract.connect(signer).confirmAction(actionId);

    await orgContract.executeAction(actionId);

    expect(
      await (await orgContract.getSigners(orgId)).includes(signer1.address)
    ).to.be.equal(false);
  });
});
