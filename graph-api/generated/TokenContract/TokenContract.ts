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

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class SBTCreateToken extends ethereum.Event {
  get params(): SBTCreateToken__Params {
    return new SBTCreateToken__Params(this);
  }
}

export class SBTCreateToken__Params {
  _event: SBTCreateToken;

  constructor(event: SBTCreateToken) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class SBTRewardUser extends ethereum.Event {
  get params(): SBTRewardUser__Params {
    return new SBTRewardUser__Params(this);
  }
}

export class SBTRewardUser__Params {
  _event: SBTRewardUser;

  constructor(event: SBTRewardUser) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TransferBatch extends ethereum.Event {
  get params(): TransferBatch__Params {
    return new TransferBatch__Params(this);
  }
}

export class TransferBatch__Params {
  _event: TransferBatch;

  constructor(event: TransferBatch) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._event.parameters[3].value.toBigIntArray();
  }

  get values(): Array<BigInt> {
    return this._event.parameters[4].value.toBigIntArray();
  }
}

export class TransferSingle extends ethereum.Event {
  get params(): TransferSingle__Params {
    return new TransferSingle__Params(this);
  }
}

export class TransferSingle__Params {
  _event: TransferSingle;

  constructor(event: TransferSingle) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get id(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get value(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class URI extends ethereum.Event {
  get params(): URI__Params {
    return new URI__Params(this);
  }
}

export class URI__Params {
  _event: URI;

  constructor(event: URI) {
    this._event = event;
  }

  get value(): string {
    return this._event.parameters[0].value.toString();
  }

  get id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TokenContract extends ethereum.SmartContract {
  static bind(address: Address): TokenContract {
    return new TokenContract("TokenContract", address);
  }

  balanceOf(_address: Address, tokenId: BigInt): BigInt {
    let result = super.call(
      "balanceOf",
      "balanceOf(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(tokenId)
      ]
    );

    return result[0].toBigInt();
  }

  try_balanceOf(
    _address: Address,
    tokenId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "balanceOf",
      "balanceOf(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(tokenId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balanceOfBatch(accounts: Array<Address>, ids: Array<BigInt>): Array<BigInt> {
    let result = super.call(
      "balanceOfBatch",
      "balanceOfBatch(address[],uint256[]):(uint256[])",
      [
        ethereum.Value.fromAddressArray(accounts),
        ethereum.Value.fromUnsignedBigIntArray(ids)
      ]
    );

    return result[0].toBigIntArray();
  }

  try_balanceOfBatch(
    accounts: Array<Address>,
    ids: Array<BigInt>
  ): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "balanceOfBatch",
      "balanceOfBatch(address[],uint256[]):(uint256[])",
      [
        ethereum.Value.fromAddressArray(accounts),
        ethereum.Value.fromUnsignedBigIntArray(ids)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  createTokens(count: BigInt): boolean {
    let result = super.call("createTokens", "createTokens(uint256):(bool)", [
      ethereum.Value.fromUnsignedBigInt(count)
    ]);

    return result[0].toBoolean();
  }

  try_createTokens(count: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("createTokens", "createTokens(uint256):(bool)", [
      ethereum.Value.fromUnsignedBigInt(count)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  doesTokenExist(tokenId: BigInt): boolean {
    let result = super.call(
      "doesTokenExist",
      "doesTokenExist(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );

    return result[0].toBoolean();
  }

  try_doesTokenExist(tokenId: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "doesTokenExist",
      "doesTokenExist(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getTokenCount(): BigInt {
    let result = super.call("getTokenCount", "getTokenCount():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getTokenCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTokenCount",
      "getTokenCount():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isApprovedForAll(account: Address, operator: Address): boolean {
    let result = super.call(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromAddress(operator)
      ]
    );

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    account: Address,
    operator: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromAddress(operator)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  reward(to: Address, tokenId: BigInt, amount: BigInt): boolean {
    let result = super.call(
      "reward",
      "reward(address,uint256,uint256):(bool)",
      [
        ethereum.Value.fromAddress(to),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toBoolean();
  }

  try_reward(
    to: Address,
    tokenId: BigInt,
    amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "reward",
      "reward(address,uint256,uint256):(bool)",
      [
        ethereum.Value.fromAddress(to),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  stakableTokens(_address: Address, tokenId: BigInt): BigInt {
    let result = super.call(
      "stakableTokens",
      "stakableTokens(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(tokenId)
      ]
    );

    return result[0].toBigInt();
  }

  try_stakableTokens(
    _address: Address,
    tokenId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "stakableTokens",
      "stakableTokens(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(tokenId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  stake(_address: Address, tokenId: BigInt, amount: BigInt): boolean {
    let result = super.call("stake", "stake(address,uint256,uint256):(bool)", [
      ethereum.Value.fromAddress(_address),
      ethereum.Value.fromUnsignedBigInt(tokenId),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);

    return result[0].toBoolean();
  }

  try_stake(
    _address: Address,
    tokenId: BigInt,
    amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "stake",
      "stake(address,uint256,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  unStake(_address: Address, tokenId: BigInt, amount: BigInt): boolean {
    let result = super.call(
      "unStake",
      "unStake(address,uint256,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toBoolean();
  }

  try_unStake(
    _address: Address,
    tokenId: BigInt,
    amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "unStake",
      "unStake(address,uint256,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  uri(param0: BigInt): string {
    let result = super.call("uri", "uri(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toString();
  }

  try_uri(param0: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("uri", "uri(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
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

export class CreateTokensCall extends ethereum.Call {
  get inputs(): CreateTokensCall__Inputs {
    return new CreateTokensCall__Inputs(this);
  }

  get outputs(): CreateTokensCall__Outputs {
    return new CreateTokensCall__Outputs(this);
  }
}

export class CreateTokensCall__Inputs {
  _call: CreateTokensCall;

  constructor(call: CreateTokensCall) {
    this._call = call;
  }

  get count(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CreateTokensCall__Outputs {
  _call: CreateTokensCall;

  constructor(call: CreateTokensCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class RewardCall extends ethereum.Call {
  get inputs(): RewardCall__Inputs {
    return new RewardCall__Inputs(this);
  }

  get outputs(): RewardCall__Outputs {
    return new RewardCall__Outputs(this);
  }
}

export class RewardCall__Inputs {
  _call: RewardCall;

  constructor(call: RewardCall) {
    this._call = call;
  }

  get to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class RewardCall__Outputs {
  _call: RewardCall;

  constructor(call: RewardCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class SetApprovalForAllCall extends ethereum.Call {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get approved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}

export class StakeCall extends ethereum.Call {
  get inputs(): StakeCall__Inputs {
    return new StakeCall__Inputs(this);
  }

  get outputs(): StakeCall__Outputs {
    return new StakeCall__Outputs(this);
  }
}

export class StakeCall__Inputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }

  get _address(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class StakeCall__Outputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class UnStakeCall extends ethereum.Call {
  get inputs(): UnStakeCall__Inputs {
    return new UnStakeCall__Inputs(this);
  }

  get outputs(): UnStakeCall__Outputs {
    return new UnStakeCall__Outputs(this);
  }
}

export class UnStakeCall__Inputs {
  _call: UnStakeCall;

  constructor(call: UnStakeCall) {
    this._call = call;
  }

  get _address(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class UnStakeCall__Outputs {
  _call: UnStakeCall;

  constructor(call: UnStakeCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
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

  get _taskContractAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpdateTaskContractAddressCall__Outputs {
  _call: UpdateTaskContractAddressCall;

  constructor(call: UpdateTaskContractAddressCall) {
    this._call = call;
  }
}
