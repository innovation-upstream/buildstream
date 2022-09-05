// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class TaskArchived extends ethereum.Event {
  get params(): TaskArchived__Params {
    return new TaskArchived__Params(this);
  }
}

export class TaskArchived__Params {
  _event: TaskArchived;

  constructor(event: TaskArchived) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskAssignment extends ethereum.Event {
  get params(): TaskAssignment__Params {
    return new TaskAssignment__Params(this);
  }
}

export class TaskAssignment__Params {
  _event: TaskAssignment;

  constructor(event: TaskAssignment) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get taskId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TaskAssignmentRequested extends ethereum.Event {
  get params(): TaskAssignmentRequested__Params {
    return new TaskAssignmentRequested__Params(this);
  }
}

export class TaskAssignmentRequested__Params {
  _event: TaskAssignmentRequested;

  constructor(event: TaskAssignmentRequested) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get taskId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TaskClosed extends ethereum.Event {
  get params(): TaskClosed__Params {
    return new TaskClosed__Params(this);
  }
}

export class TaskClosed__Params {
  _event: TaskClosed;

  constructor(event: TaskClosed) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskConfirmation extends ethereum.Event {
  get params(): TaskConfirmation__Params {
    return new TaskConfirmation__Params(this);
  }
}

export class TaskConfirmation__Params {
  _event: TaskConfirmation;

  constructor(event: TaskConfirmation) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get taskId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TaskCreation extends ethereum.Event {
  get params(): TaskCreation__Params {
    return new TaskCreation__Params(this);
  }
}

export class TaskCreation__Params {
  _event: TaskCreation;

  constructor(event: TaskCreation) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskOpened extends ethereum.Event {
  get params(): TaskOpened__Params {
    return new TaskOpened__Params(this);
  }
}

export class TaskOpened__Params {
  _event: TaskOpened;

  constructor(event: TaskOpened) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskRequirementUpdated extends ethereum.Event {
  get params(): TaskRequirementUpdated__Params {
    return new TaskRequirementUpdated__Params(this);
  }
}

export class TaskRequirementUpdated__Params {
  _event: TaskRequirementUpdated;

  constructor(event: TaskRequirementUpdated) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskRevocation extends ethereum.Event {
  get params(): TaskRevocation__Params {
    return new TaskRevocation__Params(this);
  }
}

export class TaskRevocation__Params {
  _event: TaskRevocation;

  constructor(event: TaskRevocation) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get taskId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TaskSubmission extends ethereum.Event {
  get params(): TaskSubmission__Params {
    return new TaskSubmission__Params(this);
  }
}

export class TaskSubmission__Params {
  _event: TaskSubmission;

  constructor(event: TaskSubmission) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskUnassignment extends ethereum.Event {
  get params(): TaskUnassignment__Params {
    return new TaskUnassignment__Params(this);
  }
}

export class TaskUnassignment__Params {
  _event: TaskUnassignment;

  constructor(event: TaskUnassignment) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get taskId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TaskStorageContract__getTaskResultValue0Struct extends ethereum.Tuple {
  get id(): BigInt {
    return this[0].toBigInt();
  }

  get orgId(): BigInt {
    return this[1].toBigInt();
  }

  get title(): string {
    return this[2].toString();
  }

  get description(): string {
    return this[3].toString();
  }

  get assigner(): Address {
    return this[4].toAddress();
  }

  get assigneeAddress(): Address {
    return this[5].toAddress();
  }

  get taskTags(): Array<string> {
    return this[6].toStringArray();
  }

  get status(): i32 {
    return this[7].toI32();
  }

  get complexityScore(): BigInt {
    return this[8].toBigInt();
  }

  get reputationLevel(): BigInt {
    return this[9].toBigInt();
  }

  get requiredApprovals(): BigInt {
    return this[10].toBigInt();
  }

  get rewardAmount(): BigInt {
    return this[11].toBigInt();
  }

  get rewardToken(): Address {
    return this[12].toAddress();
  }

  get assignDate(): BigInt {
    return this[13].toBigInt();
  }

  get submitDate(): BigInt {
    return this[14].toBigInt();
  }

  get dueDate(): BigInt {
    return this[15].toBigInt();
  }

  get comment(): string {
    return this[16].toString();
  }
}

export class TaskStorageContract extends ethereum.SmartContract {
  static bind(address: Address): TaskStorageContract {
    return new TaskStorageContract("TaskStorageContract", address);
  }

