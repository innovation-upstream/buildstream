
import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace BuildstreamV1TestTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: bigint;
  Bytes: any;
};

export type Action = {
  id: Scalars['ID'];
  actionId: Scalars['BigInt'];
  orgId: Scalars['BigInt'];
  initiator: Scalars['String'];
  targetAddress?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
  data?: Maybe<Scalars['Bytes']>;
  executed: Scalars['Boolean'];
  tokenAddress?: Maybe<Scalars['String']>;
  actionType: Scalars['Int'];
  approvedBy?: Maybe<Array<Scalars['String']>>;
};

export type Action_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  actionId?: InputMaybe<Scalars['BigInt']>;
  actionId_not?: InputMaybe<Scalars['BigInt']>;
  actionId_gt?: InputMaybe<Scalars['BigInt']>;
  actionId_lt?: InputMaybe<Scalars['BigInt']>;
  actionId_gte?: InputMaybe<Scalars['BigInt']>;
  actionId_lte?: InputMaybe<Scalars['BigInt']>;
  actionId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  actionId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  orgId?: InputMaybe<Scalars['BigInt']>;
  orgId_not?: InputMaybe<Scalars['BigInt']>;
  orgId_gt?: InputMaybe<Scalars['BigInt']>;
  orgId_lt?: InputMaybe<Scalars['BigInt']>;
  orgId_gte?: InputMaybe<Scalars['BigInt']>;
  orgId_lte?: InputMaybe<Scalars['BigInt']>;
  orgId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  orgId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initiator?: InputMaybe<Scalars['String']>;
  initiator_not?: InputMaybe<Scalars['String']>;
  initiator_gt?: InputMaybe<Scalars['String']>;
  initiator_lt?: InputMaybe<Scalars['String']>;
  initiator_gte?: InputMaybe<Scalars['String']>;
  initiator_lte?: InputMaybe<Scalars['String']>;
  initiator_in?: InputMaybe<Array<Scalars['String']>>;
  initiator_not_in?: InputMaybe<Array<Scalars['String']>>;
  initiator_contains?: InputMaybe<Scalars['String']>;
  initiator_contains_nocase?: InputMaybe<Scalars['String']>;
  initiator_not_contains?: InputMaybe<Scalars['String']>;
  initiator_not_contains_nocase?: InputMaybe<Scalars['String']>;
  initiator_starts_with?: InputMaybe<Scalars['String']>;
  initiator_starts_with_nocase?: InputMaybe<Scalars['String']>;
  initiator_not_starts_with?: InputMaybe<Scalars['String']>;
  initiator_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  initiator_ends_with?: InputMaybe<Scalars['String']>;
  initiator_ends_with_nocase?: InputMaybe<Scalars['String']>;
  initiator_not_ends_with?: InputMaybe<Scalars['String']>;
  initiator_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  targetAddress?: InputMaybe<Scalars['String']>;
  targetAddress_not?: InputMaybe<Scalars['String']>;
  targetAddress_gt?: InputMaybe<Scalars['String']>;
  targetAddress_lt?: InputMaybe<Scalars['String']>;
  targetAddress_gte?: InputMaybe<Scalars['String']>;
  targetAddress_lte?: InputMaybe<Scalars['String']>;
  targetAddress_in?: InputMaybe<Array<Scalars['String']>>;
  targetAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  targetAddress_contains?: InputMaybe<Scalars['String']>;
  targetAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  targetAddress_not_contains?: InputMaybe<Scalars['String']>;
  targetAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  targetAddress_starts_with?: InputMaybe<Scalars['String']>;
  targetAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  targetAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  targetAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  targetAddress_ends_with?: InputMaybe<Scalars['String']>;
  targetAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  targetAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  targetAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  data?: InputMaybe<Scalars['Bytes']>;
  data_not?: InputMaybe<Scalars['Bytes']>;
  data_in?: InputMaybe<Array<Scalars['Bytes']>>;
  data_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  data_contains?: InputMaybe<Scalars['Bytes']>;
  data_not_contains?: InputMaybe<Scalars['Bytes']>;
  executed?: InputMaybe<Scalars['Boolean']>;
  executed_not?: InputMaybe<Scalars['Boolean']>;
  executed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  executed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  tokenAddress?: InputMaybe<Scalars['String']>;
  tokenAddress_not?: InputMaybe<Scalars['String']>;
  tokenAddress_gt?: InputMaybe<Scalars['String']>;
  tokenAddress_lt?: InputMaybe<Scalars['String']>;
  tokenAddress_gte?: InputMaybe<Scalars['String']>;
  tokenAddress_lte?: InputMaybe<Scalars['String']>;
  tokenAddress_in?: InputMaybe<Array<Scalars['String']>>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenAddress_contains?: InputMaybe<Scalars['String']>;
  tokenAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']>;
  tokenAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']>;
  tokenAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  tokenAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']>;
  tokenAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  tokenAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  actionType?: InputMaybe<Scalars['Int']>;
  actionType_not?: InputMaybe<Scalars['Int']>;
  actionType_gt?: InputMaybe<Scalars['Int']>;
  actionType_lt?: InputMaybe<Scalars['Int']>;
  actionType_gte?: InputMaybe<Scalars['Int']>;
  actionType_lte?: InputMaybe<Scalars['Int']>;
  actionType_in?: InputMaybe<Array<Scalars['Int']>>;
  actionType_not_in?: InputMaybe<Array<Scalars['Int']>>;
  approvedBy?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_contains?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not_contains?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Action_orderBy =
  | 'id'
  | 'actionId'
  | 'orgId'
  | 'initiator'
  | 'targetAddress'
  | 'value'
  | 'data'
  | 'executed'
  | 'tokenAddress'
  | 'actionType'
  | 'approvedBy';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Organization = {
  id: Scalars['ID'];
  orgId: Scalars['BigInt'];
  name: Scalars['String'];
  description: Scalars['String'];
  approvers: Array<Scalars['String']>;
  signers: Array<Scalars['String']>;
  requiredTaskApprovals: Scalars['BigInt'];
  requiredConfirmations: Scalars['BigInt'];
  rewardMultiplier: Scalars['BigInt'];
  rewardSlashMultiplier: Scalars['BigInt'];
  slashRewardEvery: Scalars['BigInt'];
  rewardToken: Scalars['Bytes'];
  isInitialized: Scalars['Boolean'];
  treasury: Treasury;
  stat?: Maybe<OrganizationStat>;
};

export type OrganizationStat = {
  id: Scalars['ID'];
  proposedTasks: Scalars['BigInt'];
  openedTasks: Scalars['BigInt'];
  assignedTasks: Scalars['BigInt'];
  submittedTasks: Scalars['BigInt'];
  closedTasks: Scalars['BigInt'];
  archivedTasks: Scalars['BigInt'];
  tags?: Maybe<Array<Scalars['String']>>;
};

export type OrganizationStat_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposedTasks?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_not?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  openedTasks?: InputMaybe<Scalars['BigInt']>;
  openedTasks_not?: InputMaybe<Scalars['BigInt']>;
  openedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  openedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  openedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  openedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  openedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  openedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assignedTasks?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_not?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assignedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submittedTasks?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_not?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submittedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  closedTasks?: InputMaybe<Scalars['BigInt']>;
  closedTasks_not?: InputMaybe<Scalars['BigInt']>;
  closedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  closedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  closedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  closedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  closedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  closedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  archivedTasks?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_not?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  archivedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  tags_not?: InputMaybe<Array<Scalars['String']>>;
  tags_contains?: InputMaybe<Array<Scalars['String']>>;
  tags_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  tags_not_contains?: InputMaybe<Array<Scalars['String']>>;
  tags_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type OrganizationStat_orderBy =
  | 'id'
  | 'proposedTasks'
  | 'openedTasks'
  | 'assignedTasks'
  | 'submittedTasks'
  | 'closedTasks'
  | 'archivedTasks'
  | 'tags';

