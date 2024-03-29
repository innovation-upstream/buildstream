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

  get teamAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get taskId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get assignee(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class TeamArchived extends ethereum.Event {
  get params(): TeamArchived__Params {
    return new TeamArchived__Params(this);
  }
}

export class TeamArchived__Params {
  _event: TeamArchived;

  constructor(event: TeamArchived) {
    this._event = event;
  }

  get teamAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class TeamCreation extends ethereum.Event {
  get params(): TeamCreation__Params {
    return new TeamCreation__Params(this);
  }
}

export class TeamCreation__Params {
  _event: TeamCreation;

  constructor(event: TeamCreation) {
    this._event = event;
  }

  get teamAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get team(): TeamCreationTeamStruct {
    return changetype<TeamCreationTeamStruct>(
      this._event.parameters[1].value.toTuple()
    );
  }
}

export class TeamCreationTeamStruct extends ethereum.Tuple {
  get id(): BigInt {
    return this[0].toBigInt();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get walletAddress(): Address {
    return this[3].toAddress();
  }

  get archived(): boolean {
    return this[4].toBoolean();
  }

  get members(): Array<Address> {
    return this[5].toAddressArray();
  }

  get teamRewardMultiplier(): BigInt {
    return this[6].toBigInt();
  }
}

export class TeamMemberAdded extends ethereum.Event {
  get params(): TeamMemberAdded__Params {
    return new TeamMemberAdded__Params(this);
  }
}

export class TeamMemberAdded__Params {
  _event: TeamMemberAdded;

  constructor(event: TeamMemberAdded) {
    this._event = event;
  }

  get teamAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get member(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TeamMemberRemoved extends ethereum.Event {
  get params(): TeamMemberRemoved__Params {
    return new TeamMemberRemoved__Params(this);
  }
}

export class TeamMemberRemoved__Params {
  _event: TeamMemberRemoved;

  constructor(event: TeamMemberRemoved) {
    this._event = event;
  }

  get teamAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get member(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TeamUnArchived extends ethereum.Event {
  get params(): TeamUnArchived__Params {
    return new TeamUnArchived__Params(this);
  }
}

export class TeamUnArchived__Params {
  _event: TeamUnArchived;

  constructor(event: TeamUnArchived) {
    this._event = event;
  }

  get teamAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class TeamUpdated extends ethereum.Event {
  get params(): TeamUpdated__Params {
    return new TeamUpdated__Params(this);
  }
}

export class TeamUpdated__Params {
  _event: TeamUpdated;

  constructor(event: TeamUpdated) {
    this._event = event;
  }

  get teamAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get team(): TeamUpdatedTeamStruct {
    return changetype<TeamUpdatedTeamStruct>(
      this._event.parameters[1].value.toTuple()
    );
  }
}

export class TeamUpdatedTeamStruct extends ethereum.Tuple {
  get id(): BigInt {
    return this[0].toBigInt();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get walletAddress(): Address {
    return this[3].toAddress();
  }

  get archived(): boolean {
    return this[4].toBoolean();
  }

  get members(): Array<Address> {
    return this[5].toAddressArray();
  }

  get teamRewardMultiplier(): BigInt {
    return this[6].toBigInt();
  }
}

export class TeamContract__getTeamResultValue0Struct extends ethereum.Tuple {
  get id(): BigInt {
    return this[0].toBigInt();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get walletAddress(): Address {
    return this[3].toAddress();
  }

  get archived(): boolean {
    return this[4].toBoolean();
  }

  get members(): Array<Address> {
    return this[5].toAddressArray();
  }

  get teamRewardMultiplier(): BigInt {
    return this[6].toBigInt();
  }
}

export class TeamContract extends ethereum.SmartContract {
  static bind(address: Address): TeamContract {
    return new TeamContract("TeamContract", address);
  }

  createTeam(
    name: string,
    description: string,
    members: Array<Address>,
    teamRewardMultiplier: BigInt
  ): BigInt {
    let result = super.call(
      "createTeam",
      "createTeam(string,string,address[],uint256):(uint256)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromString(description),
        ethereum.Value.fromAddressArray(members),
        ethereum.Value.fromUnsignedBigInt(teamRewardMultiplier)
      ]
    );

    return result[0].toBigInt();
  }

  try_createTeam(
    name: string,
    description: string,
    members: Array<Address>,
    teamRewardMultiplier: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "createTeam",
      "createTeam(string,string,address[],uint256):(uint256)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromString(description),
        ethereum.Value.fromAddressArray(members),
        ethereum.Value.fromUnsignedBigInt(teamRewardMultiplier)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  doesTeamExist(walletAddress: Address): boolean {
    let result = super.call("doesTeamExist", "doesTeamExist(address):(bool)", [
      ethereum.Value.fromAddress(walletAddress)
    ]);

    return result[0].toBoolean();
  }

  try_doesTeamExist(walletAddress: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "doesTeamExist",
      "doesTeamExist(address):(bool)",
      [ethereum.Value.fromAddress(walletAddress)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getTaskAssignee(taskId: BigInt): Address {
    let result = super.call(
      "getTaskAssignee",
      "getTaskAssignee(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(taskId)]
    );

    return result[0].toAddress();
  }

  try_getTaskAssignee(taskId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getTaskAssignee",
      "getTaskAssignee(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(taskId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getTeam(teamAddress: Address): TeamContract__getTeamResultValue0Struct {
    let result = super.call(
      "getTeam",
      "getTeam(address):((uint256,string,string,address,bool,address[],uint256))",
      [ethereum.Value.fromAddress(teamAddress)]
    );

    return changetype<TeamContract__getTeamResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getTeam(
    teamAddress: Address
  ): ethereum.CallResult<TeamContract__getTeamResultValue0Struct> {
    let result = super.tryCall(
      "getTeam",
      "getTeam(address):((uint256,string,string,address,bool,address[],uint256))",
      [ethereum.Value.fromAddress(teamAddress)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<TeamContract__getTeamResultValue0Struct>(value[0].toTuple())
    );
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

export class AddMemberCall extends ethereum.Call {
  get inputs(): AddMemberCall__Inputs {
    return new AddMemberCall__Inputs(this);
  }

  get outputs(): AddMemberCall__Outputs {
    return new AddMemberCall__Outputs(this);
  }
}

export class AddMemberCall__Inputs {
  _call: AddMemberCall;

  constructor(call: AddMemberCall) {
    this._call = call;
  }

  get member(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddMemberCall__Outputs {
  _call: AddMemberCall;

  constructor(call: AddMemberCall) {
    this._call = call;
  }
}

export class AssignTaskCall extends ethereum.Call {
  get inputs(): AssignTaskCall__Inputs {
    return new AssignTaskCall__Inputs(this);
  }

  get outputs(): AssignTaskCall__Outputs {
    return new AssignTaskCall__Outputs(this);
  }
}

export class AssignTaskCall__Inputs {
  _call: AssignTaskCall;

  constructor(call: AssignTaskCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get assignee(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class AssignTaskCall__Outputs {
  _call: AssignTaskCall;

  constructor(call: AssignTaskCall) {
    this._call = call;
  }
}

export class CreateTeamCall extends ethereum.Call {
  get inputs(): CreateTeamCall__Inputs {
    return new CreateTeamCall__Inputs(this);
  }

  get outputs(): CreateTeamCall__Outputs {
    return new CreateTeamCall__Outputs(this);
  }
}

export class CreateTeamCall__Inputs {
  _call: CreateTeamCall;

  constructor(call: CreateTeamCall) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get description(): string {
    return this._call.inputValues[1].value.toString();
  }

  get members(): Array<Address> {
    return this._call.inputValues[2].value.toAddressArray();
  }

  get teamRewardMultiplier(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class CreateTeamCall__Outputs {
  _call: CreateTeamCall;

  constructor(call: CreateTeamCall) {
    this._call = call;
  }

  get teamId(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class RemoveMemberCall extends ethereum.Call {
  get inputs(): RemoveMemberCall__Inputs {
    return new RemoveMemberCall__Inputs(this);
  }

  get outputs(): RemoveMemberCall__Outputs {
    return new RemoveMemberCall__Outputs(this);
  }
}

export class RemoveMemberCall__Inputs {
  _call: RemoveMemberCall;

  constructor(call: RemoveMemberCall) {
    this._call = call;
  }

  get member(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveMemberCall__Outputs {
  _call: RemoveMemberCall;

  constructor(call: RemoveMemberCall) {
    this._call = call;
  }
}

export class UpdateTaskStorageContractAddressCall extends ethereum.Call {
  get inputs(): UpdateTaskStorageContractAddressCall__Inputs {
    return new UpdateTaskStorageContractAddressCall__Inputs(this);
  }

  get outputs(): UpdateTaskStorageContractAddressCall__Outputs {
    return new UpdateTaskStorageContractAddressCall__Outputs(this);
  }
}

export class UpdateTaskStorageContractAddressCall__Inputs {
  _call: UpdateTaskStorageContractAddressCall;

  constructor(call: UpdateTaskStorageContractAddressCall) {
    this._call = call;
  }

  get taskStorageContractAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpdateTaskStorageContractAddressCall__Outputs {
  _call: UpdateTaskStorageContractAddressCall;

  constructor(call: UpdateTaskStorageContractAddressCall) {
    this._call = call;
  }
}

export class UpdateTeamCall extends ethereum.Call {
  get inputs(): UpdateTeamCall__Inputs {
    return new UpdateTeamCall__Inputs(this);
  }

  get outputs(): UpdateTeamCall__Outputs {
    return new UpdateTeamCall__Outputs(this);
  }
}

export class UpdateTeamCall__Inputs {
  _call: UpdateTeamCall;

  constructor(call: UpdateTeamCall) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get description(): string {
    return this._call.inputValues[1].value.toString();
  }

  get teamRewardMultiplier(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class UpdateTeamCall__Outputs {
  _call: UpdateTeamCall;

  constructor(call: UpdateTeamCall) {
    this._call = call;
  }
}