  createTask(
    orgId: BigInt,
    title: string,
    description: string,
    taskTags: Array<string>,
    complexityScore: BigInt,
    reputationLevel: BigInt,
    requiredApprovals: BigInt,
    dueDate: BigInt
  ): BigInt {
    let result = super.call(
      "createTask",
      "createTask(uint256,string,string,string[],uint256,uint256,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(orgId),
        ethereum.Value.fromString(title),
        ethereum.Value.fromString(description),
        ethereum.Value.fromStringArray(taskTags),
        ethereum.Value.fromUnsignedBigInt(complexityScore),
        ethereum.Value.fromUnsignedBigInt(reputationLevel),
        ethereum.Value.fromUnsignedBigInt(requiredApprovals),
        ethereum.Value.fromUnsignedBigInt(dueDate)
      ]
    );

    return result[0].toBigInt();
  }

  try_createTask(
    orgId: BigInt,
    title: string,
    description: string,
    taskTags: Array<string>,
    complexityScore: BigInt,
    reputationLevel: BigInt,
    requiredApprovals: BigInt,
    dueDate: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "createTask",
      "createTask(uint256,string,string,string[],uint256,uint256,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(orgId),
        ethereum.Value.fromString(title),
        ethereum.Value.fromString(description),
        ethereum.Value.fromStringArray(taskTags),
        ethereum.Value.fromUnsignedBigInt(complexityScore),
        ethereum.Value.fromUnsignedBigInt(reputationLevel),
        ethereum.Value.fromUnsignedBigInt(requiredApprovals),
        ethereum.Value.fromUnsignedBigInt(dueDate)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  didApprove(taskId: BigInt, approver: Address): boolean {
    let result = super.call(
      "didApprove",
      "didApprove(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(taskId),
        ethereum.Value.fromAddress(approver)
      ]
    );

    return result[0].toBoolean();
  }