export type Organization_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  orgId?: InputMaybe<Scalars['BigInt']>;
  orgId_not?: InputMaybe<Scalars['BigInt']>;
  orgId_gt?: InputMaybe<Scalars['BigInt']>;
  orgId_lt?: InputMaybe<Scalars['BigInt']>;
  orgId_gte?: InputMaybe<Scalars['BigInt']>;
  orgId_lte?: InputMaybe<Scalars['BigInt']>;
  orgId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  orgId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  approvers?: InputMaybe<Array<Scalars['String']>>;
  approvers_not?: InputMaybe<Array<Scalars['String']>>;
  approvers_contains?: InputMaybe<Array<Scalars['String']>>;
  approvers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  approvers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  approvers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  signers?: InputMaybe<Array<Scalars['String']>>;
  signers_not?: InputMaybe<Array<Scalars['String']>>;
  signers_contains?: InputMaybe<Array<Scalars['String']>>;
  signers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  signers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  signers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  requiredTaskApprovals?: InputMaybe<Scalars['BigInt']>;
  requiredTaskApprovals_not?: InputMaybe<Scalars['BigInt']>;
  requiredTaskApprovals_gt?: InputMaybe<Scalars['BigInt']>;
  requiredTaskApprovals_lt?: InputMaybe<Scalars['BigInt']>;
  requiredTaskApprovals_gte?: InputMaybe<Scalars['BigInt']>;
  requiredTaskApprovals_lte?: InputMaybe<Scalars['BigInt']>;
  requiredTaskApprovals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requiredTaskApprovals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requiredConfirmations?: InputMaybe<Scalars['BigInt']>;
  requiredConfirmations_not?: InputMaybe<Scalars['BigInt']>;
  requiredConfirmations_gt?: InputMaybe<Scalars['BigInt']>;
  requiredConfirmations_lt?: InputMaybe<Scalars['BigInt']>;
  requiredConfirmations_gte?: InputMaybe<Scalars['BigInt']>;
  requiredConfirmations_lte?: InputMaybe<Scalars['BigInt']>;
  requiredConfirmations_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requiredConfirmations_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardMultiplier?: InputMaybe<Scalars['BigInt']>;
  rewardMultiplier_not?: InputMaybe<Scalars['BigInt']>;
  rewardMultiplier_gt?: InputMaybe<Scalars['BigInt']>;
  rewardMultiplier_lt?: InputMaybe<Scalars['BigInt']>;
  rewardMultiplier_gte?: InputMaybe<Scalars['BigInt']>;
  rewardMultiplier_lte?: InputMaybe<Scalars['BigInt']>;
  rewardMultiplier_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardMultiplier_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardSlashMultiplier?: InputMaybe<Scalars['BigInt']>;
  rewardSlashMultiplier_not?: InputMaybe<Scalars['BigInt']>;
  rewardSlashMultiplier_gt?: InputMaybe<Scalars['BigInt']>;
  rewardSlashMultiplier_lt?: InputMaybe<Scalars['BigInt']>;
  rewardSlashMultiplier_gte?: InputMaybe<Scalars['BigInt']>;
  rewardSlashMultiplier_lte?: InputMaybe<Scalars['BigInt']>;
  rewardSlashMultiplier_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardSlashMultiplier_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slashRewardEvery?: InputMaybe<Scalars['BigInt']>;
  slashRewardEvery_not?: InputMaybe<Scalars['BigInt']>;
  slashRewardEvery_gt?: InputMaybe<Scalars['BigInt']>;
  slashRewardEvery_lt?: InputMaybe<Scalars['BigInt']>;
  slashRewardEvery_gte?: InputMaybe<Scalars['BigInt']>;
  slashRewardEvery_lte?: InputMaybe<Scalars['BigInt']>;
  slashRewardEvery_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slashRewardEvery_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardToken?: InputMaybe<Scalars['Bytes']>;
  rewardToken_not?: InputMaybe<Scalars['Bytes']>;
  rewardToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  rewardToken_contains?: InputMaybe<Scalars['Bytes']>;
  rewardToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  isInitialized?: InputMaybe<Scalars['Boolean']>;
  isInitialized_not?: InputMaybe<Scalars['Boolean']>;
  isInitialized_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isInitialized_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  treasury?: InputMaybe<Scalars['String']>;
  treasury_not?: InputMaybe<Scalars['String']>;
  treasury_gt?: InputMaybe<Scalars['String']>;
  treasury_lt?: InputMaybe<Scalars['String']>;
  treasury_gte?: InputMaybe<Scalars['String']>;
  treasury_lte?: InputMaybe<Scalars['String']>;
  treasury_in?: InputMaybe<Array<Scalars['String']>>;
  treasury_not_in?: InputMaybe<Array<Scalars['String']>>;
  treasury_contains?: InputMaybe<Scalars['String']>;
  treasury_contains_nocase?: InputMaybe<Scalars['String']>;
  treasury_not_contains?: InputMaybe<Scalars['String']>;
  treasury_not_contains_nocase?: InputMaybe<Scalars['String']>;
  treasury_starts_with?: InputMaybe<Scalars['String']>;
  treasury_starts_with_nocase?: InputMaybe<Scalars['String']>;
  treasury_not_starts_with?: InputMaybe<Scalars['String']>;
  treasury_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  treasury_ends_with?: InputMaybe<Scalars['String']>;
  treasury_ends_with_nocase?: InputMaybe<Scalars['String']>;
  treasury_not_ends_with?: InputMaybe<Scalars['String']>;
  treasury_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  treasury_?: InputMaybe<Treasury_filter>;
  stat?: InputMaybe<Scalars['String']>;
  stat_not?: InputMaybe<Scalars['String']>;
  stat_gt?: InputMaybe<Scalars['String']>;
  stat_lt?: InputMaybe<Scalars['String']>;
  stat_gte?: InputMaybe<Scalars['String']>;
  stat_lte?: InputMaybe<Scalars['String']>;
  stat_in?: InputMaybe<Array<Scalars['String']>>;
  stat_not_in?: InputMaybe<Array<Scalars['String']>>;
  stat_contains?: InputMaybe<Scalars['String']>;
  stat_contains_nocase?: InputMaybe<Scalars['String']>;
  stat_not_contains?: InputMaybe<Scalars['String']>;
  stat_not_contains_nocase?: InputMaybe<Scalars['String']>;
  stat_starts_with?: InputMaybe<Scalars['String']>;
  stat_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stat_not_starts_with?: InputMaybe<Scalars['String']>;
  stat_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stat_ends_with?: InputMaybe<Scalars['String']>;
  stat_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stat_not_ends_with?: InputMaybe<Scalars['String']>;
  stat_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stat_?: InputMaybe<OrganizationStat_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Organization_orderBy =
  | 'id'
  | 'orgId'
  | 'name'
  | 'description'
  | 'approvers'
  | 'signers'
  | 'requiredTaskApprovals'
  | 'requiredConfirmations'
  | 'rewardMultiplier'
  | 'rewardSlashMultiplier'
  | 'slashRewardEvery'
  | 'rewardToken'
  | 'isInitialized'
  | 'treasury'
  | 'stat';

