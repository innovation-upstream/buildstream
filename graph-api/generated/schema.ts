// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Organization extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Organization entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Organization must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Organization", id.toString(), this);
    }
  }

  static load(id: string): Organization | null {
    return changetype<Organization | null>(store.get("Organization", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get orgId(): BigInt {
    let value = this.get("orgId");
    return value!.toBigInt();
  }

  set orgId(value: BigInt) {
    this.set("orgId", Value.fromBigInt(value));
  }

  get name(): string {
    let value = this.get("name");
    return value!.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get description(): string {
    let value = this.get("description");
    return value!.toString();
  }

  set description(value: string) {
    this.set("description", Value.fromString(value));
  }

  get reviewers(): Array<string> {
    let value = this.get("reviewers");
    return value!.toStringArray();
  }

  set reviewers(value: Array<string>) {
    this.set("reviewers", Value.fromStringArray(value));
  }

  get approvers(): Array<string> {
    let value = this.get("approvers");
    return value!.toStringArray();
  }

  set approvers(value: Array<string>) {
    this.set("approvers", Value.fromStringArray(value));
  }

  get signers(): Array<string> {
    let value = this.get("signers");
    return value!.toStringArray();
  }

  set signers(value: Array<string>) {
    this.set("signers", Value.fromStringArray(value));
  }

  get requiredTaskApprovals(): BigInt {
    let value = this.get("requiredTaskApprovals");
    return value!.toBigInt();
  }

  set requiredTaskApprovals(value: BigInt) {
    this.set("requiredTaskApprovals", Value.fromBigInt(value));
  }

  get requiredConfirmations(): BigInt {
    let value = this.get("requiredConfirmations");
    return value!.toBigInt();
  }

  set requiredConfirmations(value: BigInt) {
    this.set("requiredConfirmations", Value.fromBigInt(value));
  }

  get rewardMultiplier(): BigInt {
    let value = this.get("rewardMultiplier");
    return value!.toBigInt();
  }

  set rewardMultiplier(value: BigInt) {
    this.set("rewardMultiplier", Value.fromBigInt(value));
  }

  get rewardSlashDivisor(): BigInt {
    let value = this.get("rewardSlashDivisor");
    return value!.toBigInt();
  }

  set rewardSlashDivisor(value: BigInt) {
    this.set("rewardSlashDivisor", Value.fromBigInt(value));
  }

  get slashRewardEvery(): BigInt {
    let value = this.get("slashRewardEvery");
    return value!.toBigInt();
  }

  set slashRewardEvery(value: BigInt) {
    this.set("slashRewardEvery", Value.fromBigInt(value));
  }

  get rewardToken(): Bytes {
    let value = this.get("rewardToken");
    return value!.toBytes();
  }

  set rewardToken(value: Bytes) {
    this.set("rewardToken", Value.fromBytes(value));
  }

  get isInitialized(): boolean {
    let value = this.get("isInitialized");
    return value!.toBoolean();
  }

  set isInitialized(value: boolean) {
    this.set("isInitialized", Value.fromBoolean(value));
  }

  get treasury(): string {
    let value = this.get("treasury");
    return value!.toString();
  }

  set treasury(value: string) {
    this.set("treasury", Value.fromString(value));
  }
}

export class Task extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Task entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Task must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Task", id.toString(), this);
    }
  }

  static load(id: string): Task | null {
    return changetype<Task | null>(store.get("Task", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get taskId(): BigInt {
    let value = this.get("taskId");
    return value!.toBigInt();
  }

  set taskId(value: BigInt) {
    this.set("taskId", Value.fromBigInt(value));
  }

  get orgId(): string {
    let value = this.get("orgId");
    return value!.toString();
  }

  set orgId(value: string) {
    this.set("orgId", Value.fromString(value));
  }

  get title(): string | null {
    let value = this.get("title");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set title(value: string | null) {
    if (!value) {
      this.unset("title");
    } else {
      this.set("title", Value.fromString(<string>value));
    }
  }

  get description(): string | null {
    let value = this.get("description");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set description(value: string | null) {
    if (!value) {
      this.unset("description");
    } else {
      this.set("description", Value.fromString(<string>value));
    }
  }

  get assigner(): string {
    let value = this.get("assigner");
    return value!.toString();
  }

  set assigner(value: string) {
    this.set("assigner", Value.fromString(value));
  }

  get assignee(): string | null {
    let value = this.get("assignee");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set assignee(value: string | null) {
    if (!value) {
      this.unset("assignee");
    } else {
      this.set("assignee", Value.fromString(<string>value));
    }
  }

  get taskTags(): Array<string> {
    let value = this.get("taskTags");
    return value!.toStringArray();
  }

  set taskTags(value: Array<string>) {
    this.set("taskTags", Value.fromStringArray(value));
  }

  get status(): i32 {
    let value = this.get("status");
    return value!.toI32();
  }

  set status(value: i32) {
    this.set("status", Value.fromI32(value));
  }

  get complexityScore(): BigInt {
    let value = this.get("complexityScore");
    return value!.toBigInt();
  }

  set complexityScore(value: BigInt) {
    this.set("complexityScore", Value.fromBigInt(value));
  }

  get reputationLevel(): BigInt {
    let value = this.get("reputationLevel");
    return value!.toBigInt();
  }

  set reputationLevel(value: BigInt) {
    this.set("reputationLevel", Value.fromBigInt(value));
  }

  get requiredApprovals(): BigInt {
    let value = this.get("requiredApprovals");
    return value!.toBigInt();
  }

  set requiredApprovals(value: BigInt) {
    this.set("requiredApprovals", Value.fromBigInt(value));
  }

  get rewardAmount(): BigInt | null {
    let value = this.get("rewardAmount");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set rewardAmount(value: BigInt | null) {
    if (!value) {
      this.unset("rewardAmount");
    } else {
      this.set("rewardAmount", Value.fromBigInt(<BigInt>value));
    }
  }

  get rewardToken(): Bytes | null {
    let value = this.get("rewardToken");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set rewardToken(value: Bytes | null) {
    if (!value) {
      this.unset("rewardToken");
    } else {
      this.set("rewardToken", Value.fromBytes(<Bytes>value));
    }
  }

  get assignDate(): BigInt | null {
    let value = this.get("assignDate");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set assignDate(value: BigInt | null) {
    if (!value) {
      this.unset("assignDate");
    } else {
      this.set("assignDate", Value.fromBigInt(<BigInt>value));
    }
  }

  get submitDate(): BigInt | null {
    let value = this.get("submitDate");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set submitDate(value: BigInt | null) {
    if (!value) {
      this.unset("submitDate");
    } else {
      this.set("submitDate", Value.fromBigInt(<BigInt>value));
    }
  }

  get taskDuration(): BigInt {
    let value = this.get("taskDuration");
    return value!.toBigInt();
  }

  set taskDuration(value: BigInt) {
    this.set("taskDuration", Value.fromBigInt(value));
  }

  get comment(): string | null {
    let value = this.get("comment");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set comment(value: string | null) {
    if (!value) {
      this.unset("comment");
    } else {
      this.set("comment", Value.fromString(<string>value));
    }
  }

  get approvedBy(): Array<string> | null {
    let value = this.get("approvedBy");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set approvedBy(value: Array<string> | null) {
    if (!value) {
      this.unset("approvedBy");
    } else {
      this.set("approvedBy", Value.fromStringArray(<Array<string>>value));
    }
  }

  get assignmentRequest(): Array<string> | null {
    let value = this.get("assignmentRequest");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set assignmentRequest(value: Array<string> | null) {
    if (!value) {
      this.unset("assignmentRequest");
    } else {
      this.set(
        "assignmentRequest",
        Value.fromStringArray(<Array<string>>value)
      );
    }
  }
}

export class TaskCount extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TaskCount entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TaskCount must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TaskCount", id.toString(), this);
    }
  }

  static load(id: string): TaskCount | null {
    return changetype<TaskCount | null>(store.get("TaskCount", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get orgId(): BigInt {
    let value = this.get("orgId");
    return value!.toBigInt();
  }

  set orgId(value: BigInt) {
    this.set("orgId", Value.fromBigInt(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value!.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }
}

export class TreasuryToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TreasuryToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TreasuryToken must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TreasuryToken", id.toString(), this);
    }
  }

  static load(id: string): TreasuryToken | null {
    return changetype<TreasuryToken | null>(store.get("TreasuryToken", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get orgId(): string {
    let value = this.get("orgId");
    return value!.toString();
  }

  set orgId(value: string) {
    this.set("orgId", Value.fromString(value));
  }

  get token(): string {
    let value = this.get("token");
    return value!.toString();
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get balance(): BigInt {
    let value = this.get("balance");
    return value!.toBigInt();
  }

  set balance(value: BigInt) {
    this.set("balance", Value.fromBigInt(value));
  }

  get lockedBalance(): BigInt {
    let value = this.get("lockedBalance");
    return value!.toBigInt();
  }

  set lockedBalance(value: BigInt) {
    this.set("lockedBalance", Value.fromBigInt(value));
  }
}

export class Treasury extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Treasury entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Treasury must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Treasury", id.toString(), this);
    }
  }

  static load(id: string): Treasury | null {
    return changetype<Treasury | null>(store.get("Treasury", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get orgId(): BigInt {
    let value = this.get("orgId");
    return value!.toBigInt();
  }

  set orgId(value: BigInt) {
    this.set("orgId", Value.fromBigInt(value));
  }

  get tokens(): Array<string> | null {
    let value = this.get("tokens");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set tokens(value: Array<string> | null) {
    if (!value) {
      this.unset("tokens");
    } else {
      this.set("tokens", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class Action extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Action entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Action must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Action", id.toString(), this);
    }
  }

  static load(id: string): Action | null {
    return changetype<Action | null>(store.get("Action", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get actionId(): BigInt {
    let value = this.get("actionId");
    return value!.toBigInt();
  }

  set actionId(value: BigInt) {
    this.set("actionId", Value.fromBigInt(value));
  }

  get orgId(): BigInt {
    let value = this.get("orgId");
    return value!.toBigInt();
  }

  set orgId(value: BigInt) {
    this.set("orgId", Value.fromBigInt(value));
  }

  get initiator(): string {
    let value = this.get("initiator");
    return value!.toString();
  }

  set initiator(value: string) {
    this.set("initiator", Value.fromString(value));
  }

  get targetAddress(): string | null {
    let value = this.get("targetAddress");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set targetAddress(value: string | null) {
    if (!value) {
      this.unset("targetAddress");
    } else {
      this.set("targetAddress", Value.fromString(<string>value));
    }
  }

  get value(): BigInt | null {
    let value = this.get("value");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set value(value: BigInt | null) {
    if (!value) {
      this.unset("value");
    } else {
      this.set("value", Value.fromBigInt(<BigInt>value));
    }
  }

  get data(): Bytes | null {
    let value = this.get("data");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set data(value: Bytes | null) {
    if (!value) {
      this.unset("data");
    } else {
      this.set("data", Value.fromBytes(<Bytes>value));
    }
  }

  get executed(): boolean {
    let value = this.get("executed");
    return value!.toBoolean();
  }

  set executed(value: boolean) {
    this.set("executed", Value.fromBoolean(value));
  }

  get tokenAddress(): string | null {
    let value = this.get("tokenAddress");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set tokenAddress(value: string | null) {
    if (!value) {
      this.unset("tokenAddress");
    } else {
      this.set("tokenAddress", Value.fromString(<string>value));
    }
  }

  get actionType(): i32 {
    let value = this.get("actionType");
    return value!.toI32();
  }

  set actionType(value: i32) {
    this.set("actionType", Value.fromI32(value));
  }

  get approvedBy(): Array<string> | null {
    let value = this.get("approvedBy");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set approvedBy(value: Array<string> | null) {
    if (!value) {
      this.unset("approvedBy");
    } else {
      this.set("approvedBy", Value.fromStringArray(<Array<string>>value));
    }
  }
}
