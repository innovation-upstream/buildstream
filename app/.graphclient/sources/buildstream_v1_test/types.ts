
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
  reviewers: Array<Scalars['String']>;
  approvers: Array<Scalars['String']>;
  signers: Array<Scalars['String']>;
  requiredTaskApprovals: Scalars['BigInt'];
  requiredConfirmations: Scalars['BigInt'];
  rewardMultiplier: Scalars['BigInt'];
  rewardToken: Scalars['Bytes'];
  isInitialized: Scalars['Boolean'];
  tasks?: Maybe<Array<Task>>;
};


export type OrganizationtasksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Task_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Task_filter>;
};

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
  reviewers?: InputMaybe<Array<Scalars['String']>>;
  reviewers_not?: InputMaybe<Array<Scalars['String']>>;
  reviewers_contains?: InputMaybe<Array<Scalars['String']>>;
  reviewers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  reviewers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  reviewers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
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
  tasks_?: InputMaybe<Task_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Organization_orderBy =
  | 'id'
  | 'orgId'
  | 'name'
  | 'description'
  | 'reviewers'
  | 'approvers'
  | 'signers'
  | 'requiredTaskApprovals'
  | 'requiredConfirmations'
  | 'rewardMultiplier'
  | 'rewardToken'
  | 'isInitialized'
  | 'tasks';

export type Query = {
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  taskCount?: Maybe<TaskCount>;
  taskCounts: Array<TaskCount>;
  treasuryToken?: Maybe<TreasuryToken>;
  treasuryTokens: Array<TreasuryToken>;
  treasury?: Maybe<Treasury>;
  treasuries: Array<Treasury>;
  action?: Maybe<Action>;
  actions: Array<Action>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
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


export type QuerytaskCountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytaskCountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskCount_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskCount_filter>;
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


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  taskCount?: Maybe<TaskCount>;
  taskCounts: Array<TaskCount>;
  treasuryToken?: Maybe<TreasuryToken>;
  treasuryTokens: Array<TreasuryToken>;
  treasury?: Maybe<Treasury>;
  treasuries: Array<Treasury>;
  action?: Maybe<Action>;
  actions: Array<Action>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
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


export type SubscriptiontaskCountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontaskCountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskCount_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskCount_filter>;
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


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Task = {
  id: Scalars['ID'];
  taskId: Scalars['BigInt'];
  orgId: Organization;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  assigner: Scalars['String'];
  assignee?: Maybe<Scalars['String']>;
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
  comment?: Maybe<Scalars['String']>;
  approvedBy?: Maybe<Array<Scalars['String']>>;
  assignmentRequest?: Maybe<Array<Scalars['String']>>;
};

export type TaskCount = {
  id: Scalars['ID'];
  orgId: Scalars['BigInt'];
  count: Scalars['BigInt'];
};

export type TaskCount_filter = {
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
  count?: InputMaybe<Scalars['BigInt']>;
  count_not?: InputMaybe<Scalars['BigInt']>;
  count_gt?: InputMaybe<Scalars['BigInt']>;
  count_lt?: InputMaybe<Scalars['BigInt']>;
  count_gte?: InputMaybe<Scalars['BigInt']>;
  count_lte?: InputMaybe<Scalars['BigInt']>;
  count_in?: InputMaybe<Array<Scalars['BigInt']>>;
  count_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type TaskCount_orderBy =
  | 'id'
  | 'orgId'
  | 'count';

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
  | 'comment'
  | 'approvedBy'
  | 'assignmentRequest';

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
  orgId: Treasury;
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

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Timestamp of the block if available, format depends on the chain */
  timestamp?: Maybe<Scalars['String']>;
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
  organization: InContextSdkMethod<BuildstreamV1TestTypes.Query['organization'], BuildstreamV1TestTypes.QueryorganizationArgs, MeshContext>,
  /** undefined **/
  organizations: InContextSdkMethod<BuildstreamV1TestTypes.Query['organizations'], BuildstreamV1TestTypes.QueryorganizationsArgs, MeshContext>,
  /** undefined **/
  task: InContextSdkMethod<BuildstreamV1TestTypes.Query['task'], BuildstreamV1TestTypes.QuerytaskArgs, MeshContext>,
  /** undefined **/
  tasks: InContextSdkMethod<BuildstreamV1TestTypes.Query['tasks'], BuildstreamV1TestTypes.QuerytasksArgs, MeshContext>,
  /** undefined **/
  taskCount: InContextSdkMethod<BuildstreamV1TestTypes.Query['taskCount'], BuildstreamV1TestTypes.QuerytaskCountArgs, MeshContext>,
  /** undefined **/
  taskCounts: InContextSdkMethod<BuildstreamV1TestTypes.Query['taskCounts'], BuildstreamV1TestTypes.QuerytaskCountsArgs, MeshContext>,
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
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<BuildstreamV1TestTypes.Query['_meta'], BuildstreamV1TestTypes.Query_metaArgs, MeshContext>
};

export type MutationBuildstreamV1TestSdk = {

};

export type SubscriptionBuildstreamV1TestSdk = {
  /** undefined **/
  organization: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['organization'], BuildstreamV1TestTypes.SubscriptionorganizationArgs, MeshContext>,
  /** undefined **/
  organizations: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['organizations'], BuildstreamV1TestTypes.SubscriptionorganizationsArgs, MeshContext>,
  /** undefined **/
  task: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['task'], BuildstreamV1TestTypes.SubscriptiontaskArgs, MeshContext>,
  /** undefined **/
  tasks: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['tasks'], BuildstreamV1TestTypes.SubscriptiontasksArgs, MeshContext>,
  /** undefined **/
  taskCount: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['taskCount'], BuildstreamV1TestTypes.SubscriptiontaskCountArgs, MeshContext>,
  /** undefined **/
  taskCounts: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['taskCounts'], BuildstreamV1TestTypes.SubscriptiontaskCountsArgs, MeshContext>,
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
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<BuildstreamV1TestTypes.Subscription['_meta'], BuildstreamV1TestTypes.Subscription_metaArgs, MeshContext>
};
export type BuildstreamV1TestContext = {
      ["buildstream_v1_test"]: { Query: QueryBuildstreamV1TestSdk, Mutation: MutationBuildstreamV1TestSdk, Subscription: SubscriptionBuildstreamV1TestSdk },
      
    };