export type Query = {
  userStat?: Maybe<UserStat>;
  userStats: Array<UserStat>;
  organizationStat?: Maybe<OrganizationStat>;
  organizationStats: Array<OrganizationStat>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  taskRevision?: Maybe<TaskRevision>;
  taskRevisions: Array<TaskRevision>;
  taskSnapshot?: Maybe<TaskSnapshot>;
  taskSnapshots: Array<TaskSnapshot>;
  treasuryToken?: Maybe<TreasuryToken>;
  treasuryTokens: Array<TreasuryToken>;
  treasury?: Maybe<Treasury>;
  treasuries: Array<Treasury>;
  action?: Maybe<Action>;
  actions: Array<Action>;
  team?: Maybe<Team>;
  teams: Array<Team>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryuserStatArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuserStatsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserStat_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserStat_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryorganizationStatArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryorganizationStatsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrganizationStat_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OrganizationStat_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryorganizationArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryorganizationsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Organization_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Organization_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytaskArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytasksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Task_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Task_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytaskRevisionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytaskRevisionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskRevision_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskRevision_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytaskSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytaskSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskSnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytreasuryTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytreasuryTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TreasuryToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TreasuryToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytreasuryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytreasuriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Treasury_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Treasury_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Action_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Action_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryteamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryteamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Team_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Team_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  userStat?: Maybe<UserStat>;
  userStats: Array<UserStat>;
  organizationStat?: Maybe<OrganizationStat>;
  organizationStats: Array<OrganizationStat>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  taskRevision?: Maybe<TaskRevision>;
  taskRevisions: Array<TaskRevision>;
  taskSnapshot?: Maybe<TaskSnapshot>;
  taskSnapshots: Array<TaskSnapshot>;
  treasuryToken?: Maybe<TreasuryToken>;
  treasuryTokens: Array<TreasuryToken>;
  treasury?: Maybe<Treasury>;
  treasuries: Array<Treasury>;
  action?: Maybe<Action>;
  actions: Array<Action>;
  team?: Maybe<Team>;
  teams: Array<Team>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionuserStatArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionuserStatsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserStat_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserStat_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionorganizationStatArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionorganizationStatsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrganizationStat_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OrganizationStat_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionorganizationArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionorganizationsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Organization_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Organization_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontaskArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontasksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Task_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Task_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontaskRevisionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontaskRevisionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskRevision_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskRevision_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontaskSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontaskSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskSnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontreasuryTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontreasuryTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TreasuryToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TreasuryToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontreasuryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontreasuriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Treasury_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Treasury_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Action_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Action_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionteamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionteamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Team_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Team_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Task = {
  id: Scalars['ID'];
  taskId: Scalars['BigInt'];
  orgId: Organization;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  assigner?: Maybe<Scalars['String']>;
  assignee?: Maybe<Scalars['String']>;
  teamAssignee?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
  taskTags: Array<Scalars['String']>;
  status: Scalars['Int'];
  complexityScore: Scalars['BigInt'];
  reputationLevel: Scalars['BigInt'];
  requiredApprovals: Scalars['BigInt'];
  rewardAmount?: Maybe<Scalars['BigInt']>;
  rewardToken?: Maybe<Scalars['Bytes']>;
  assignDate?: Maybe<Scalars['BigInt']>;
  submitDate?: Maybe<Scalars['BigInt']>;
  taskDuration: Scalars['BigInt'];
  totalWaitTime: Scalars['BigInt'];
  comment?: Maybe<Scalars['String']>;
  approvedBy?: Maybe<Array<Scalars['String']>>;
  assignmentRequest?: Maybe<Array<Scalars['String']>>;
  staked: Scalars['Boolean'];
  revisions?: Maybe<Array<TaskRevision>>;
};


export type TaskrevisionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskRevision_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskRevision_filter>;
};

export type TaskRevision = {
  id: Scalars['ID'];
  task: Task;
  taskSnapshot: TaskSnapshot;
  revisionId: Scalars['BigInt'];
  requester: Scalars['String'];
  externalRevisionId: Scalars['Bytes'];
  revisionHash: Scalars['Bytes'];
  durationExtension: Scalars['BigInt'];
  durationExtensionRequest: Scalars['BigInt'];
  status: Scalars['Int'];
};

export type TaskRevision_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  task?: InputMaybe<Scalars['String']>;
  task_not?: InputMaybe<Scalars['String']>;
  task_gt?: InputMaybe<Scalars['String']>;
  task_lt?: InputMaybe<Scalars['String']>;
  task_gte?: InputMaybe<Scalars['String']>;
  task_lte?: InputMaybe<Scalars['String']>;
  task_in?: InputMaybe<Array<Scalars['String']>>;
  task_not_in?: InputMaybe<Array<Scalars['String']>>;
  task_contains?: InputMaybe<Scalars['String']>;
  task_contains_nocase?: InputMaybe<Scalars['String']>;
  task_not_contains?: InputMaybe<Scalars['String']>;
  task_not_contains_nocase?: InputMaybe<Scalars['String']>;
  task_starts_with?: InputMaybe<Scalars['String']>;
  task_starts_with_nocase?: InputMaybe<Scalars['String']>;
  task_not_starts_with?: InputMaybe<Scalars['String']>;
  task_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  task_ends_with?: InputMaybe<Scalars['String']>;
  task_ends_with_nocase?: InputMaybe<Scalars['String']>;
  task_not_ends_with?: InputMaybe<Scalars['String']>;
  task_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  task_?: InputMaybe<Task_filter>;
  taskSnapshot?: InputMaybe<Scalars['String']>;
  taskSnapshot_not?: InputMaybe<Scalars['String']>;
  taskSnapshot_gt?: InputMaybe<Scalars['String']>;
  taskSnapshot_lt?: InputMaybe<Scalars['String']>;
  taskSnapshot_gte?: InputMaybe<Scalars['String']>;
  taskSnapshot_lte?: InputMaybe<Scalars['String']>;
  taskSnapshot_in?: InputMaybe<Array<Scalars['String']>>;
  taskSnapshot_not_in?: InputMaybe<Array<Scalars['String']>>;
  taskSnapshot_contains?: InputMaybe<Scalars['String']>;
  taskSnapshot_contains_nocase?: InputMaybe<Scalars['String']>;
  taskSnapshot_not_contains?: InputMaybe<Scalars['String']>;
  taskSnapshot_not_contains_nocase?: InputMaybe<Scalars['String']>;
  taskSnapshot_starts_with?: InputMaybe<Scalars['String']>;
  taskSnapshot_starts_with_nocase?: InputMaybe<Scalars['String']>;
  taskSnapshot_not_starts_with?: InputMaybe<Scalars['String']>;
  taskSnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  taskSnapshot_ends_with?: InputMaybe<Scalars['String']>;
  taskSnapshot_ends_with_nocase?: InputMaybe<Scalars['String']>;
  taskSnapshot_not_ends_with?: InputMaybe<Scalars['String']>;
  taskSnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  taskSnapshot_?: InputMaybe<TaskSnapshot_filter>;
  revisionId?: InputMaybe<Scalars['BigInt']>;
  revisionId_not?: InputMaybe<Scalars['BigInt']>;
  revisionId_gt?: InputMaybe<Scalars['BigInt']>;
  revisionId_lt?: InputMaybe<Scalars['BigInt']>;
  revisionId_gte?: InputMaybe<Scalars['BigInt']>;
  revisionId_lte?: InputMaybe<Scalars['BigInt']>;
  revisionId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  revisionId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requester?: InputMaybe<Scalars['String']>;
  requester_not?: InputMaybe<Scalars['String']>;
  requester_gt?: InputMaybe<Scalars['String']>;
  requester_lt?: InputMaybe<Scalars['String']>;
  requester_gte?: InputMaybe<Scalars['String']>;
  requester_lte?: InputMaybe<Scalars['String']>;
  requester_in?: InputMaybe<Array<Scalars['String']>>;
  requester_not_in?: InputMaybe<Array<Scalars['String']>>;
  requester_contains?: InputMaybe<Scalars['String']>;
  requester_contains_nocase?: InputMaybe<Scalars['String']>;
  requester_not_contains?: InputMaybe<Scalars['String']>;
  requester_not_contains_nocase?: InputMaybe<Scalars['String']>;
  requester_starts_with?: InputMaybe<Scalars['String']>;
  requester_starts_with_nocase?: InputMaybe<Scalars['String']>;
  requester_not_starts_with?: InputMaybe<Scalars['String']>;
  requester_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  requester_ends_with?: InputMaybe<Scalars['String']>;
  requester_ends_with_nocase?: InputMaybe<Scalars['String']>;
  requester_not_ends_with?: InputMaybe<Scalars['String']>;
  requester_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  externalRevisionId?: InputMaybe<Scalars['Bytes']>;
  externalRevisionId_not?: InputMaybe<Scalars['Bytes']>;
  externalRevisionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  externalRevisionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  externalRevisionId_contains?: InputMaybe<Scalars['Bytes']>;
  externalRevisionId_not_contains?: InputMaybe<Scalars['Bytes']>;
  revisionHash?: InputMaybe<Scalars['Bytes']>;
  revisionHash_not?: InputMaybe<Scalars['Bytes']>;
  revisionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  revisionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  revisionHash_contains?: InputMaybe<Scalars['Bytes']>;
  revisionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  durationExtension?: InputMaybe<Scalars['BigInt']>;
  durationExtension_not?: InputMaybe<Scalars['BigInt']>;
  durationExtension_gt?: InputMaybe<Scalars['BigInt']>;
  durationExtension_lt?: InputMaybe<Scalars['BigInt']>;
  durationExtension_gte?: InputMaybe<Scalars['BigInt']>;
  durationExtension_lte?: InputMaybe<Scalars['BigInt']>;
  durationExtension_in?: InputMaybe<Array<Scalars['BigInt']>>;
  durationExtension_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  durationExtensionRequest?: InputMaybe<Scalars['BigInt']>;
  durationExtensionRequest_not?: InputMaybe<Scalars['BigInt']>;
  durationExtensionRequest_gt?: InputMaybe<Scalars['BigInt']>;
  durationExtensionRequest_lt?: InputMaybe<Scalars['BigInt']>;
  durationExtensionRequest_gte?: InputMaybe<Scalars['BigInt']>;
  durationExtensionRequest_lte?: InputMaybe<Scalars['BigInt']>;
  durationExtensionRequest_in?: InputMaybe<Array<Scalars['BigInt']>>;
  durationExtensionRequest_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  status?: InputMaybe<Scalars['Int']>;
  status_not?: InputMaybe<Scalars['Int']>;
  status_gt?: InputMaybe<Scalars['Int']>;
  status_lt?: InputMaybe<Scalars['Int']>;
  status_gte?: InputMaybe<Scalars['Int']>;
  status_lte?: InputMaybe<Scalars['Int']>;
  status_in?: InputMaybe<Array<Scalars['Int']>>;
  status_not_in?: InputMaybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type TaskRevision_orderBy =
  | 'id'
  | 'task'
  | 'taskSnapshot'
  | 'revisionId'
  | 'requester'
  | 'externalRevisionId'
  | 'revisionHash'
  | 'durationExtension'
  | 'durationExtensionRequest'
  | 'status';