  try_didApprove(
    taskId: BigInt,
    approver: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "didApprove",
      "didApprove(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(taskId),
        ethereum.Value.fromAddress(approver)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getAssignmentRequests(taskId: BigInt): Array<Address> {
    let result = super.call(
      "getAssignmentRequests",
      "getAssignmentRequests(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(taskId)]
    );

    return result[0].toAddressArray();
  }

  try_getAssignmentRequests(
    taskId: BigInt
  ): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "getAssignmentRequests",
      "getAssignmentRequests(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(taskId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  getTask(taskId: BigInt): TaskStorageContract__getTaskResultValue0Struct {
    let result = super.call(
      "getTask",
      "getTask(uint256):((uint256,uint256,string,string,address,address,string[],uint8,uint256,uint256,uint256,uint256,address,uint256,uint256,uint256,string))",
      [ethereum.Value.fromUnsignedBigInt(taskId)]
    );

    return changetype<TaskStorageContract__getTaskResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getTask(
    taskId: BigInt
  ): ethereum.CallResult<TaskStorageContract__getTaskResultValue0Struct> {
    let result = super.tryCall(
      "getTask",
      "getTask(uint256):((uint256,uint256,string,string,address,address,string[],uint8,uint256,uint256,uint256,uint256,address,uint256,uint256,uint256,string))",
      [ethereum.Value.fromUnsignedBigInt(taskId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<TaskStorageContract__getTaskResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  getTaskCount(): BigInt {
    let result = super.call("getTaskCount", "getTaskCount():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getTaskCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getTaskCount", "getTaskCount():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ApproveTaskCall extends ethereum.Call {
  get inputs(): ApproveTaskCall__Inputs {
    return new ApproveTaskCall__Inputs(this);
  }

  get outputs(): ApproveTaskCall__Outputs {
    return new ApproveTaskCall__Outputs(this);
  }
}

export class ApproveTaskCall__Inputs {
  _call: ApproveTaskCall;

  constructor(call: ApproveTaskCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get approver(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ApproveTaskCall__Outputs {
  _call: ApproveTaskCall;

  constructor(call: ApproveTaskCall) {
    this._call = call;
  }
}

export class ArchiveCall extends ethereum.Call {
  get inputs(): ArchiveCall__Inputs {
    return new ArchiveCall__Inputs(this);
  }

  get outputs(): ArchiveCall__Outputs {
    return new ArchiveCall__Outputs(this);
  }
}

export class ArchiveCall__Inputs {
  _call: ArchiveCall;

  constructor(call: ArchiveCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ArchiveCall__Outputs {
  _call: ArchiveCall;

  constructor(call: ArchiveCall) {
    this._call = call;
  }
}

export class AssignCall extends ethereum.Call {
  get inputs(): AssignCall__Inputs {
    return new AssignCall__Inputs(this);
  }

  get outputs(): AssignCall__Outputs {
    return new AssignCall__Outputs(this);
  }
}

export class AssignCall__Inputs {
  _call: AssignCall;

  constructor(call: AssignCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get assignee(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get assigner(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class AssignCall__Outputs {
  _call: AssignCall;

  constructor(call: AssignCall) {
    this._call = call;
  }
}

export class CloseTaskCall extends ethereum.Call {
  get inputs(): CloseTaskCall__Inputs {
    return new CloseTaskCall__Inputs(this);
  }

  get outputs(): CloseTaskCall__Outputs {
    return new CloseTaskCall__Outputs(this);
  }
}

export class CloseTaskCall__Inputs {
  _call: CloseTaskCall;

  constructor(call: CloseTaskCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CloseTaskCall__Outputs {
  _call: CloseTaskCall;

  constructor(call: CloseTaskCall) {
    this._call = call;
  }
}

export class CreateTaskCall extends ethereum.Call {
  get inputs(): CreateTaskCall__Inputs {
    return new CreateTaskCall__Inputs(this);
  }

  get outputs(): CreateTaskCall__Outputs {
    return new CreateTaskCall__Outputs(this);
  }
}

export class CreateTaskCall__Inputs {
  _call: CreateTaskCall;

  constructor(call: CreateTaskCall) {
    this._call = call;
  }

  get orgId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get title(): string {
    return this._call.inputValues[1].value.toString();
  }

  get description(): string {
    return this._call.inputValues[2].value.toString();
  }

  get taskTags(): Array<string> {
    return this._call.inputValues[3].value.toStringArray();
  }

  get complexityScore(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get reputationLevel(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get requiredApprovals(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get dueDate(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }
}

export class CreateTaskCall__Outputs {
  _call: CreateTaskCall;

  constructor(call: CreateTaskCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class MakeAssignmentRequestCall extends ethereum.Call {
  get inputs(): MakeAssignmentRequestCall__Inputs {
    return new MakeAssignmentRequestCall__Inputs(this);
  }

  get outputs(): MakeAssignmentRequestCall__Outputs {
    return new MakeAssignmentRequestCall__Outputs(this);
  }
}

export class MakeAssignmentRequestCall__Inputs {
  _call: MakeAssignmentRequestCall;

  constructor(call: MakeAssignmentRequestCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get assignee(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class MakeAssignmentRequestCall__Outputs {
  _call: MakeAssignmentRequestCall;

  constructor(call: MakeAssignmentRequestCall) {
    this._call = call;
  }
}

export class OpenTaskCall extends ethereum.Call {
  get inputs(): OpenTaskCall__Inputs {
    return new OpenTaskCall__Inputs(this);
  }

  get outputs(): OpenTaskCall__Outputs {
    return new OpenTaskCall__Outputs(this);
  }
}

export class OpenTaskCall__Inputs {
  _call: OpenTaskCall;

  constructor(call: OpenTaskCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get rewardAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get rewardToken(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class OpenTaskCall__Outputs {
  _call: OpenTaskCall;

  constructor(call: OpenTaskCall) {
    this._call = call;
  }
}

export class RevokeApprovalCall extends ethereum.Call {
  get inputs(): RevokeApprovalCall__Inputs {
    return new RevokeApprovalCall__Inputs(this);
  }

  get outputs(): RevokeApprovalCall__Outputs {
    return new RevokeApprovalCall__Outputs(this);
  }
}

export class RevokeApprovalCall__Inputs {
  _call: RevokeApprovalCall;

  constructor(call: RevokeApprovalCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get approver(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RevokeApprovalCall__Outputs {
  _call: RevokeApprovalCall;

  constructor(call: RevokeApprovalCall) {
    this._call = call;
  }
}

export class SubmitTaskCall extends ethereum.Call {
  get inputs(): SubmitTaskCall__Inputs {
    return new SubmitTaskCall__Inputs(this);
  }

  get outputs(): SubmitTaskCall__Outputs {
    return new SubmitTaskCall__Outputs(this);
  }
}

export class SubmitTaskCall__Inputs {
  _call: SubmitTaskCall;

  constructor(call: SubmitTaskCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get assignee(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get comment(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class SubmitTaskCall__Outputs {
  _call: SubmitTaskCall;

  constructor(call: SubmitTaskCall) {
    this._call = call;
  }
}

export class UnassignCall extends ethereum.Call {
  get inputs(): UnassignCall__Inputs {
    return new UnassignCall__Inputs(this);
  }

  get outputs(): UnassignCall__Outputs {
    return new UnassignCall__Outputs(this);
  }
}

export class UnassignCall__Inputs {
  _call: UnassignCall;

  constructor(call: UnassignCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get assignee(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class UnassignCall__Outputs {
  _call: UnassignCall;

  constructor(call: UnassignCall) {
    this._call = call;
  }
}

export class UpdateTaskContractAddressCall extends ethereum.Call {
  get inputs(): UpdateTaskContractAddressCall__Inputs {
    return new UpdateTaskContractAddressCall__Inputs(this);
  }

  get outputs(): UpdateTaskContractAddressCall__Outputs {
    return new UpdateTaskContractAddressCall__Outputs(this);
  }
}

export class UpdateTaskContractAddressCall__Inputs {
  _call: UpdateTaskContractAddressCall;

  constructor(call: UpdateTaskContractAddressCall) {
    this._call = call;
  }

  get _address(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpdateTaskContractAddressCall__Outputs {
  _call: UpdateTaskContractAddressCall;

  constructor(call: UpdateTaskContractAddressCall) {
    this._call = call;
  }
}

export class UpdateTaskRequirementCall extends ethereum.Call {
  get inputs(): UpdateTaskRequirementCall__Inputs {
    return new UpdateTaskRequirementCall__Inputs(this);
  }

  get outputs(): UpdateTaskRequirementCall__Outputs {
    return new UpdateTaskRequirementCall__Outputs(this);
  }
}

export class UpdateTaskRequirementCall__Inputs {
  _call: UpdateTaskRequirementCall;

  constructor(call: UpdateTaskRequirementCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get complexityScore(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get reputationLevel(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get dueDate(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class UpdateTaskRequirementCall__Outputs {
  _call: UpdateTaskRequirementCall;

  constructor(call: UpdateTaskRequirementCall) {
    this._call = call;
  }
}
