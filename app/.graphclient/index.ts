// @ts-nocheck
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import type { BuildstreamV1TestContext } from './sources/buildstream_v1_test/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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
  | 'treasury';

export type Query = {
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  taskSnapshot?: Maybe<TaskSnapshot>;
  taskSnapshots: Array<TaskSnapshot>;
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
  taskSnapshot?: Maybe<TaskSnapshot>;
  taskSnapshots: Array<TaskSnapshot>;
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
  comment?: Maybe<Scalars['String']>;
  approvedBy?: Maybe<Array<Scalars['String']>>;
  assignmentRequest?: Maybe<Array<Scalars['String']>>;
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
  | 'comment'
  | 'approvedBy'
  | 'assignmentRequest';

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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Action: ResolverTypeWrapper<Action>;
  Action_filter: Action_filter;
  Action_orderBy: Action_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  OrderDirection: OrderDirection;
  Organization: ResolverTypeWrapper<Organization>;
  Organization_filter: Organization_filter;
  Organization_orderBy: Organization_orderBy;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Task: ResolverTypeWrapper<Task>;
  TaskCount: ResolverTypeWrapper<TaskCount>;
  TaskCount_filter: TaskCount_filter;
  TaskCount_orderBy: TaskCount_orderBy;
  TaskSnapshot: ResolverTypeWrapper<TaskSnapshot>;
  TaskSnapshot_filter: TaskSnapshot_filter;
  TaskSnapshot_orderBy: TaskSnapshot_orderBy;
  Task_filter: Task_filter;
  Task_orderBy: Task_orderBy;
  Treasury: ResolverTypeWrapper<Treasury>;
  TreasuryToken: ResolverTypeWrapper<TreasuryToken>;
  TreasuryToken_filter: TreasuryToken_filter;
  TreasuryToken_orderBy: TreasuryToken_orderBy;
  Treasury_filter: Treasury_filter;
  Treasury_orderBy: Treasury_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Action: Action;
  Action_filter: Action_filter;
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Organization: Organization;
  Organization_filter: Organization_filter;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  Task: Task;
  TaskCount: TaskCount;
  TaskCount_filter: TaskCount_filter;
  TaskSnapshot: TaskSnapshot;
  TaskSnapshot_filter: TaskSnapshot_filter;
  Task_filter: Task_filter;
  Treasury: Treasury;
  TreasuryToken: TreasuryToken;
  TreasuryToken_filter: TreasuryToken_filter;
  Treasury_filter: Treasury_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ActionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Action'] = ResolversParentTypes['Action']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  actionId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  initiator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  executed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tokenAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  actionType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type OrganizationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  approvers?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  signers?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  requiredTaskApprovals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  requiredConfirmations?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  rewardMultiplier?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  rewardSlashMultiplier?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  slashRewardEvery?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  rewardToken?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  isInitialized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  treasury?: Resolver<ResolversTypes['Treasury'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryorganizationArgs, 'id' | 'subgraphError'>>;
  organizations?: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryorganizationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QuerytaskArgs, 'id' | 'subgraphError'>>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QuerytasksArgs, 'skip' | 'first' | 'subgraphError'>>;
  taskSnapshot?: Resolver<Maybe<ResolversTypes['TaskSnapshot']>, ParentType, ContextType, RequireFields<QuerytaskSnapshotArgs, 'id' | 'subgraphError'>>;
  taskSnapshots?: Resolver<Array<ResolversTypes['TaskSnapshot']>, ParentType, ContextType, RequireFields<QuerytaskSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  taskCount?: Resolver<Maybe<ResolversTypes['TaskCount']>, ParentType, ContextType, RequireFields<QuerytaskCountArgs, 'id' | 'subgraphError'>>;
  taskCounts?: Resolver<Array<ResolversTypes['TaskCount']>, ParentType, ContextType, RequireFields<QuerytaskCountsArgs, 'skip' | 'first' | 'subgraphError'>>;
  treasuryToken?: Resolver<Maybe<ResolversTypes['TreasuryToken']>, ParentType, ContextType, RequireFields<QuerytreasuryTokenArgs, 'id' | 'subgraphError'>>;
  treasuryTokens?: Resolver<Array<ResolversTypes['TreasuryToken']>, ParentType, ContextType, RequireFields<QuerytreasuryTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  treasury?: Resolver<Maybe<ResolversTypes['Treasury']>, ParentType, ContextType, RequireFields<QuerytreasuryArgs, 'id' | 'subgraphError'>>;
  treasuries?: Resolver<Array<ResolversTypes['Treasury']>, ParentType, ContextType, RequireFields<QuerytreasuriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType, RequireFields<QueryactionArgs, 'id' | 'subgraphError'>>;
  actions?: Resolver<Array<ResolversTypes['Action']>, ParentType, ContextType, RequireFields<QueryactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  organization?: SubscriptionResolver<Maybe<ResolversTypes['Organization']>, "organization", ParentType, ContextType, RequireFields<SubscriptionorganizationArgs, 'id' | 'subgraphError'>>;
  organizations?: SubscriptionResolver<Array<ResolversTypes['Organization']>, "organizations", ParentType, ContextType, RequireFields<SubscriptionorganizationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  task?: SubscriptionResolver<Maybe<ResolversTypes['Task']>, "task", ParentType, ContextType, RequireFields<SubscriptiontaskArgs, 'id' | 'subgraphError'>>;
  tasks?: SubscriptionResolver<Array<ResolversTypes['Task']>, "tasks", ParentType, ContextType, RequireFields<SubscriptiontasksArgs, 'skip' | 'first' | 'subgraphError'>>;
  taskSnapshot?: SubscriptionResolver<Maybe<ResolversTypes['TaskSnapshot']>, "taskSnapshot", ParentType, ContextType, RequireFields<SubscriptiontaskSnapshotArgs, 'id' | 'subgraphError'>>;
  taskSnapshots?: SubscriptionResolver<Array<ResolversTypes['TaskSnapshot']>, "taskSnapshots", ParentType, ContextType, RequireFields<SubscriptiontaskSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  taskCount?: SubscriptionResolver<Maybe<ResolversTypes['TaskCount']>, "taskCount", ParentType, ContextType, RequireFields<SubscriptiontaskCountArgs, 'id' | 'subgraphError'>>;
  taskCounts?: SubscriptionResolver<Array<ResolversTypes['TaskCount']>, "taskCounts", ParentType, ContextType, RequireFields<SubscriptiontaskCountsArgs, 'skip' | 'first' | 'subgraphError'>>;
  treasuryToken?: SubscriptionResolver<Maybe<ResolversTypes['TreasuryToken']>, "treasuryToken", ParentType, ContextType, RequireFields<SubscriptiontreasuryTokenArgs, 'id' | 'subgraphError'>>;
  treasuryTokens?: SubscriptionResolver<Array<ResolversTypes['TreasuryToken']>, "treasuryTokens", ParentType, ContextType, RequireFields<SubscriptiontreasuryTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  treasury?: SubscriptionResolver<Maybe<ResolversTypes['Treasury']>, "treasury", ParentType, ContextType, RequireFields<SubscriptiontreasuryArgs, 'id' | 'subgraphError'>>;
  treasuries?: SubscriptionResolver<Array<ResolversTypes['Treasury']>, "treasuries", ParentType, ContextType, RequireFields<SubscriptiontreasuriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  action?: SubscriptionResolver<Maybe<ResolversTypes['Action']>, "action", ParentType, ContextType, RequireFields<SubscriptionactionArgs, 'id' | 'subgraphError'>>;
  actions?: SubscriptionResolver<Array<ResolversTypes['Action']>, "actions", ParentType, ContextType, RequireFields<SubscriptionactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type TaskResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  taskId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assigner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assignee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taskTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  complexityScore?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  reputationLevel?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  requiredApprovals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  rewardAmount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardToken?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  assignDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  submitDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  taskDuration?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  assignmentRequest?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskCountResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TaskCount'] = ResolversParentTypes['TaskCount']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskSnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TaskSnapshot'] = ResolversParentTypes['TaskSnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  taskId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assigner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assignee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taskTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  complexityScore?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  reputationLevel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  requiredApprovals?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardAmount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardToken?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  assignDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  submitDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  taskDuration?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  assignmentRequest?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TreasuryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Treasury'] = ResolversParentTypes['Treasury']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tokens?: Resolver<Maybe<Array<ResolversTypes['TreasuryToken']>>, ParentType, ContextType, RequireFields<TreasurytokensArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TreasuryTokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TreasuryToken'] = ResolversParentTypes['TreasuryToken']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orgId?: Resolver<Maybe<ResolversTypes['Treasury']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lockedBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Action?: ActionResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Organization?: OrganizationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskCount?: TaskCountResolvers<ContextType>;
  TaskSnapshot?: TaskSnapshotResolvers<ContextType>;
  Treasury?: TreasuryResolvers<ContextType>;
  TreasuryToken?: TreasuryTokenResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = BuildstreamV1TestContext & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn = (moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/buildstream_v1_test/introspectionSchema":
      return import("./sources/buildstream_v1_test/introspectionSchema");
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources = [];
const transforms = [];
const additionalEnvelopPlugins = [];
const buildstreamV1TestTransforms = [];
const additionalTypeDefs = [] as any[];
const buildstreamV1TestHandler = new GraphqlHandler({
              name: "buildstream_v1_test",
              config: {"endpoint":"https://api.thegraph.com/subgraphs/name/kil-san/buildstream-v1-test"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("buildstream_v1_test"),
              logger: logger.child("buildstream_v1_test"),
              importFn,
            });
sources[0] = {
          name: 'buildstream_v1_test',
          handler: buildstreamV1TestHandler,
          transforms: buildstreamV1TestTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: GetActionDocument,
        get rawSDL() {
          return printWithCache(GetActionDocument);
        },
        location: 'GetActionDocument.graphql'
      },{
        document: GetActionsDocument,
        get rawSDL() {
          return printWithCache(GetActionsDocument);
        },
        location: 'GetActionsDocument.graphql'
      },{
        document: GetOrganizationDocument,
        get rawSDL() {
          return printWithCache(GetOrganizationDocument);
        },
        location: 'GetOrganizationDocument.graphql'
      },{
        document: GetOrganizationsDocument,
        get rawSDL() {
          return printWithCache(GetOrganizationsDocument);
        },
        location: 'GetOrganizationsDocument.graphql'
      },{
        document: GetTaskDocument,
        get rawSDL() {
          return printWithCache(GetTaskDocument);
        },
        location: 'GetTaskDocument.graphql'
      },{
        document: GetTasksDocument,
        get rawSDL() {
          return printWithCache(GetTasksDocument);
        },
        location: 'GetTasksDocument.graphql'
      },{
        document: GetTaskCountDocument,
        get rawSDL() {
          return printWithCache(GetTaskCountDocument);
        },
        location: 'GetTaskCountDocument.graphql'
      },{
        document: GetTaskCountsDocument,
        get rawSDL() {
          return printWithCache(GetTaskCountsDocument);
        },
        location: 'GetTaskCountsDocument.graphql'
      },{
        document: GetTaskSnapshotsDocument,
        get rawSDL() {
          return printWithCache(GetTaskSnapshotsDocument);
        },
        location: 'GetTaskSnapshotsDocument.graphql'
      },{
        document: GetTreasuryDocument,
        get rawSDL() {
          return printWithCache(GetTreasuryDocument);
        },
        location: 'GetTreasuryDocument.graphql'
      },{
        document: GetTreasurysDocument,
        get rawSDL() {
          return printWithCache(GetTreasurysDocument);
        },
        location: 'GetTreasurysDocument.graphql'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler() {
  return createMeshHTTPHandler({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance<MeshContext>>;

export function getBuiltGraphClient(): Promise<MeshInstance<MeshContext>> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh<MeshContext>(meshOptions)).then(mesh => {
      const id$ = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        id$.then(id => mesh.pubsub.unsubscribe(id)).catch(err => console.error(err));
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type GetActionQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetActionQuery = { action?: Maybe<Pick<Action, 'id' | 'actionId' | 'orgId' | 'initiator' | 'targetAddress' | 'value' | 'data' | 'executed' | 'tokenAddress' | 'actionType' | 'approvedBy'>> };

export type GetActionsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Action_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Action_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetActionsQuery = { actions: Array<Pick<Action, 'id' | 'actionId' | 'orgId' | 'initiator' | 'targetAddress' | 'value' | 'data' | 'executed' | 'tokenAddress' | 'actionType' | 'approvedBy'>> };

export type GetOrganizationQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetOrganizationQuery = { organization?: Maybe<(
    Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
    & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> } }
  )> };

export type GetOrganizationsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Organization_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Organization_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetOrganizationsQuery = { organizations: Array<(
    Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardToken' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'isInitialized'>
    & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> } }
  )> };

export type GetTaskQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetTaskQuery = { task?: Maybe<(
    Pick<Task, 'id' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'taskDuration' | 'comment' | 'approvedBy' | 'assignmentRequest'>
    & { orgId: (
      Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardToken' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> } }
    ) }
  )> };

export type GetTasksQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Task_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Task_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetTasksQuery = { tasks: Array<(
    Pick<Task, 'id' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'taskDuration' | 'comment' | 'approvedBy' | 'assignmentRequest'>
    & { orgId: (
      Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardToken' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> } }
    ) }
  )> };

export type GetTaskCountQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetTaskCountQuery = { taskCount?: Maybe<Pick<TaskCount, 'orgId' | 'count'>> };

export type GetTaskCountsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskCount_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskCount_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetTaskCountsQuery = { taskCounts: Array<Pick<TaskCount, 'orgId' | 'count'>> };

export type GetTaskSnapshotsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TaskSnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetTaskSnapshotsQuery = { taskSnapshots: Array<(
    Pick<TaskSnapshot, 'id' | 'actor' | 'block' | 'timestamp' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'taskDuration' | 'comment' | 'approvedBy' | 'assignmentRequest'>
    & { orgId: (
      Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardToken' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> } }
    ) }
  )> };

export type GetTreasuryQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetTreasuryQuery = { treasury?: Maybe<(
    Pick<Treasury, 'id' | 'orgId'>
    & { tokens?: Maybe<Array<(
      Pick<TreasuryToken, 'id' | 'token' | 'balance' | 'lockedBalance'>
      & { orgId?: Maybe<Pick<Treasury, 'orgId'>> }
    )>> }
  )> };

export type GetTreasurysQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Treasury_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Treasury_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetTreasurysQuery = { treasuries: Array<(
    Pick<Treasury, 'id' | 'orgId'>
    & { tokens?: Maybe<Array<(
      Pick<TreasuryToken, 'id' | 'token' | 'balance' | 'lockedBalance'>
      & { orgId?: Maybe<Pick<Treasury, 'orgId'>> }
    )>> }
  )> };


export const GetActionDocument = gql`
    query GetAction($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  action(id: $id, block: $block, subgraphError: $subgraphError) {
    id
    actionId
    orgId
    initiator
    targetAddress
    value
    data
    executed
    tokenAddress
    actionType
    approvedBy
  }
}
    ` as unknown as DocumentNode<GetActionQuery, GetActionQueryVariables>;
export const GetActionsDocument = gql`
    query GetActions($skip: Int = 0, $first: Int = 100, $orderBy: Action_orderBy, $orderDirection: OrderDirection, $where: Action_filter, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  actions(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
    subgraphError: $subgraphError
  ) {
    id
    actionId
    orgId
    initiator
    targetAddress
    value
    data
    executed
    tokenAddress
    actionType
    approvedBy
  }
}
    ` as unknown as DocumentNode<GetActionsQuery, GetActionsQueryVariables>;
export const GetOrganizationDocument = gql`
    query GetOrganization($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  organization(id: $id, block: $block, subgraphError: $subgraphError) {
    id
    orgId
    name
    description
    approvers
    signers
    requiredTaskApprovals
    requiredConfirmations
    rewardMultiplier
    rewardSlashMultiplier
    slashRewardEvery
    rewardToken
    isInitialized
    treasury {
      tokens {
        token
        balance
        lockedBalance
      }
    }
  }
}
    ` as unknown as DocumentNode<GetOrganizationQuery, GetOrganizationQueryVariables>;
export const GetOrganizationsDocument = gql`
    query GetOrganizations($skip: Int = 0, $first: Int = 100, $orderBy: Organization_orderBy, $orderDirection: OrderDirection, $where: Organization_filter, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  organizations(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
    subgraphError: $subgraphError
  ) {
    id
    orgId
    name
    description
    approvers
    signers
    requiredTaskApprovals
    requiredConfirmations
    rewardMultiplier
    rewardToken
    rewardSlashMultiplier
    slashRewardEvery
    isInitialized
    treasury {
      tokens {
        token
        balance
        lockedBalance
      }
    }
  }
}
    ` as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetTaskDocument = gql`
    query GetTask($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  task(id: $id, block: $block, subgraphError: $subgraphError) {
    id
    taskId
    orgId {
      id
      orgId
      name
      description
      approvers
      signers
      requiredTaskApprovals
      requiredConfirmations
      rewardMultiplier
      rewardToken
      rewardSlashMultiplier
      slashRewardEvery
      isInitialized
      treasury {
        tokens {
          token
          balance
          lockedBalance
        }
      }
    }
    title
    description
    assigner
    assignee
    taskTags
    status
    complexityScore
    reputationLevel
    requiredApprovals
    rewardAmount
    rewardToken
    assignDate
    submitDate
    taskDuration
    comment
    approvedBy
    assignmentRequest
  }
}
    ` as unknown as DocumentNode<GetTaskQuery, GetTaskQueryVariables>;
export const GetTasksDocument = gql`
    query GetTasks($skip: Int = 0, $first: Int = 100, $orderBy: Task_orderBy, $orderDirection: OrderDirection, $where: Task_filter, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  tasks(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
    subgraphError: $subgraphError
  ) {
    id
    taskId
    orgId {
      id
      orgId
      name
      description
      approvers
      signers
      requiredTaskApprovals
      requiredConfirmations
      rewardMultiplier
      rewardToken
      rewardSlashMultiplier
      slashRewardEvery
      isInitialized
      treasury {
        tokens {
          token
          balance
          lockedBalance
        }
      }
    }
    title
    description
    assigner
    assignee
    taskTags
    status
    complexityScore
    reputationLevel
    requiredApprovals
    rewardAmount
    rewardToken
    assignDate
    submitDate
    taskDuration
    comment
    approvedBy
    assignmentRequest
  }
}
    ` as unknown as DocumentNode<GetTasksQuery, GetTasksQueryVariables>;
export const GetTaskCountDocument = gql`
    query GetTaskCount($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  taskCount(id: $id, block: $block, subgraphError: $subgraphError) {
    orgId
    count
  }
}
    ` as unknown as DocumentNode<GetTaskCountQuery, GetTaskCountQueryVariables>;
export const GetTaskCountsDocument = gql`
    query GetTaskCounts($skip: Int = 0, $first: Int = 100, $orderBy: TaskCount_orderBy, $orderDirection: OrderDirection, $where: TaskCount_filter, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  taskCounts(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
    subgraphError: $subgraphError
  ) {
    orgId
    count
  }
}
    ` as unknown as DocumentNode<GetTaskCountsQuery, GetTaskCountsQueryVariables>;
export const GetTaskSnapshotsDocument = gql`
    query GetTaskSnapshots($skip: Int = 0, $first: Int = 100, $orderBy: TaskSnapshot_orderBy, $orderDirection: OrderDirection, $where: TaskSnapshot_filter, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  taskSnapshots(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
    subgraphError: $subgraphError
  ) {
    id
    actor
    block
    timestamp
    taskId
    orgId {
      id
      orgId
      name
      description
      approvers
      signers
      requiredTaskApprovals
      requiredConfirmations
      rewardMultiplier
      rewardToken
      rewardSlashMultiplier
      slashRewardEvery
      isInitialized
      treasury {
        tokens {
          token
          balance
          lockedBalance
        }
      }
    }
    title
    description
    assigner
    assignee
    taskTags
    status
    complexityScore
    reputationLevel
    requiredApprovals
    rewardAmount
    rewardToken
    assignDate
    submitDate
    taskDuration
    comment
    approvedBy
    assignmentRequest
  }
}
    ` as unknown as DocumentNode<GetTaskSnapshotsQuery, GetTaskSnapshotsQueryVariables>;
export const GetTreasuryDocument = gql`
    query GetTreasury($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  treasury(id: $id, block: $block, subgraphError: $subgraphError) {
    id
    orgId
    tokens {
      id
      orgId {
        orgId
      }
      token
      balance
      lockedBalance
    }
  }
}
    ` as unknown as DocumentNode<GetTreasuryQuery, GetTreasuryQueryVariables>;
export const GetTreasurysDocument = gql`
    query GetTreasurys($skip: Int = 0, $first: Int = 100, $orderBy: Treasury_orderBy, $orderDirection: OrderDirection, $where: Treasury_filter, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  treasuries(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
    subgraphError: $subgraphError
  ) {
    id
    orgId
    tokens {
      id
      orgId {
        orgId
      }
      token
      balance
      lockedBalance
    }
  }
}
    ` as unknown as DocumentNode<GetTreasurysQuery, GetTreasurysQueryVariables>;












export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetAction(variables: GetActionQueryVariables, options?: C): Promise<GetActionQuery> {
      return requester<GetActionQuery, GetActionQueryVariables>(GetActionDocument, variables, options) as Promise<GetActionQuery>;
    },
    GetActions(variables?: GetActionsQueryVariables, options?: C): Promise<GetActionsQuery> {
      return requester<GetActionsQuery, GetActionsQueryVariables>(GetActionsDocument, variables, options) as Promise<GetActionsQuery>;
    },
    GetOrganization(variables: GetOrganizationQueryVariables, options?: C): Promise<GetOrganizationQuery> {
      return requester<GetOrganizationQuery, GetOrganizationQueryVariables>(GetOrganizationDocument, variables, options) as Promise<GetOrganizationQuery>;
    },
    GetOrganizations(variables?: GetOrganizationsQueryVariables, options?: C): Promise<GetOrganizationsQuery> {
      return requester<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, variables, options) as Promise<GetOrganizationsQuery>;
    },
    GetTask(variables: GetTaskQueryVariables, options?: C): Promise<GetTaskQuery> {
      return requester<GetTaskQuery, GetTaskQueryVariables>(GetTaskDocument, variables, options) as Promise<GetTaskQuery>;
    },
    GetTasks(variables?: GetTasksQueryVariables, options?: C): Promise<GetTasksQuery> {
      return requester<GetTasksQuery, GetTasksQueryVariables>(GetTasksDocument, variables, options) as Promise<GetTasksQuery>;
    },
    GetTaskCount(variables: GetTaskCountQueryVariables, options?: C): Promise<GetTaskCountQuery> {
      return requester<GetTaskCountQuery, GetTaskCountQueryVariables>(GetTaskCountDocument, variables, options) as Promise<GetTaskCountQuery>;
    },
    GetTaskCounts(variables?: GetTaskCountsQueryVariables, options?: C): Promise<GetTaskCountsQuery> {
      return requester<GetTaskCountsQuery, GetTaskCountsQueryVariables>(GetTaskCountsDocument, variables, options) as Promise<GetTaskCountsQuery>;
    },
    GetTaskSnapshots(variables?: GetTaskSnapshotsQueryVariables, options?: C): Promise<GetTaskSnapshotsQuery> {
      return requester<GetTaskSnapshotsQuery, GetTaskSnapshotsQueryVariables>(GetTaskSnapshotsDocument, variables, options) as Promise<GetTaskSnapshotsQuery>;
    },
    GetTreasury(variables: GetTreasuryQueryVariables, options?: C): Promise<GetTreasuryQuery> {
      return requester<GetTreasuryQuery, GetTreasuryQueryVariables>(GetTreasuryDocument, variables, options) as Promise<GetTreasuryQuery>;
    },
    GetTreasurys(variables?: GetTreasurysQueryVariables, options?: C): Promise<GetTreasurysQuery> {
      return requester<GetTreasurysQuery, GetTreasurysQueryVariables>(GetTreasurysDocument, variables, options) as Promise<GetTreasurysQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;