export type TaskSnapshot = {
  id: Scalars['ID'];
  actor: Scalars['String'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  taskId: Scalars['BigInt'];
  orgId: Organization;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  assigner?: Maybe<Scalars['String']>;
  assignee?: Maybe<Scalars['String']>;
  taskTags: Array<Scalars['String']>;
  status: Scalars['Int'];
  complexityScore?: Maybe<Scalars['BigInt']>;
  reputationLevel?: Maybe<Scalars['BigInt']>;
  requiredApprovals?: Maybe<Scalars['BigInt']>;
  rewardAmount?: Maybe<Scalars['BigInt']>;
  rewardToken?: Maybe<Scalars['Bytes']>;
  assignDate?: Maybe<Scalars['BigInt']>;
  submitDate?: Maybe<Scalars['BigInt']>;
  taskDuration?: Maybe<Scalars['BigInt']>;
  totalWaitTime?: Maybe<Scalars['BigInt']>;
  comment?: Maybe<Scalars['String']>;
  approvedBy?: Maybe<Array<Scalars['String']>>;
  assignmentRequest?: Maybe<Array<Scalars['String']>>;
  staked: Scalars['Boolean'];
};

export type TaskSnapshot_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  actor?: InputMaybe<Scalars['String']>;
  actor_not?: InputMaybe<Scalars['String']>;
  actor_gt?: InputMaybe<Scalars['String']>;
  actor_lt?: InputMaybe<Scalars['String']>;
  actor_gte?: InputMaybe<Scalars['String']>;
  actor_lte?: InputMaybe<Scalars['String']>;
  actor_in?: InputMaybe<Array<Scalars['String']>>;
  actor_not_in?: InputMaybe<Array<Scalars['String']>>;
  actor_contains?: InputMaybe<Scalars['String']>;
  actor_contains_nocase?: InputMaybe<Scalars['String']>;
  actor_not_contains?: InputMaybe<Scalars['String']>;
  actor_not_contains_nocase?: InputMaybe<Scalars['String']>;
  actor_starts_with?: InputMaybe<Scalars['String']>;
  actor_starts_with_nocase?: InputMaybe<Scalars['String']>;
  actor_not_starts_with?: InputMaybe<Scalars['String']>;
  actor_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  actor_ends_with?: InputMaybe<Scalars['String']>;
  actor_ends_with_nocase?: InputMaybe<Scalars['String']>;
  actor_not_ends_with?: InputMaybe<Scalars['String']>;
  actor_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  taskId?: InputMaybe<Scalars['BigInt']>;
  taskId_not?: InputMaybe<Scalars['BigInt']>;
  taskId_gt?: InputMaybe<Scalars['BigInt']>;
  taskId_lt?: InputMaybe<Scalars['BigInt']>;
  taskId_gte?: InputMaybe<Scalars['BigInt']>;
  taskId_lte?: InputMaybe<Scalars['BigInt']>;
  taskId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  taskId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  orgId?: InputMaybe<Scalars['String']>;
  orgId_not?: InputMaybe<Scalars['String']>;
  orgId_gt?: InputMaybe<Scalars['String']>;
  orgId_lt?: InputMaybe<Scalars['String']>;
  orgId_gte?: InputMaybe<Scalars['String']>;
  orgId_lte?: InputMaybe<Scalars['String']>;
  orgId_in?: InputMaybe<Array<Scalars['String']>>;
  orgId_not_in?: InputMaybe<Array<Scalars['String']>>;
  orgId_contains?: InputMaybe<Scalars['String']>;
  orgId_contains_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_contains?: InputMaybe<Scalars['String']>;
  orgId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  orgId_starts_with?: InputMaybe<Scalars['String']>;
  orgId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_starts_with?: InputMaybe<Scalars['String']>;
  orgId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_ends_with?: InputMaybe<Scalars['String']>;
  orgId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_ends_with?: InputMaybe<Scalars['String']>;
  orgId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_?: InputMaybe<Organization_filter>;
  title?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  assigner?: InputMaybe<Scalars['String']>;
  assigner_not?: InputMaybe<Scalars['String']>;
  assigner_gt?: InputMaybe<Scalars['String']>;
  assigner_lt?: InputMaybe<Scalars['String']>;
  assigner_gte?: InputMaybe<Scalars['String']>;
  assigner_lte?: InputMaybe<Scalars['String']>;
  assigner_in?: InputMaybe<Array<Scalars['String']>>;
  assigner_not_in?: InputMaybe<Array<Scalars['String']>>;
  assigner_contains?: InputMaybe<Scalars['String']>;
  assigner_contains_nocase?: InputMaybe<Scalars['String']>;
  assigner_not_contains?: InputMaybe<Scalars['String']>;
  assigner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  assigner_starts_with?: InputMaybe<Scalars['String']>;
  assigner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  assigner_not_starts_with?: InputMaybe<Scalars['String']>;
  assigner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  assigner_ends_with?: InputMaybe<Scalars['String']>;
  assigner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  assigner_not_ends_with?: InputMaybe<Scalars['String']>;
  assigner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  assignee?: InputMaybe<Scalars['String']>;
  assignee_not?: InputMaybe<Scalars['String']>;
  assignee_gt?: InputMaybe<Scalars['String']>;
  assignee_lt?: InputMaybe<Scalars['String']>;
  assignee_gte?: InputMaybe<Scalars['String']>;
  assignee_lte?: InputMaybe<Scalars['String']>;
  assignee_in?: InputMaybe<Array<Scalars['String']>>;
  assignee_not_in?: InputMaybe<Array<Scalars['String']>>;
  assignee_contains?: InputMaybe<Scalars['String']>;
  assignee_contains_nocase?: InputMaybe<Scalars['String']>;
  assignee_not_contains?: InputMaybe<Scalars['String']>;
  assignee_not_contains_nocase?: InputMaybe<Scalars['String']>;
  assignee_starts_with?: InputMaybe<Scalars['String']>;
  assignee_starts_with_nocase?: InputMaybe<Scalars['String']>;
  assignee_not_starts_with?: InputMaybe<Scalars['String']>;
  assignee_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  assignee_ends_with?: InputMaybe<Scalars['String']>;
  assignee_ends_with_nocase?: InputMaybe<Scalars['String']>;
  assignee_not_ends_with?: InputMaybe<Scalars['String']>;
  assignee_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  taskTags?: InputMaybe<Array<Scalars['String']>>;
  taskTags_not?: InputMaybe<Array<Scalars['String']>>;
  taskTags_contains?: InputMaybe<Array<Scalars['String']>>;
  taskTags_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  taskTags_not_contains?: InputMaybe<Array<Scalars['String']>>;
  taskTags_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  status?: InputMaybe<Scalars['Int']>;
  status_not?: InputMaybe<Scalars['Int']>;
  status_gt?: InputMaybe<Scalars['Int']>;
  status_lt?: InputMaybe<Scalars['Int']>;
  status_gte?: InputMaybe<Scalars['Int']>;
  status_lte?: InputMaybe<Scalars['Int']>;
  status_in?: InputMaybe<Array<Scalars['Int']>>;
  status_not_in?: InputMaybe<Array<Scalars['Int']>>;
  complexityScore?: InputMaybe<Scalars['BigInt']>;
  complexityScore_not?: InputMaybe<Scalars['BigInt']>;
  complexityScore_gt?: InputMaybe<Scalars['BigInt']>;
  complexityScore_lt?: InputMaybe<Scalars['BigInt']>;
  complexityScore_gte?: InputMaybe<Scalars['BigInt']>;
  complexityScore_lte?: InputMaybe<Scalars['BigInt']>;
  complexityScore_in?: InputMaybe<Array<Scalars['BigInt']>>;
  complexityScore_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reputationLevel?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_not?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_gt?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_lt?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_gte?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_lte?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reputationLevel_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requiredApprovals?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_not?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_gt?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_lt?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_gte?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_lte?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requiredApprovals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardAmount?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_not?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_gt?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_lt?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_gte?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_lte?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardToken?: InputMaybe<Scalars['Bytes']>;
  rewardToken_not?: InputMaybe<Scalars['Bytes']>;
  rewardToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  rewardToken_contains?: InputMaybe<Scalars['Bytes']>;
  rewardToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  assignDate?: InputMaybe<Scalars['BigInt']>;
  assignDate_not?: InputMaybe<Scalars['BigInt']>;
  assignDate_gt?: InputMaybe<Scalars['BigInt']>;
  assignDate_lt?: InputMaybe<Scalars['BigInt']>;
  assignDate_gte?: InputMaybe<Scalars['BigInt']>;
  assignDate_lte?: InputMaybe<Scalars['BigInt']>;
  assignDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assignDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submitDate?: InputMaybe<Scalars['BigInt']>;
  submitDate_not?: InputMaybe<Scalars['BigInt']>;
  submitDate_gt?: InputMaybe<Scalars['BigInt']>;
  submitDate_lt?: InputMaybe<Scalars['BigInt']>;
  submitDate_gte?: InputMaybe<Scalars['BigInt']>;
  submitDate_lte?: InputMaybe<Scalars['BigInt']>;
  submitDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submitDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  taskDuration?: InputMaybe<Scalars['BigInt']>;
  taskDuration_not?: InputMaybe<Scalars['BigInt']>;
  taskDuration_gt?: InputMaybe<Scalars['BigInt']>;
  taskDuration_lt?: InputMaybe<Scalars['BigInt']>;
  taskDuration_gte?: InputMaybe<Scalars['BigInt']>;
  taskDuration_lte?: InputMaybe<Scalars['BigInt']>;
  taskDuration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  taskDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWaitTime?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_not?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_gt?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_lt?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_gte?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_lte?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWaitTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  comment?: InputMaybe<Scalars['String']>;
  comment_not?: InputMaybe<Scalars['String']>;
  comment_gt?: InputMaybe<Scalars['String']>;
  comment_lt?: InputMaybe<Scalars['String']>;
  comment_gte?: InputMaybe<Scalars['String']>;
  comment_lte?: InputMaybe<Scalars['String']>;
  comment_in?: InputMaybe<Array<Scalars['String']>>;
  comment_not_in?: InputMaybe<Array<Scalars['String']>>;
  comment_contains?: InputMaybe<Scalars['String']>;
  comment_contains_nocase?: InputMaybe<Scalars['String']>;
  comment_not_contains?: InputMaybe<Scalars['String']>;
  comment_not_contains_nocase?: InputMaybe<Scalars['String']>;
  comment_starts_with?: InputMaybe<Scalars['String']>;
  comment_starts_with_nocase?: InputMaybe<Scalars['String']>;
  comment_not_starts_with?: InputMaybe<Scalars['String']>;
  comment_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  comment_ends_with?: InputMaybe<Scalars['String']>;
  comment_ends_with_nocase?: InputMaybe<Scalars['String']>;
  comment_not_ends_with?: InputMaybe<Scalars['String']>;
  comment_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  approvedBy?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_contains?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not_contains?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_not?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_contains?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_not_contains?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  staked?: InputMaybe<Scalars['Boolean']>;
  staked_not?: InputMaybe<Scalars['Boolean']>;
  staked_in?: InputMaybe<Array<Scalars['Boolean']>>;
  staked_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type TaskSnapshot_orderBy =
  | 'id'
  | 'actor'
  | 'block'
  | 'timestamp'
  | 'taskId'
  | 'orgId'
  | 'title'
  | 'description'
  | 'assigner'
  | 'assignee'
  | 'taskTags'
  | 'status'
  | 'complexityScore'
  | 'reputationLevel'
  | 'requiredApprovals'
  | 'rewardAmount'
  | 'rewardToken'
  | 'assignDate'
  | 'submitDate'
  | 'taskDuration'
  | 'totalWaitTime'
  | 'comment'
  | 'approvedBy'
  | 'assignmentRequest'
  | 'staked';

export type Task_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  taskId?: InputMaybe<Scalars['BigInt']>;
  taskId_not?: InputMaybe<Scalars['BigInt']>;
  taskId_gt?: InputMaybe<Scalars['BigInt']>;
  taskId_lt?: InputMaybe<Scalars['BigInt']>;
  taskId_gte?: InputMaybe<Scalars['BigInt']>;
  taskId_lte?: InputMaybe<Scalars['BigInt']>;
  taskId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  taskId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  orgId?: InputMaybe<Scalars['String']>;
  orgId_not?: InputMaybe<Scalars['String']>;
  orgId_gt?: InputMaybe<Scalars['String']>;
  orgId_lt?: InputMaybe<Scalars['String']>;
  orgId_gte?: InputMaybe<Scalars['String']>;
  orgId_lte?: InputMaybe<Scalars['String']>;
  orgId_in?: InputMaybe<Array<Scalars['String']>>;
  orgId_not_in?: InputMaybe<Array<Scalars['String']>>;
  orgId_contains?: InputMaybe<Scalars['String']>;
  orgId_contains_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_contains?: InputMaybe<Scalars['String']>;
  orgId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  orgId_starts_with?: InputMaybe<Scalars['String']>;
  orgId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_starts_with?: InputMaybe<Scalars['String']>;
  orgId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_ends_with?: InputMaybe<Scalars['String']>;
  orgId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_ends_with?: InputMaybe<Scalars['String']>;
  orgId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_?: InputMaybe<Organization_filter>;
  title?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  assigner?: InputMaybe<Scalars['String']>;
  assigner_not?: InputMaybe<Scalars['String']>;
  assigner_gt?: InputMaybe<Scalars['String']>;
  assigner_lt?: InputMaybe<Scalars['String']>;
  assigner_gte?: InputMaybe<Scalars['String']>;
  assigner_lte?: InputMaybe<Scalars['String']>;
  assigner_in?: InputMaybe<Array<Scalars['String']>>;
  assigner_not_in?: InputMaybe<Array<Scalars['String']>>;
  assigner_contains?: InputMaybe<Scalars['String']>;
  assigner_contains_nocase?: InputMaybe<Scalars['String']>;
  assigner_not_contains?: InputMaybe<Scalars['String']>;
  assigner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  assigner_starts_with?: InputMaybe<Scalars['String']>;
  assigner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  assigner_not_starts_with?: InputMaybe<Scalars['String']>;
  assigner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  assigner_ends_with?: InputMaybe<Scalars['String']>;
  assigner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  assigner_not_ends_with?: InputMaybe<Scalars['String']>;
  assigner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  assignee?: InputMaybe<Scalars['String']>;
  assignee_not?: InputMaybe<Scalars['String']>;
  assignee_gt?: InputMaybe<Scalars['String']>;
  assignee_lt?: InputMaybe<Scalars['String']>;
  assignee_gte?: InputMaybe<Scalars['String']>;
  assignee_lte?: InputMaybe<Scalars['String']>;
  assignee_in?: InputMaybe<Array<Scalars['String']>>;
  assignee_not_in?: InputMaybe<Array<Scalars['String']>>;
  assignee_contains?: InputMaybe<Scalars['String']>;
  assignee_contains_nocase?: InputMaybe<Scalars['String']>;
  assignee_not_contains?: InputMaybe<Scalars['String']>;
  assignee_not_contains_nocase?: InputMaybe<Scalars['String']>;
  assignee_starts_with?: InputMaybe<Scalars['String']>;
  assignee_starts_with_nocase?: InputMaybe<Scalars['String']>;
  assignee_not_starts_with?: InputMaybe<Scalars['String']>;
  assignee_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  assignee_ends_with?: InputMaybe<Scalars['String']>;
  assignee_ends_with_nocase?: InputMaybe<Scalars['String']>;
  assignee_not_ends_with?: InputMaybe<Scalars['String']>;
  assignee_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  teamAssignee?: InputMaybe<Scalars['String']>;
  teamAssignee_not?: InputMaybe<Scalars['String']>;
  teamAssignee_gt?: InputMaybe<Scalars['String']>;
  teamAssignee_lt?: InputMaybe<Scalars['String']>;
  teamAssignee_gte?: InputMaybe<Scalars['String']>;
  teamAssignee_lte?: InputMaybe<Scalars['String']>;
  teamAssignee_in?: InputMaybe<Array<Scalars['String']>>;
  teamAssignee_not_in?: InputMaybe<Array<Scalars['String']>>;
  teamAssignee_contains?: InputMaybe<Scalars['String']>;
  teamAssignee_contains_nocase?: InputMaybe<Scalars['String']>;
  teamAssignee_not_contains?: InputMaybe<Scalars['String']>;
  teamAssignee_not_contains_nocase?: InputMaybe<Scalars['String']>;
  teamAssignee_starts_with?: InputMaybe<Scalars['String']>;
  teamAssignee_starts_with_nocase?: InputMaybe<Scalars['String']>;
  teamAssignee_not_starts_with?: InputMaybe<Scalars['String']>;
  teamAssignee_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  teamAssignee_ends_with?: InputMaybe<Scalars['String']>;
  teamAssignee_ends_with_nocase?: InputMaybe<Scalars['String']>;
  teamAssignee_not_ends_with?: InputMaybe<Scalars['String']>;
  teamAssignee_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  team_not?: InputMaybe<Scalars['String']>;
  team_gt?: InputMaybe<Scalars['String']>;
  team_lt?: InputMaybe<Scalars['String']>;
  team_gte?: InputMaybe<Scalars['String']>;
  team_lte?: InputMaybe<Scalars['String']>;
  team_in?: InputMaybe<Array<Scalars['String']>>;
  team_not_in?: InputMaybe<Array<Scalars['String']>>;
  team_contains?: InputMaybe<Scalars['String']>;
  team_contains_nocase?: InputMaybe<Scalars['String']>;
  team_not_contains?: InputMaybe<Scalars['String']>;
  team_not_contains_nocase?: InputMaybe<Scalars['String']>;
  team_starts_with?: InputMaybe<Scalars['String']>;
  team_starts_with_nocase?: InputMaybe<Scalars['String']>;
  team_not_starts_with?: InputMaybe<Scalars['String']>;
  team_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  team_ends_with?: InputMaybe<Scalars['String']>;
  team_ends_with_nocase?: InputMaybe<Scalars['String']>;
  team_not_ends_with?: InputMaybe<Scalars['String']>;
  team_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  team_?: InputMaybe<Team_filter>;
  taskTags?: InputMaybe<Array<Scalars['String']>>;
  taskTags_not?: InputMaybe<Array<Scalars['String']>>;
  taskTags_contains?: InputMaybe<Array<Scalars['String']>>;
  taskTags_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  taskTags_not_contains?: InputMaybe<Array<Scalars['String']>>;
  taskTags_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  status?: InputMaybe<Scalars['Int']>;
  status_not?: InputMaybe<Scalars['Int']>;
  status_gt?: InputMaybe<Scalars['Int']>;
  status_lt?: InputMaybe<Scalars['Int']>;
  status_gte?: InputMaybe<Scalars['Int']>;
  status_lte?: InputMaybe<Scalars['Int']>;
  status_in?: InputMaybe<Array<Scalars['Int']>>;
  status_not_in?: InputMaybe<Array<Scalars['Int']>>;
  complexityScore?: InputMaybe<Scalars['BigInt']>;
  complexityScore_not?: InputMaybe<Scalars['BigInt']>;
  complexityScore_gt?: InputMaybe<Scalars['BigInt']>;
  complexityScore_lt?: InputMaybe<Scalars['BigInt']>;
  complexityScore_gte?: InputMaybe<Scalars['BigInt']>;
  complexityScore_lte?: InputMaybe<Scalars['BigInt']>;
  complexityScore_in?: InputMaybe<Array<Scalars['BigInt']>>;
  complexityScore_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reputationLevel?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_not?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_gt?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_lt?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_gte?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_lte?: InputMaybe<Scalars['BigInt']>;
  reputationLevel_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reputationLevel_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requiredApprovals?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_not?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_gt?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_lt?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_gte?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_lte?: InputMaybe<Scalars['BigInt']>;
  requiredApprovals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requiredApprovals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardAmount?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_not?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_gt?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_lt?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_gte?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_lte?: InputMaybe<Scalars['BigInt']>;
  rewardAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardToken?: InputMaybe<Scalars['Bytes']>;
  rewardToken_not?: InputMaybe<Scalars['Bytes']>;
  rewardToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  rewardToken_contains?: InputMaybe<Scalars['Bytes']>;
  rewardToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  assignDate?: InputMaybe<Scalars['BigInt']>;
  assignDate_not?: InputMaybe<Scalars['BigInt']>;
  assignDate_gt?: InputMaybe<Scalars['BigInt']>;
  assignDate_lt?: InputMaybe<Scalars['BigInt']>;
  assignDate_gte?: InputMaybe<Scalars['BigInt']>;
  assignDate_lte?: InputMaybe<Scalars['BigInt']>;
  assignDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assignDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submitDate?: InputMaybe<Scalars['BigInt']>;
  submitDate_not?: InputMaybe<Scalars['BigInt']>;
  submitDate_gt?: InputMaybe<Scalars['BigInt']>;
  submitDate_lt?: InputMaybe<Scalars['BigInt']>;
  submitDate_gte?: InputMaybe<Scalars['BigInt']>;
  submitDate_lte?: InputMaybe<Scalars['BigInt']>;
  submitDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submitDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  taskDuration?: InputMaybe<Scalars['BigInt']>;
  taskDuration_not?: InputMaybe<Scalars['BigInt']>;
  taskDuration_gt?: InputMaybe<Scalars['BigInt']>;
  taskDuration_lt?: InputMaybe<Scalars['BigInt']>;
  taskDuration_gte?: InputMaybe<Scalars['BigInt']>;
  taskDuration_lte?: InputMaybe<Scalars['BigInt']>;
  taskDuration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  taskDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWaitTime?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_not?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_gt?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_lt?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_gte?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_lte?: InputMaybe<Scalars['BigInt']>;
  totalWaitTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWaitTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  comment?: InputMaybe<Scalars['String']>;
  comment_not?: InputMaybe<Scalars['String']>;
  comment_gt?: InputMaybe<Scalars['String']>;
  comment_lt?: InputMaybe<Scalars['String']>;
  comment_gte?: InputMaybe<Scalars['String']>;
  comment_lte?: InputMaybe<Scalars['String']>;
  comment_in?: InputMaybe<Array<Scalars['String']>>;
  comment_not_in?: InputMaybe<Array<Scalars['String']>>;
  comment_contains?: InputMaybe<Scalars['String']>;
  comment_contains_nocase?: InputMaybe<Scalars['String']>;
  comment_not_contains?: InputMaybe<Scalars['String']>;
  comment_not_contains_nocase?: InputMaybe<Scalars['String']>;
  comment_starts_with?: InputMaybe<Scalars['String']>;
  comment_starts_with_nocase?: InputMaybe<Scalars['String']>;
  comment_not_starts_with?: InputMaybe<Scalars['String']>;
  comment_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  comment_ends_with?: InputMaybe<Scalars['String']>;
  comment_ends_with_nocase?: InputMaybe<Scalars['String']>;
  comment_not_ends_with?: InputMaybe<Scalars['String']>;
  comment_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  approvedBy?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_contains?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not_contains?: InputMaybe<Array<Scalars['String']>>;
  approvedBy_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_not?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_contains?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_not_contains?: InputMaybe<Array<Scalars['String']>>;
  assignmentRequest_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  staked?: InputMaybe<Scalars['Boolean']>;
  staked_not?: InputMaybe<Scalars['Boolean']>;
  staked_in?: InputMaybe<Array<Scalars['Boolean']>>;
  staked_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  revisions_?: InputMaybe<TaskRevision_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Task_orderBy =
  | 'id'
  | 'taskId'
  | 'orgId'
  | 'title'
  | 'description'
  | 'assigner'
  | 'assignee'
  | 'teamAssignee'
  | 'team'
  | 'taskTags'
  | 'status'
  | 'complexityScore'
  | 'reputationLevel'
  | 'requiredApprovals'
  | 'rewardAmount'
  | 'rewardToken'
  | 'assignDate'
  | 'submitDate'
  | 'taskDuration'
  | 'totalWaitTime'
  | 'comment'
  | 'approvedBy'
  | 'assignmentRequest'
  | 'staked'
  | 'revisions';

export type Team = {
  id: Scalars['ID'];
  teamId: Scalars['BigInt'];
  name: Scalars['String'];
  description: Scalars['String'];
  walletAddress: Scalars['String'];
  archived: Scalars['Boolean'];
  members: Array<Scalars['String']>;
  teamRewardMultiplier: Scalars['BigInt'];
};

export type Team_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  teamId?: InputMaybe<Scalars['BigInt']>;
  teamId_not?: InputMaybe<Scalars['BigInt']>;
  teamId_gt?: InputMaybe<Scalars['BigInt']>;
  teamId_lt?: InputMaybe<Scalars['BigInt']>;
  teamId_gte?: InputMaybe<Scalars['BigInt']>;
  teamId_lte?: InputMaybe<Scalars['BigInt']>;
  teamId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  teamId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  walletAddress?: InputMaybe<Scalars['String']>;
  walletAddress_not?: InputMaybe<Scalars['String']>;
  walletAddress_gt?: InputMaybe<Scalars['String']>;
  walletAddress_lt?: InputMaybe<Scalars['String']>;
  walletAddress_gte?: InputMaybe<Scalars['String']>;
  walletAddress_lte?: InputMaybe<Scalars['String']>;
  walletAddress_in?: InputMaybe<Array<Scalars['String']>>;
  walletAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  walletAddress_contains?: InputMaybe<Scalars['String']>;
  walletAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_not_contains?: InputMaybe<Scalars['String']>;
  walletAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_starts_with?: InputMaybe<Scalars['String']>;
  walletAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  walletAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_ends_with?: InputMaybe<Scalars['String']>;
  walletAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  walletAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  archived_not?: InputMaybe<Scalars['Boolean']>;
  archived_in?: InputMaybe<Array<Scalars['Boolean']>>;
  archived_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  members?: InputMaybe<Array<Scalars['String']>>;
  members_not?: InputMaybe<Array<Scalars['String']>>;
  members_contains?: InputMaybe<Array<Scalars['String']>>;
  members_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  members_not_contains?: InputMaybe<Array<Scalars['String']>>;
  members_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  teamRewardMultiplier?: InputMaybe<Scalars['BigInt']>;
  teamRewardMultiplier_not?: InputMaybe<Scalars['BigInt']>;
  teamRewardMultiplier_gt?: InputMaybe<Scalars['BigInt']>;
  teamRewardMultiplier_lt?: InputMaybe<Scalars['BigInt']>;
  teamRewardMultiplier_gte?: InputMaybe<Scalars['BigInt']>;
  teamRewardMultiplier_lte?: InputMaybe<Scalars['BigInt']>;
  teamRewardMultiplier_in?: InputMaybe<Array<Scalars['BigInt']>>;
  teamRewardMultiplier_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Team_orderBy =
  | 'id'
  | 'teamId'
  | 'name'
  | 'description'
  | 'walletAddress'
  | 'archived'
  | 'members'
  | 'teamRewardMultiplier';

export type Treasury = {
  id: Scalars['ID'];
  orgId: Scalars['BigInt'];
  tokens?: Maybe<Array<TreasuryToken>>;
};


export type TreasurytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TreasuryToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TreasuryToken_filter>;
};

export type TreasuryToken = {
  id: Scalars['ID'];
  orgId?: Maybe<Treasury>;
  token: Scalars['String'];
  balance: Scalars['BigInt'];
  lockedBalance: Scalars['BigInt'];
};

export type TreasuryToken_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  orgId?: InputMaybe<Scalars['String']>;
  orgId_not?: InputMaybe<Scalars['String']>;
  orgId_gt?: InputMaybe<Scalars['String']>;
  orgId_lt?: InputMaybe<Scalars['String']>;
  orgId_gte?: InputMaybe<Scalars['String']>;
  orgId_lte?: InputMaybe<Scalars['String']>;
  orgId_in?: InputMaybe<Array<Scalars['String']>>;
  orgId_not_in?: InputMaybe<Array<Scalars['String']>>;
  orgId_contains?: InputMaybe<Scalars['String']>;
  orgId_contains_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_contains?: InputMaybe<Scalars['String']>;
  orgId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  orgId_starts_with?: InputMaybe<Scalars['String']>;
  orgId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_starts_with?: InputMaybe<Scalars['String']>;
  orgId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_ends_with?: InputMaybe<Scalars['String']>;
  orgId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_not_ends_with?: InputMaybe<Scalars['String']>;
  orgId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  orgId_?: InputMaybe<Treasury_filter>;
  token?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  balance?: InputMaybe<Scalars['BigInt']>;
  balance_not?: InputMaybe<Scalars['BigInt']>;
  balance_gt?: InputMaybe<Scalars['BigInt']>;
  balance_lt?: InputMaybe<Scalars['BigInt']>;
  balance_gte?: InputMaybe<Scalars['BigInt']>;
  balance_lte?: InputMaybe<Scalars['BigInt']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lockedBalance?: InputMaybe<Scalars['BigInt']>;
  lockedBalance_not?: InputMaybe<Scalars['BigInt']>;
  lockedBalance_gt?: InputMaybe<Scalars['BigInt']>;
  lockedBalance_lt?: InputMaybe<Scalars['BigInt']>;
  lockedBalance_gte?: InputMaybe<Scalars['BigInt']>;
  lockedBalance_lte?: InputMaybe<Scalars['BigInt']>;
  lockedBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lockedBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type TreasuryToken_orderBy =
  | 'id'
  | 'orgId'
  | 'token'
  | 'balance'
  | 'lockedBalance';

export type Treasury_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  orgId?: InputMaybe<Scalars['BigInt']>;
  orgId_not?: InputMaybe<Scalars['BigInt']>;
  orgId_gt?: InputMaybe<Scalars['BigInt']>;
  orgId_lt?: InputMaybe<Scalars['BigInt']>;
  orgId_gte?: InputMaybe<Scalars['BigInt']>;
  orgId_lte?: InputMaybe<Scalars['BigInt']>;
  orgId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  orgId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokens_?: InputMaybe<TreasuryToken_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Treasury_orderBy =
  | 'id'
  | 'orgId'
  | 'tokens';

export type UserStat = {
  id: Scalars['ID'];
  proposedTasks: Scalars['BigInt'];
  openedTasks: Scalars['BigInt'];
  assignedTasks: Scalars['BigInt'];
  submittedTasks: Scalars['BigInt'];
  closedTasks: Scalars['BigInt'];
  archivedTasks: Scalars['BigInt'];
  tags?: Maybe<Array<Scalars['String']>>;
};

export type UserStat_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposedTasks?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_not?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  proposedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  openedTasks?: InputMaybe<Scalars['BigInt']>;
  openedTasks_not?: InputMaybe<Scalars['BigInt']>;
  openedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  openedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  openedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  openedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  openedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  openedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assignedTasks?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_not?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  assignedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assignedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submittedTasks?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_not?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  submittedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submittedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  closedTasks?: InputMaybe<Scalars['BigInt']>;
  closedTasks_not?: InputMaybe<Scalars['BigInt']>;
  closedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  closedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  closedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  closedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  closedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  closedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  archivedTasks?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_not?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_gt?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_lt?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_gte?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_lte?: InputMaybe<Scalars['BigInt']>;
  archivedTasks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  archivedTasks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  tags_not?: InputMaybe<Array<Scalars['String']>>;
  tags_contains?: InputMaybe<Array<Scalars['String']>>;
  tags_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  tags_not_contains?: InputMaybe<Array<Scalars['String']>>;
  tags_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type UserStat_orderBy =
  | 'id'
  | 'proposedTasks'
  | 'openedTasks'
  | 'assignedTasks'
  | 'submittedTasks'
  | 'closedTasks'
  | 'archivedTasks'
  | 'tags';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

}
export type QueryBuildstreamV1TestSdk = {
  /** undefined **/
  userStat: InContextSdkMethod<BuildstreamV1TestTypes.Query['userStat'], BuildstreamV1TestTypes.QueryuserStatArgs, MeshContext>,
  /** undefined **/
  userStats: InContextSdkMethod<BuildstreamV1TestTypes.Query['userStats'], BuildstreamV1TestTypes.QueryuserStatsArgs, MeshContext>,
  /** undefined **/
  organizationStat: InContextSdkMethod<BuildstreamV1TestTypes.Query['organizationStat'], BuildstreamV1TestTypes.QueryorganizationStatArgs, MeshContext>,
  /** undefined **/
  organizationStats: InContextSdkMethod<BuildstreamV1TestTypes.Query['organizationStats'], BuildstreamV1TestTypes.QueryorganizationStatsArgs, MeshContext>,
  /** undefined **/
  organization: InContextSdkMethod<BuildstreamV1TestTypes.Query['organization'], BuildstreamV1TestTypes.QueryorganizationArgs, MeshContext>,
  /** undefined **/
  organizations: InContextSdkMethod<BuildstreamV1TestTypes.Query['organizations'], BuildstreamV1TestTypes.QueryorganizationsArgs, MeshContext>,
  /** undefined **/
  task: InContextSdkMethod<BuildstreamV1TestTypes.Query['task'], BuildstreamV1TestTypes.QuerytaskArgs, MeshContext>,
  /** undefined **/
  tasks: InContextSdkMethod<BuildstreamV1TestTypes.Query['tasks'], BuildstreamV1TestTypes.QuerytasksArgs, MeshContext>,
  /** undefined **/
  taskRevision: InContextSdkMethod<BuildstreamV1TestTypes.Query['taskRevision'], BuildstreamV1TestTypes.QuerytaskRevisionArgs, MeshContext>,
  /** undefined **/
  taskRevisions: InContextSdkMethod<BuildstreamV1TestTypes.Query['taskRevisions'], BuildstreamV1TestTypes.QuerytaskRevisionsArgs, MeshContext>,
  /** undefined **/
  taskSnapshot: InContextSdkMethod<BuildstreamV1TestTypes.Query['taskSnapshot'], BuildstreamV1TestTypes.QuerytaskSnapshotArgs, MeshContext>,
  /** undefined **/
  taskSnapshots: InContextSdkMethod<BuildstreamV1TestTypes.Query['taskSnapshots'], BuildstreamV1TestTypes.QuerytaskSnapshotsArgs, MeshContext>,
  /** undefined **/
  treasuryToken: InContextSdkMethod<BuildstreamV1TestTypes.Query['treasuryToken'], BuildstreamV1TestTypes.QuerytreasuryTokenArgs, MeshContext>,
  /** undefined **/
  treasuryTokens: InContextSdkMethod<BuildstreamV1TestTypes.Query['treasuryTokens'], BuildstreamV1TestTypes.QuerytreasuryTokensArgs, MeshContext>,
  /** undefined **/
  treasury: InContextSdkMethod<BuildstreamV1TestTypes.Query['treasury'], BuildstreamV1TestTypes.QuerytreasuryArgs, MeshContext>,
  /** undefined **/
  treasuries: InContextSdkMethod<BuildstreamV1TestTypes.Query['treasuries'], BuildstreamV1TestTypes.QuerytreasuriesArgs, MeshContext>,
  /** undefined **/
  action: InContextSdkMethod<BuildstreamV1TestTypes.Query['action'], BuildstreamV1TestTypes.QueryactionArgs, MeshContext>,
  /** undefined **/
  actions: InContextSdkMethod<BuildstreamV1TestTypes.Query['actions'], BuildstreamV1TestTypes.QueryactionsArgs, MeshContext>,
  /** undefined **/
  team: InContextSdkMethod<BuildstreamV1TestTypes.Query['team'], BuildstreamV1TestTypes.QueryteamArgs, MeshContext>,
  /** undefined **/
  teams: InContextSdkMethod<BuildstreamV1TestTypes.Query['teams'], BuildstreamV1TestTypes.QueryteamsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<BuildstreamV1TestTypes.Query['_meta'], BuildstreamV1TestTypes.Query_metaArgs, MeshContext>
};

export type MutationBuildstreamV1TestSdk = {

};

export type SubscriptionBuildstreamV1TestSdk = {
  /** undefined **/
  userStat: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['userStat'], BuildstreamV1TestTypes.SubscriptionuserStatArgs, MeshContext>,
  /** undefined **/
  userStats: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['userStats'], BuildstreamV1TestTypes.SubscriptionuserStatsArgs, MeshContext>,
  /** undefined **/
  organizationStat: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['organizationStat'], BuildstreamV1TestTypes.SubscriptionorganizationStatArgs, MeshContext>,
  /** undefined **/
  organizationStats: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['organizationStats'], BuildstreamV1TestTypes.SubscriptionorganizationStatsArgs, MeshContext>,
  /** undefined **/
  organization: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['organization'], BuildstreamV1TestTypes.SubscriptionorganizationArgs, MeshContext>,
  /** undefined **/
  organizations: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['organizations'], BuildstreamV1TestTypes.SubscriptionorganizationsArgs, MeshContext>,
  /** undefined **/
  task: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['task'], BuildstreamV1TestTypes.SubscriptiontaskArgs, MeshContext>,
  /** undefined **/
  tasks: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['tasks'], BuildstreamV1TestTypes.SubscriptiontasksArgs, MeshContext>,
  /** undefined **/
  taskRevision: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['taskRevision'], BuildstreamV1TestTypes.SubscriptiontaskRevisionArgs, MeshContext>,
  /** undefined **/
  taskRevisions: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['taskRevisions'], BuildstreamV1TestTypes.SubscriptiontaskRevisionsArgs, MeshContext>,
  /** undefined **/
  taskSnapshot: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['taskSnapshot'], BuildstreamV1TestTypes.SubscriptiontaskSnapshotArgs, MeshContext>,
  /** undefined **/
  taskSnapshots: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['taskSnapshots'], BuildstreamV1TestTypes.SubscriptiontaskSnapshotsArgs, MeshContext>,
  /** undefined **/
  treasuryToken: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['treasuryToken'], BuildstreamV1TestTypes.SubscriptiontreasuryTokenArgs, MeshContext>,
  /** undefined **/
  treasuryTokens: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['treasuryTokens'], BuildstreamV1TestTypes.SubscriptiontreasuryTokensArgs, MeshContext>,
  /** undefined **/
  treasury: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['treasury'], BuildstreamV1TestTypes.SubscriptiontreasuryArgs, MeshContext>,
  /** undefined **/
  treasuries: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['treasuries'], BuildstreamV1TestTypes.SubscriptiontreasuriesArgs, MeshContext>,
  /** undefined **/
  action: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['action'], BuildstreamV1TestTypes.SubscriptionactionArgs, MeshContext>,
  /** undefined **/
  actions: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['actions'], BuildstreamV1TestTypes.SubscriptionactionsArgs, MeshContext>,
  /** undefined **/
  team: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['team'], BuildstreamV1TestTypes.SubscriptionteamArgs, MeshContext>,
  /** undefined **/
  teams: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['teams'], BuildstreamV1TestTypes.SubscriptionteamsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['_meta'], BuildstreamV1TestTypes.Subscription_metaArgs, MeshContext>
};
export type BuildstreamV1TestContext = {
      ["buildstream_v1_test"]: { Query: QueryBuildstreamV1TestSdk, Mutation: MutationBuildstreamV1TestSdk, Subscription: SubscriptionBuildstreamV1TestSdk },
      
    };