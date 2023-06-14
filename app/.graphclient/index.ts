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
  Int8: any;
};

export type Action = {
  id: Scalars['ID'];
  actionId: Scalars['BigInt'];
  orgId: Scalars['BigInt'];
  organizationSnapshot: OrganizationSnapshot;
  initiator: Scalars['String'];
  targetAddress?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
  data?: Maybe<Scalars['Bytes']>;
  executed: Scalars['Boolean'];
  tokenAddress?: Maybe<Scalars['String']>;
  actionType: Scalars['Int'];
  approvedBy?: Maybe<Array<Scalars['String']>>;
  initiatedAt: Scalars['BigInt'];
  completedAt?: Maybe<Scalars['BigInt']>;
  oldValue?: Maybe<Scalars['Bytes']>;
  updateCount: Scalars['BigInt'];
};

export type ActionSnapshot = {
  id: Scalars['ID'];
  actionId: Scalars['BigInt'];
  orgId: Scalars['BigInt'];
  organizationSnapshot: OrganizationSnapshot;
  initiator: Scalars['String'];
  targetAddress?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
  data?: Maybe<Scalars['Bytes']>;
  executed: Scalars['Boolean'];
  tokenAddress?: Maybe<Scalars['String']>;
  actionType: Scalars['Int'];
  approvedBy?: Maybe<Array<Scalars['String']>>;
  initiatedAt: Scalars['BigInt'];
  completedAt?: Maybe<Scalars['BigInt']>;
  actor: Scalars['String'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  updateCount: Scalars['BigInt'];
};

export type ActionSnapshot_filter = {
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
  organizationSnapshot?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not?: InputMaybe<Scalars['String']>;
  organizationSnapshot_gt?: InputMaybe<Scalars['String']>;
  organizationSnapshot_lt?: InputMaybe<Scalars['String']>;
  organizationSnapshot_gte?: InputMaybe<Scalars['String']>;
  organizationSnapshot_lte?: InputMaybe<Scalars['String']>;
  organizationSnapshot_in?: InputMaybe<Array<Scalars['String']>>;
  organizationSnapshot_not_in?: InputMaybe<Array<Scalars['String']>>;
  organizationSnapshot_contains?: InputMaybe<Scalars['String']>;
  organizationSnapshot_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_contains?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_starts_with?: InputMaybe<Scalars['String']>;
  organizationSnapshot_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_starts_with?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_ends_with?: InputMaybe<Scalars['String']>;
  organizationSnapshot_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_ends_with?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_?: InputMaybe<OrganizationSnapshot_filter>;
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
  data_gt?: InputMaybe<Scalars['Bytes']>;
  data_lt?: InputMaybe<Scalars['Bytes']>;
  data_gte?: InputMaybe<Scalars['Bytes']>;
  data_lte?: InputMaybe<Scalars['Bytes']>;
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
  initiatedAt?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_not?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_gt?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_lt?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_gte?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_lte?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initiatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  completedAt?: InputMaybe<Scalars['BigInt']>;
  completedAt_not?: InputMaybe<Scalars['BigInt']>;
  completedAt_gt?: InputMaybe<Scalars['BigInt']>;
  completedAt_lt?: InputMaybe<Scalars['BigInt']>;
  completedAt_gte?: InputMaybe<Scalars['BigInt']>;
  completedAt_lte?: InputMaybe<Scalars['BigInt']>;
  completedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  completedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  updateCount?: InputMaybe<Scalars['BigInt']>;
  updateCount_not?: InputMaybe<Scalars['BigInt']>;
  updateCount_gt?: InputMaybe<Scalars['BigInt']>;
  updateCount_lt?: InputMaybe<Scalars['BigInt']>;
  updateCount_gte?: InputMaybe<Scalars['BigInt']>;
  updateCount_lte?: InputMaybe<Scalars['BigInt']>;
  updateCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updateCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ActionSnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ActionSnapshot_filter>>>;
};

export type ActionSnapshot_orderBy =
  | 'id'
  | 'actionId'
  | 'orgId'
  | 'organizationSnapshot'
  | 'organizationSnapshot__id'
  | 'organizationSnapshot__orgId'
  | 'organizationSnapshot__name'
  | 'organizationSnapshot__description'
  | 'organizationSnapshot__requiredTaskApprovals'
  | 'organizationSnapshot__requiredConfirmations'
  | 'organizationSnapshot__rewardMultiplier'
  | 'organizationSnapshot__rewardSlashMultiplier'
  | 'organizationSnapshot__slashRewardEvery'
  | 'organizationSnapshot__rewardToken'
  | 'organizationSnapshot__isInitialized'
  | 'initiator'
  | 'targetAddress'
  | 'value'
  | 'data'
  | 'executed'
  | 'tokenAddress'
  | 'actionType'
  | 'approvedBy'
  | 'initiatedAt'
  | 'completedAt'
  | 'actor'
  | 'block'
  | 'timestamp'
  | 'updateCount';

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
  organizationSnapshot?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not?: InputMaybe<Scalars['String']>;
  organizationSnapshot_gt?: InputMaybe<Scalars['String']>;
  organizationSnapshot_lt?: InputMaybe<Scalars['String']>;
  organizationSnapshot_gte?: InputMaybe<Scalars['String']>;
  organizationSnapshot_lte?: InputMaybe<Scalars['String']>;
  organizationSnapshot_in?: InputMaybe<Array<Scalars['String']>>;
  organizationSnapshot_not_in?: InputMaybe<Array<Scalars['String']>>;
  organizationSnapshot_contains?: InputMaybe<Scalars['String']>;
  organizationSnapshot_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_contains?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_starts_with?: InputMaybe<Scalars['String']>;
  organizationSnapshot_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_starts_with?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_ends_with?: InputMaybe<Scalars['String']>;
  organizationSnapshot_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_ends_with?: InputMaybe<Scalars['String']>;
  organizationSnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationSnapshot_?: InputMaybe<OrganizationSnapshot_filter>;
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
  data_gt?: InputMaybe<Scalars['Bytes']>;
  data_lt?: InputMaybe<Scalars['Bytes']>;
  data_gte?: InputMaybe<Scalars['Bytes']>;
  data_lte?: InputMaybe<Scalars['Bytes']>;
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
  initiatedAt?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_not?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_gt?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_lt?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_gte?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_lte?: InputMaybe<Scalars['BigInt']>;
  initiatedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initiatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  completedAt?: InputMaybe<Scalars['BigInt']>;
  completedAt_not?: InputMaybe<Scalars['BigInt']>;
  completedAt_gt?: InputMaybe<Scalars['BigInt']>;
  completedAt_lt?: InputMaybe<Scalars['BigInt']>;
  completedAt_gte?: InputMaybe<Scalars['BigInt']>;
  completedAt_lte?: InputMaybe<Scalars['BigInt']>;
  completedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  completedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldValue?: InputMaybe<Scalars['Bytes']>;
  oldValue_not?: InputMaybe<Scalars['Bytes']>;
  oldValue_gt?: InputMaybe<Scalars['Bytes']>;
  oldValue_lt?: InputMaybe<Scalars['Bytes']>;
  oldValue_gte?: InputMaybe<Scalars['Bytes']>;
  oldValue_lte?: InputMaybe<Scalars['Bytes']>;
  oldValue_in?: InputMaybe<Array<Scalars['Bytes']>>;
  oldValue_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  oldValue_contains?: InputMaybe<Scalars['Bytes']>;
  oldValue_not_contains?: InputMaybe<Scalars['Bytes']>;
  updateCount?: InputMaybe<Scalars['BigInt']>;
  updateCount_not?: InputMaybe<Scalars['BigInt']>;
  updateCount_gt?: InputMaybe<Scalars['BigInt']>;
  updateCount_lt?: InputMaybe<Scalars['BigInt']>;
  updateCount_gte?: InputMaybe<Scalars['BigInt']>;
  updateCount_lte?: InputMaybe<Scalars['BigInt']>;
  updateCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updateCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Action_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Action_filter>>>;
};

export type Action_orderBy =
  | 'id'
  | 'actionId'
  | 'orgId'
  | 'organizationSnapshot'
  | 'organizationSnapshot__id'
  | 'organizationSnapshot__orgId'
  | 'organizationSnapshot__name'
  | 'organizationSnapshot__description'
  | 'organizationSnapshot__requiredTaskApprovals'
  | 'organizationSnapshot__requiredConfirmations'
  | 'organizationSnapshot__rewardMultiplier'
  | 'organizationSnapshot__rewardSlashMultiplier'
  | 'organizationSnapshot__slashRewardEvery'
  | 'organizationSnapshot__rewardToken'
  | 'organizationSnapshot__isInitialized'
  | 'initiator'
  | 'targetAddress'
  | 'value'
  | 'data'
  | 'executed'
  | 'tokenAddress'
  | 'actionType'
  | 'approvedBy'
  | 'initiatedAt'
  | 'completedAt'
  | 'oldValue'
  | 'updateCount';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Deposit = {
  id: Scalars['ID'];
  orgId: Scalars['BigInt'];
  token: Scalars['String'];
  amount: Scalars['BigInt'];
  initiator: Scalars['String'];
  completedAt: Scalars['BigInt'];
};

export type Deposit_filter = {
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
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  completedAt?: InputMaybe<Scalars['BigInt']>;
  completedAt_not?: InputMaybe<Scalars['BigInt']>;
  completedAt_gt?: InputMaybe<Scalars['BigInt']>;
  completedAt_lt?: InputMaybe<Scalars['BigInt']>;
  completedAt_gte?: InputMaybe<Scalars['BigInt']>;
  completedAt_lte?: InputMaybe<Scalars['BigInt']>;
  completedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  completedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Deposit_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Deposit_filter>>>;
};

export type Deposit_orderBy =
  | 'id'
  | 'orgId'
  | 'token'
  | 'amount'
  | 'initiator'
  | 'completedAt';

export type Notification = {
  id: Scalars['ID'];
  tags: Array<Scalars['String']>;
  users?: Maybe<Array<Scalars['String']>>;
  orgId: Organization;
  task?: Maybe<Task>;
  action?: Maybe<Action>;
  deposit?: Maybe<Deposit>;
  taskSnapshot?: Maybe<TaskSnapshot>;
  actionSnapshot?: Maybe<ActionSnapshot>;
  timestamp: Scalars['BigInt'];
};

export type Notification_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  tags_not?: InputMaybe<Array<Scalars['String']>>;
  tags_contains?: InputMaybe<Array<Scalars['String']>>;
  tags_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  tags_not_contains?: InputMaybe<Array<Scalars['String']>>;
  tags_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  users?: InputMaybe<Array<Scalars['String']>>;
  users_not?: InputMaybe<Array<Scalars['String']>>;
  users_contains?: InputMaybe<Array<Scalars['String']>>;
  users_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  users_not_contains?: InputMaybe<Array<Scalars['String']>>;
  users_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
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
  action?: InputMaybe<Scalars['String']>;
  action_not?: InputMaybe<Scalars['String']>;
  action_gt?: InputMaybe<Scalars['String']>;
  action_lt?: InputMaybe<Scalars['String']>;
  action_gte?: InputMaybe<Scalars['String']>;
  action_lte?: InputMaybe<Scalars['String']>;
  action_in?: InputMaybe<Array<Scalars['String']>>;
  action_not_in?: InputMaybe<Array<Scalars['String']>>;
  action_contains?: InputMaybe<Scalars['String']>;
  action_contains_nocase?: InputMaybe<Scalars['String']>;
  action_not_contains?: InputMaybe<Scalars['String']>;
  action_not_contains_nocase?: InputMaybe<Scalars['String']>;
  action_starts_with?: InputMaybe<Scalars['String']>;
  action_starts_with_nocase?: InputMaybe<Scalars['String']>;
  action_not_starts_with?: InputMaybe<Scalars['String']>;
  action_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  action_ends_with?: InputMaybe<Scalars['String']>;
  action_ends_with_nocase?: InputMaybe<Scalars['String']>;
  action_not_ends_with?: InputMaybe<Scalars['String']>;
  action_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  action_?: InputMaybe<Action_filter>;
  deposit?: InputMaybe<Scalars['String']>;
  deposit_not?: InputMaybe<Scalars['String']>;
  deposit_gt?: InputMaybe<Scalars['String']>;
  deposit_lt?: InputMaybe<Scalars['String']>;
  deposit_gte?: InputMaybe<Scalars['String']>;
  deposit_lte?: InputMaybe<Scalars['String']>;
  deposit_in?: InputMaybe<Array<Scalars['String']>>;
  deposit_not_in?: InputMaybe<Array<Scalars['String']>>;
  deposit_contains?: InputMaybe<Scalars['String']>;
  deposit_contains_nocase?: InputMaybe<Scalars['String']>;
  deposit_not_contains?: InputMaybe<Scalars['String']>;
  deposit_not_contains_nocase?: InputMaybe<Scalars['String']>;
  deposit_starts_with?: InputMaybe<Scalars['String']>;
  deposit_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deposit_not_starts_with?: InputMaybe<Scalars['String']>;
  deposit_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deposit_ends_with?: InputMaybe<Scalars['String']>;
  deposit_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deposit_not_ends_with?: InputMaybe<Scalars['String']>;
  deposit_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deposit_?: InputMaybe<Deposit_filter>;
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
  actionSnapshot?: InputMaybe<Scalars['String']>;
  actionSnapshot_not?: InputMaybe<Scalars['String']>;
  actionSnapshot_gt?: InputMaybe<Scalars['String']>;
  actionSnapshot_lt?: InputMaybe<Scalars['String']>;
  actionSnapshot_gte?: InputMaybe<Scalars['String']>;
  actionSnapshot_lte?: InputMaybe<Scalars['String']>;
  actionSnapshot_in?: InputMaybe<Array<Scalars['String']>>;
  actionSnapshot_not_in?: InputMaybe<Array<Scalars['String']>>;
  actionSnapshot_contains?: InputMaybe<Scalars['String']>;
  actionSnapshot_contains_nocase?: InputMaybe<Scalars['String']>;
  actionSnapshot_not_contains?: InputMaybe<Scalars['String']>;
  actionSnapshot_not_contains_nocase?: InputMaybe<Scalars['String']>;
  actionSnapshot_starts_with?: InputMaybe<Scalars['String']>;
  actionSnapshot_starts_with_nocase?: InputMaybe<Scalars['String']>;
  actionSnapshot_not_starts_with?: InputMaybe<Scalars['String']>;
  actionSnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  actionSnapshot_ends_with?: InputMaybe<Scalars['String']>;
  actionSnapshot_ends_with_nocase?: InputMaybe<Scalars['String']>;
  actionSnapshot_not_ends_with?: InputMaybe<Scalars['String']>;
  actionSnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  actionSnapshot_?: InputMaybe<ActionSnapshot_filter>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Notification_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Notification_filter>>>;
};

export type Notification_orderBy =
  | 'id'
  | 'tags'
  | 'users'
  | 'orgId'
  | 'orgId__id'
  | 'orgId__orgId'
  | 'orgId__name'
  | 'orgId__description'
  | 'orgId__requiredTaskApprovals'
  | 'orgId__requiredConfirmations'
  | 'orgId__rewardMultiplier'
  | 'orgId__rewardSlashMultiplier'
  | 'orgId__slashRewardEvery'
  | 'orgId__rewardToken'
  | 'orgId__isInitialized'
  | 'task'
  | 'task__id'
  | 'task__taskId'
  | 'task__externalId'
  | 'task__title'
  | 'task__description'
  | 'task__assigner'
  | 'task__assignee'
  | 'task__teamAssignee'
  | 'task__status'
  | 'task__complexityScore'
  | 'task__reputationLevel'
  | 'task__requiredApprovals'
  | 'task__rewardAmount'
  | 'task__rewardToken'
  | 'task__assignDate'
  | 'task__submitDate'
  | 'task__dueDate'
  | 'task__comment'
  | 'task__staked'
  | 'task__raw'
  | 'task__disableSelfAssign'
  | 'action'
  | 'action__id'
  | 'action__actionId'
  | 'action__orgId'
  | 'action__initiator'
  | 'action__targetAddress'
  | 'action__value'
  | 'action__data'
  | 'action__executed'
  | 'action__tokenAddress'
  | 'action__actionType'
  | 'action__initiatedAt'
  | 'action__completedAt'
  | 'action__oldValue'
  | 'action__updateCount'
  | 'deposit'
  | 'deposit__id'
  | 'deposit__orgId'
  | 'deposit__token'
  | 'deposit__amount'
  | 'deposit__initiator'
  | 'deposit__completedAt'
  | 'taskSnapshot'
  | 'taskSnapshot__id'
  | 'taskSnapshot__actor'
  | 'taskSnapshot__block'
  | 'taskSnapshot__timestamp'
  | 'taskSnapshot__taskId'
  | 'taskSnapshot__title'
  | 'taskSnapshot__description'
  | 'taskSnapshot__assigner'
  | 'taskSnapshot__assignee'
  | 'taskSnapshot__teamAssignee'
  | 'taskSnapshot__status'
  | 'taskSnapshot__complexityScore'
  | 'taskSnapshot__reputationLevel'
  | 'taskSnapshot__requiredApprovals'
  | 'taskSnapshot__rewardAmount'
  | 'taskSnapshot__rewardToken'
  | 'taskSnapshot__assignDate'
  | 'taskSnapshot__submitDate'
  | 'taskSnapshot__dueDate'
  | 'taskSnapshot__comment'
  | 'taskSnapshot__staked'
  | 'taskSnapshot__disableSelfAssign'
  | 'actionSnapshot'
  | 'actionSnapshot__id'
  | 'actionSnapshot__actionId'
  | 'actionSnapshot__orgId'
  | 'actionSnapshot__initiator'
  | 'actionSnapshot__targetAddress'
  | 'actionSnapshot__value'
  | 'actionSnapshot__data'
  | 'actionSnapshot__executed'
  | 'actionSnapshot__tokenAddress'
  | 'actionSnapshot__actionType'
  | 'actionSnapshot__initiatedAt'
  | 'actionSnapshot__completedAt'
  | 'actionSnapshot__actor'
  | 'actionSnapshot__block'
  | 'actionSnapshot__timestamp'
  | 'actionSnapshot__updateCount'
  | 'timestamp';

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
  members?: Maybe<Array<Scalars['String']>>;
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

export type OrganizationSnapshot = {
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

export type OrganizationSnapshot_filter = {
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
  rewardToken_gt?: InputMaybe<Scalars['Bytes']>;
  rewardToken_lt?: InputMaybe<Scalars['Bytes']>;
  rewardToken_gte?: InputMaybe<Scalars['Bytes']>;
  rewardToken_lte?: InputMaybe<Scalars['Bytes']>;
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
  and?: InputMaybe<Array<InputMaybe<OrganizationSnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<OrganizationSnapshot_filter>>>;
};

export type OrganizationSnapshot_orderBy =
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
  | 'treasury__id'
  | 'treasury__orgId'
  | 'stat'
  | 'stat__id'
  | 'stat__proposedTasks'
  | 'stat__openedTasks'
  | 'stat__assignedTasks'
  | 'stat__submittedTasks'
  | 'stat__closedTasks'
  | 'stat__archivedTasks';

export type OrganizationStat = {
  id: Scalars['ID'];
  proposedTasks: Scalars['BigInt'];
  openedTasks: Scalars['BigInt'];
  assignedTasks: Scalars['BigInt'];
  submittedTasks: Scalars['BigInt'];
  closedTasks: Scalars['BigInt'];
  archivedTasks: Scalars['BigInt'];
  tags?: Maybe<Array<Scalars['BigInt']>>;
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
  tags?: InputMaybe<Array<Scalars['BigInt']>>;
  tags_not?: InputMaybe<Array<Scalars['BigInt']>>;
  tags_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  tags_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  tags_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  tags_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OrganizationStat_filter>>>;
  or?: InputMaybe<Array<InputMaybe<OrganizationStat_filter>>>;
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
  members?: InputMaybe<Array<Scalars['String']>>;
  members_not?: InputMaybe<Array<Scalars['String']>>;
  members_contains?: InputMaybe<Array<Scalars['String']>>;
  members_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  members_not_contains?: InputMaybe<Array<Scalars['String']>>;
  members_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
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
  rewardToken_gt?: InputMaybe<Scalars['Bytes']>;
  rewardToken_lt?: InputMaybe<Scalars['Bytes']>;
  rewardToken_gte?: InputMaybe<Scalars['Bytes']>;
  rewardToken_lte?: InputMaybe<Scalars['Bytes']>;
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
  and?: InputMaybe<Array<InputMaybe<Organization_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Organization_filter>>>;
};

export type Organization_orderBy =
  | 'id'
  | 'orgId'
  | 'name'
  | 'description'
  | 'approvers'
  | 'signers'
  | 'members'
  | 'requiredTaskApprovals'
  | 'requiredConfirmations'
  | 'rewardMultiplier'
  | 'rewardSlashMultiplier'
  | 'slashRewardEvery'
  | 'rewardToken'
  | 'isInitialized'
  | 'treasury'
  | 'treasury__id'
  | 'treasury__orgId'
  | 'stat'
  | 'stat__id'
  | 'stat__proposedTasks'
  | 'stat__openedTasks'
  | 'stat__assignedTasks'
  | 'stat__submittedTasks'
  | 'stat__closedTasks'
  | 'stat__archivedTasks';

export type Query = {
  userStat?: Maybe<UserStat>;
  userStats: Array<UserStat>;
  userToken?: Maybe<UserToken>;
  userTokens: Array<UserToken>;
  organizationStat?: Maybe<OrganizationStat>;
  organizationStats: Array<OrganizationStat>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  organizationSnapshot?: Maybe<OrganizationSnapshot>;
  organizationSnapshots: Array<OrganizationSnapshot>;
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
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  action?: Maybe<Action>;
  actions: Array<Action>;
  actionSnapshot?: Maybe<ActionSnapshot>;
  actionSnapshots: Array<ActionSnapshot>;
  team?: Maybe<Team>;
  teams: Array<Team>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
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


export type QueryuserTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuserTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserToken_filter>;
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


export type QueryorganizationSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryorganizationSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrganizationSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OrganizationSnapshot_filter>;
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


export type QuerydepositArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydepositsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
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


export type QueryactionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryactionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ActionSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ActionSnapshot_filter>;
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


export type QuerynotificationArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynotificationsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Notification_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Notification_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  userStat?: Maybe<UserStat>;
  userStats: Array<UserStat>;
  userToken?: Maybe<UserToken>;
  userTokens: Array<UserToken>;
  organizationStat?: Maybe<OrganizationStat>;
  organizationStats: Array<OrganizationStat>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  organizationSnapshot?: Maybe<OrganizationSnapshot>;
  organizationSnapshots: Array<OrganizationSnapshot>;
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
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  action?: Maybe<Action>;
  actions: Array<Action>;
  actionSnapshot?: Maybe<ActionSnapshot>;
  actionSnapshots: Array<ActionSnapshot>;
  team?: Maybe<Team>;
  teams: Array<Team>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
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


export type SubscriptionuserTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionuserTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserToken_filter>;
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


export type SubscriptionorganizationSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionorganizationSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrganizationSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OrganizationSnapshot_filter>;
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


export type SubscriptiondepositArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondepositsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
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


export type SubscriptionactionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionactionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ActionSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ActionSnapshot_filter>;
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


export type SubscriptionnotificationArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnotificationsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Notification_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Notification_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Task = {
  id: Scalars['ID'];
  taskId: Scalars['BigInt'];
  externalId?: Maybe<Scalars['String']>;
  orgId: Organization;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  assigner?: Maybe<Scalars['String']>;
  assignee?: Maybe<Scalars['String']>;
  teamAssignee?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
  taskTags: Array<Scalars['BigInt']>;
  status: Scalars['Int'];
  complexityScore: Scalars['BigInt'];
  reputationLevel: Scalars['BigInt'];
  requiredApprovals: Scalars['BigInt'];
  rewardAmount?: Maybe<Scalars['BigInt']>;
  rewardToken?: Maybe<Scalars['Bytes']>;
  assignDate?: Maybe<Scalars['BigInt']>;
  submitDate?: Maybe<Scalars['BigInt']>;
  dueDate: Scalars['BigInt'];
  comment?: Maybe<Scalars['String']>;
  approvedBy?: Maybe<Array<Scalars['String']>>;
  assignmentRequest?: Maybe<Array<Scalars['String']>>;
  staked: Scalars['Boolean'];
  revisions?: Maybe<Array<TaskRevision>>;
  raw: Scalars['String'];
  disableSelfAssign: Scalars['Boolean'];
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
  dueDateExtension: Scalars['BigInt'];
  dueDateExtensionRequest: Scalars['BigInt'];
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
  externalRevisionId_gt?: InputMaybe<Scalars['Bytes']>;
  externalRevisionId_lt?: InputMaybe<Scalars['Bytes']>;
  externalRevisionId_gte?: InputMaybe<Scalars['Bytes']>;
  externalRevisionId_lte?: InputMaybe<Scalars['Bytes']>;
  externalRevisionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  externalRevisionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  externalRevisionId_contains?: InputMaybe<Scalars['Bytes']>;
  externalRevisionId_not_contains?: InputMaybe<Scalars['Bytes']>;
  revisionHash?: InputMaybe<Scalars['Bytes']>;
  revisionHash_not?: InputMaybe<Scalars['Bytes']>;
  revisionHash_gt?: InputMaybe<Scalars['Bytes']>;
  revisionHash_lt?: InputMaybe<Scalars['Bytes']>;
  revisionHash_gte?: InputMaybe<Scalars['Bytes']>;
  revisionHash_lte?: InputMaybe<Scalars['Bytes']>;
  revisionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  revisionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  revisionHash_contains?: InputMaybe<Scalars['Bytes']>;
  revisionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  dueDateExtension?: InputMaybe<Scalars['BigInt']>;
  dueDateExtension_not?: InputMaybe<Scalars['BigInt']>;
  dueDateExtension_gt?: InputMaybe<Scalars['BigInt']>;
  dueDateExtension_lt?: InputMaybe<Scalars['BigInt']>;
  dueDateExtension_gte?: InputMaybe<Scalars['BigInt']>;
  dueDateExtension_lte?: InputMaybe<Scalars['BigInt']>;
  dueDateExtension_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dueDateExtension_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dueDateExtensionRequest?: InputMaybe<Scalars['BigInt']>;
  dueDateExtensionRequest_not?: InputMaybe<Scalars['BigInt']>;
  dueDateExtensionRequest_gt?: InputMaybe<Scalars['BigInt']>;
  dueDateExtensionRequest_lt?: InputMaybe<Scalars['BigInt']>;
  dueDateExtensionRequest_gte?: InputMaybe<Scalars['BigInt']>;
  dueDateExtensionRequest_lte?: InputMaybe<Scalars['BigInt']>;
  dueDateExtensionRequest_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dueDateExtensionRequest_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  and?: InputMaybe<Array<InputMaybe<TaskRevision_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TaskRevision_filter>>>;
};

export type TaskRevision_orderBy =
  | 'id'
  | 'task'
  | 'task__id'
  | 'task__taskId'
  | 'task__externalId'
  | 'task__title'
  | 'task__description'
  | 'task__assigner'
  | 'task__assignee'
  | 'task__teamAssignee'
  | 'task__status'
  | 'task__complexityScore'
  | 'task__reputationLevel'
  | 'task__requiredApprovals'
  | 'task__rewardAmount'
  | 'task__rewardToken'
  | 'task__assignDate'
  | 'task__submitDate'
  | 'task__dueDate'
  | 'task__comment'
  | 'task__staked'
  | 'task__raw'
  | 'task__disableSelfAssign'
  | 'taskSnapshot'
  | 'taskSnapshot__id'
  | 'taskSnapshot__actor'
  | 'taskSnapshot__block'
  | 'taskSnapshot__timestamp'
  | 'taskSnapshot__taskId'
  | 'taskSnapshot__title'
  | 'taskSnapshot__description'
  | 'taskSnapshot__assigner'
  | 'taskSnapshot__assignee'
  | 'taskSnapshot__teamAssignee'
  | 'taskSnapshot__status'
  | 'taskSnapshot__complexityScore'
  | 'taskSnapshot__reputationLevel'
  | 'taskSnapshot__requiredApprovals'
  | 'taskSnapshot__rewardAmount'
  | 'taskSnapshot__rewardToken'
  | 'taskSnapshot__assignDate'
  | 'taskSnapshot__submitDate'
  | 'taskSnapshot__dueDate'
  | 'taskSnapshot__comment'
  | 'taskSnapshot__staked'
  | 'taskSnapshot__disableSelfAssign'
  | 'revisionId'
  | 'requester'
  | 'externalRevisionId'
  | 'revisionHash'
  | 'dueDateExtension'
  | 'dueDateExtensionRequest'
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
  teamAssignee?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
  taskTags: Array<Scalars['BigInt']>;
  status: Scalars['Int'];
  complexityScore?: Maybe<Scalars['BigInt']>;
  reputationLevel?: Maybe<Scalars['BigInt']>;
  requiredApprovals?: Maybe<Scalars['BigInt']>;
  rewardAmount?: Maybe<Scalars['BigInt']>;
  rewardToken?: Maybe<Scalars['Bytes']>;
  assignDate?: Maybe<Scalars['BigInt']>;
  submitDate?: Maybe<Scalars['BigInt']>;
  dueDate?: Maybe<Scalars['BigInt']>;
  comment?: Maybe<Scalars['String']>;
  approvedBy?: Maybe<Array<Scalars['String']>>;
  assignmentRequest?: Maybe<Array<Scalars['String']>>;
  staked: Scalars['Boolean'];
  disableSelfAssign: Scalars['Boolean'];
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
  taskTags?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_not?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
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
  rewardToken_gt?: InputMaybe<Scalars['Bytes']>;
  rewardToken_lt?: InputMaybe<Scalars['Bytes']>;
  rewardToken_gte?: InputMaybe<Scalars['Bytes']>;
  rewardToken_lte?: InputMaybe<Scalars['Bytes']>;
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
  dueDate?: InputMaybe<Scalars['BigInt']>;
  dueDate_not?: InputMaybe<Scalars['BigInt']>;
  dueDate_gt?: InputMaybe<Scalars['BigInt']>;
  dueDate_lt?: InputMaybe<Scalars['BigInt']>;
  dueDate_gte?: InputMaybe<Scalars['BigInt']>;
  dueDate_lte?: InputMaybe<Scalars['BigInt']>;
  dueDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dueDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  disableSelfAssign?: InputMaybe<Scalars['Boolean']>;
  disableSelfAssign_not?: InputMaybe<Scalars['Boolean']>;
  disableSelfAssign_in?: InputMaybe<Array<Scalars['Boolean']>>;
  disableSelfAssign_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TaskSnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TaskSnapshot_filter>>>;
};

export type TaskSnapshot_orderBy =
  | 'id'
  | 'actor'
  | 'block'
  | 'timestamp'
  | 'taskId'
  | 'orgId'
  | 'orgId__id'
  | 'orgId__orgId'
  | 'orgId__name'
  | 'orgId__description'
  | 'orgId__requiredTaskApprovals'
  | 'orgId__requiredConfirmations'
  | 'orgId__rewardMultiplier'
  | 'orgId__rewardSlashMultiplier'
  | 'orgId__slashRewardEvery'
  | 'orgId__rewardToken'
  | 'orgId__isInitialized'
  | 'title'
  | 'description'
  | 'assigner'
  | 'assignee'
  | 'teamAssignee'
  | 'team'
  | 'team__id'
  | 'team__teamId'
  | 'team__name'
  | 'team__description'
  | 'team__walletAddress'
  | 'team__archived'
  | 'team__teamRewardMultiplier'
  | 'taskTags'
  | 'status'
  | 'complexityScore'
  | 'reputationLevel'
  | 'requiredApprovals'
  | 'rewardAmount'
  | 'rewardToken'
  | 'assignDate'
  | 'submitDate'
  | 'dueDate'
  | 'comment'
  | 'approvedBy'
  | 'assignmentRequest'
  | 'staked'
  | 'disableSelfAssign';

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
  externalId?: InputMaybe<Scalars['String']>;
  externalId_not?: InputMaybe<Scalars['String']>;
  externalId_gt?: InputMaybe<Scalars['String']>;
  externalId_lt?: InputMaybe<Scalars['String']>;
  externalId_gte?: InputMaybe<Scalars['String']>;
  externalId_lte?: InputMaybe<Scalars['String']>;
  externalId_in?: InputMaybe<Array<Scalars['String']>>;
  externalId_not_in?: InputMaybe<Array<Scalars['String']>>;
  externalId_contains?: InputMaybe<Scalars['String']>;
  externalId_contains_nocase?: InputMaybe<Scalars['String']>;
  externalId_not_contains?: InputMaybe<Scalars['String']>;
  externalId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  externalId_starts_with?: InputMaybe<Scalars['String']>;
  externalId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  externalId_not_starts_with?: InputMaybe<Scalars['String']>;
  externalId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  externalId_ends_with?: InputMaybe<Scalars['String']>;
  externalId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  externalId_not_ends_with?: InputMaybe<Scalars['String']>;
  externalId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  taskTags?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_not?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  taskTags_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
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
  rewardToken_gt?: InputMaybe<Scalars['Bytes']>;
  rewardToken_lt?: InputMaybe<Scalars['Bytes']>;
  rewardToken_gte?: InputMaybe<Scalars['Bytes']>;
  rewardToken_lte?: InputMaybe<Scalars['Bytes']>;
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
  dueDate?: InputMaybe<Scalars['BigInt']>;
  dueDate_not?: InputMaybe<Scalars['BigInt']>;
  dueDate_gt?: InputMaybe<Scalars['BigInt']>;
  dueDate_lt?: InputMaybe<Scalars['BigInt']>;
  dueDate_gte?: InputMaybe<Scalars['BigInt']>;
  dueDate_lte?: InputMaybe<Scalars['BigInt']>;
  dueDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dueDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  raw?: InputMaybe<Scalars['String']>;
  raw_not?: InputMaybe<Scalars['String']>;
  raw_gt?: InputMaybe<Scalars['String']>;
  raw_lt?: InputMaybe<Scalars['String']>;
  raw_gte?: InputMaybe<Scalars['String']>;
  raw_lte?: InputMaybe<Scalars['String']>;
  raw_in?: InputMaybe<Array<Scalars['String']>>;
  raw_not_in?: InputMaybe<Array<Scalars['String']>>;
  raw_contains?: InputMaybe<Scalars['String']>;
  raw_contains_nocase?: InputMaybe<Scalars['String']>;
  raw_not_contains?: InputMaybe<Scalars['String']>;
  raw_not_contains_nocase?: InputMaybe<Scalars['String']>;
  raw_starts_with?: InputMaybe<Scalars['String']>;
  raw_starts_with_nocase?: InputMaybe<Scalars['String']>;
  raw_not_starts_with?: InputMaybe<Scalars['String']>;
  raw_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  raw_ends_with?: InputMaybe<Scalars['String']>;
  raw_ends_with_nocase?: InputMaybe<Scalars['String']>;
  raw_not_ends_with?: InputMaybe<Scalars['String']>;
  raw_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  disableSelfAssign?: InputMaybe<Scalars['Boolean']>;
  disableSelfAssign_not?: InputMaybe<Scalars['Boolean']>;
  disableSelfAssign_in?: InputMaybe<Array<Scalars['Boolean']>>;
  disableSelfAssign_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Task_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Task_filter>>>;
};

export type Task_orderBy =
  | 'id'
  | 'taskId'
  | 'externalId'
  | 'orgId'
  | 'orgId__id'
  | 'orgId__orgId'
  | 'orgId__name'
  | 'orgId__description'
  | 'orgId__requiredTaskApprovals'
  | 'orgId__requiredConfirmations'
  | 'orgId__rewardMultiplier'
  | 'orgId__rewardSlashMultiplier'
  | 'orgId__slashRewardEvery'
  | 'orgId__rewardToken'
  | 'orgId__isInitialized'
  | 'title'
  | 'description'
  | 'assigner'
  | 'assignee'
  | 'teamAssignee'
  | 'team'
  | 'team__id'
  | 'team__teamId'
  | 'team__name'
  | 'team__description'
  | 'team__walletAddress'
  | 'team__archived'
  | 'team__teamRewardMultiplier'
  | 'taskTags'
  | 'status'
  | 'complexityScore'
  | 'reputationLevel'
  | 'requiredApprovals'
  | 'rewardAmount'
  | 'rewardToken'
  | 'assignDate'
  | 'submitDate'
  | 'dueDate'
  | 'comment'
  | 'approvedBy'
  | 'assignmentRequest'
  | 'staked'
  | 'revisions'
  | 'raw'
  | 'disableSelfAssign';

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
  and?: InputMaybe<Array<InputMaybe<Team_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Team_filter>>>;
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
  and?: InputMaybe<Array<InputMaybe<TreasuryToken_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TreasuryToken_filter>>>;
};

export type TreasuryToken_orderBy =
  | 'id'
  | 'orgId'
  | 'orgId__id'
  | 'orgId__orgId'
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
  and?: InputMaybe<Array<InputMaybe<Treasury_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Treasury_filter>>>;
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
  tokens?: Maybe<Array<UserToken>>;
};


export type UserStattokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserToken_filter>;
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
  tokens_?: InputMaybe<UserToken_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UserStat_filter>>>;
  or?: InputMaybe<Array<InputMaybe<UserStat_filter>>>;
};

export type UserStat_orderBy =
  | 'id'
  | 'proposedTasks'
  | 'openedTasks'
  | 'assignedTasks'
  | 'submittedTasks'
  | 'closedTasks'
  | 'archivedTasks'
  | 'tokens';

export type UserToken = {
  id: Scalars['ID'];
  user: UserStat;
  token: Scalars['BigInt'];
  count: Scalars['BigInt'];
};

export type UserToken_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<UserStat_filter>;
  token?: InputMaybe<Scalars['BigInt']>;
  token_not?: InputMaybe<Scalars['BigInt']>;
  token_gt?: InputMaybe<Scalars['BigInt']>;
  token_lt?: InputMaybe<Scalars['BigInt']>;
  token_gte?: InputMaybe<Scalars['BigInt']>;
  token_lte?: InputMaybe<Scalars['BigInt']>;
  token_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  and?: InputMaybe<Array<InputMaybe<UserToken_filter>>>;
  or?: InputMaybe<Array<InputMaybe<UserToken_filter>>>;
};

export type UserToken_orderBy =
  | 'id'
  | 'user'
  | 'user__id'
  | 'user__proposedTasks'
  | 'user__openedTasks'
  | 'user__assignedTasks'
  | 'user__submittedTasks'
  | 'user__closedTasks'
  | 'user__archivedTasks'
  | 'token'
  | 'count';

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
  ActionSnapshot: ResolverTypeWrapper<ActionSnapshot>;
  ActionSnapshot_filter: ActionSnapshot_filter;
  ActionSnapshot_orderBy: ActionSnapshot_orderBy;
  Action_filter: Action_filter;
  Action_orderBy: Action_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Deposit: ResolverTypeWrapper<Deposit>;
  Deposit_filter: Deposit_filter;
  Deposit_orderBy: Deposit_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']>;
  Notification: ResolverTypeWrapper<Notification>;
  Notification_filter: Notification_filter;
  Notification_orderBy: Notification_orderBy;
  OrderDirection: OrderDirection;
  Organization: ResolverTypeWrapper<Organization>;
  OrganizationSnapshot: ResolverTypeWrapper<OrganizationSnapshot>;
  OrganizationSnapshot_filter: OrganizationSnapshot_filter;
  OrganizationSnapshot_orderBy: OrganizationSnapshot_orderBy;
  OrganizationStat: ResolverTypeWrapper<OrganizationStat>;
  OrganizationStat_filter: OrganizationStat_filter;
  OrganizationStat_orderBy: OrganizationStat_orderBy;
  Organization_filter: Organization_filter;
  Organization_orderBy: Organization_orderBy;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Task: ResolverTypeWrapper<Task>;
  TaskRevision: ResolverTypeWrapper<TaskRevision>;
  TaskRevision_filter: TaskRevision_filter;
  TaskRevision_orderBy: TaskRevision_orderBy;
  TaskSnapshot: ResolverTypeWrapper<TaskSnapshot>;
  TaskSnapshot_filter: TaskSnapshot_filter;
  TaskSnapshot_orderBy: TaskSnapshot_orderBy;
  Task_filter: Task_filter;
  Task_orderBy: Task_orderBy;
  Team: ResolverTypeWrapper<Team>;
  Team_filter: Team_filter;
  Team_orderBy: Team_orderBy;
  Treasury: ResolverTypeWrapper<Treasury>;
  TreasuryToken: ResolverTypeWrapper<TreasuryToken>;
  TreasuryToken_filter: TreasuryToken_filter;
  TreasuryToken_orderBy: TreasuryToken_orderBy;
  Treasury_filter: Treasury_filter;
  Treasury_orderBy: Treasury_orderBy;
  UserStat: ResolverTypeWrapper<UserStat>;
  UserStat_filter: UserStat_filter;
  UserStat_orderBy: UserStat_orderBy;
  UserToken: ResolverTypeWrapper<UserToken>;
  UserToken_filter: UserToken_filter;
  UserToken_orderBy: UserToken_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Action: Action;
  ActionSnapshot: ActionSnapshot;
  ActionSnapshot_filter: ActionSnapshot_filter;
  Action_filter: Action_filter;
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Deposit: Deposit;
  Deposit_filter: Deposit_filter;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Int8: Scalars['Int8'];
  Notification: Notification;
  Notification_filter: Notification_filter;
  Organization: Organization;
  OrganizationSnapshot: OrganizationSnapshot;
  OrganizationSnapshot_filter: OrganizationSnapshot_filter;
  OrganizationStat: OrganizationStat;
  OrganizationStat_filter: OrganizationStat_filter;
  Organization_filter: Organization_filter;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  Task: Task;
  TaskRevision: TaskRevision;
  TaskRevision_filter: TaskRevision_filter;
  TaskSnapshot: TaskSnapshot;
  TaskSnapshot_filter: TaskSnapshot_filter;
  Task_filter: Task_filter;
  Team: Team;
  Team_filter: Team_filter;
  Treasury: Treasury;
  TreasuryToken: TreasuryToken;
  TreasuryToken_filter: TreasuryToken_filter;
  Treasury_filter: Treasury_filter;
  UserStat: UserStat;
  UserStat_filter: UserStat_filter;
  UserToken: UserToken;
  UserToken_filter: UserToken_filter;
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
  organizationSnapshot?: Resolver<ResolversTypes['OrganizationSnapshot'], ParentType, ContextType>;
  initiator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  executed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tokenAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  actionType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  initiatedAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  oldValue?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  updateCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActionSnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ActionSnapshot'] = ResolversParentTypes['ActionSnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  actionId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  organizationSnapshot?: Resolver<ResolversTypes['OrganizationSnapshot'], ParentType, ContextType>;
  initiator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  executed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tokenAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  actionType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  initiatedAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  updateCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
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

export type DepositResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Deposit'] = ResolversParentTypes['Deposit']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  initiator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  completedAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type NotificationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType>;
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>;
  deposit?: Resolver<Maybe<ResolversTypes['Deposit']>, ParentType, ContextType>;
  taskSnapshot?: Resolver<Maybe<ResolversTypes['TaskSnapshot']>, ParentType, ContextType>;
  actionSnapshot?: Resolver<Maybe<ResolversTypes['ActionSnapshot']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  approvers?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  signers?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  members?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  requiredTaskApprovals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  requiredConfirmations?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  rewardMultiplier?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  rewardSlashMultiplier?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  slashRewardEvery?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  rewardToken?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  isInitialized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  treasury?: Resolver<ResolversTypes['Treasury'], ParentType, ContextType>;
  stat?: Resolver<Maybe<ResolversTypes['OrganizationStat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationSnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['OrganizationSnapshot'] = ResolversParentTypes['OrganizationSnapshot']> = ResolversObject<{
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
  stat?: Resolver<Maybe<ResolversTypes['OrganizationStat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationStatResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['OrganizationStat'] = ResolversParentTypes['OrganizationStat']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  proposedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  openedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  assignedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  submittedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  closedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  archivedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  userStat?: Resolver<Maybe<ResolversTypes['UserStat']>, ParentType, ContextType, RequireFields<QueryuserStatArgs, 'id' | 'subgraphError'>>;
  userStats?: Resolver<Array<ResolversTypes['UserStat']>, ParentType, ContextType, RequireFields<QueryuserStatsArgs, 'skip' | 'first' | 'subgraphError'>>;
  userToken?: Resolver<Maybe<ResolversTypes['UserToken']>, ParentType, ContextType, RequireFields<QueryuserTokenArgs, 'id' | 'subgraphError'>>;
  userTokens?: Resolver<Array<ResolversTypes['UserToken']>, ParentType, ContextType, RequireFields<QueryuserTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  organizationStat?: Resolver<Maybe<ResolversTypes['OrganizationStat']>, ParentType, ContextType, RequireFields<QueryorganizationStatArgs, 'id' | 'subgraphError'>>;
  organizationStats?: Resolver<Array<ResolversTypes['OrganizationStat']>, ParentType, ContextType, RequireFields<QueryorganizationStatsArgs, 'skip' | 'first' | 'subgraphError'>>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryorganizationArgs, 'id' | 'subgraphError'>>;
  organizations?: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryorganizationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  organizationSnapshot?: Resolver<Maybe<ResolversTypes['OrganizationSnapshot']>, ParentType, ContextType, RequireFields<QueryorganizationSnapshotArgs, 'id' | 'subgraphError'>>;
  organizationSnapshots?: Resolver<Array<ResolversTypes['OrganizationSnapshot']>, ParentType, ContextType, RequireFields<QueryorganizationSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QuerytaskArgs, 'id' | 'subgraphError'>>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QuerytasksArgs, 'skip' | 'first' | 'subgraphError'>>;
  taskRevision?: Resolver<Maybe<ResolversTypes['TaskRevision']>, ParentType, ContextType, RequireFields<QuerytaskRevisionArgs, 'id' | 'subgraphError'>>;
  taskRevisions?: Resolver<Array<ResolversTypes['TaskRevision']>, ParentType, ContextType, RequireFields<QuerytaskRevisionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  taskSnapshot?: Resolver<Maybe<ResolversTypes['TaskSnapshot']>, ParentType, ContextType, RequireFields<QuerytaskSnapshotArgs, 'id' | 'subgraphError'>>;
  taskSnapshots?: Resolver<Array<ResolversTypes['TaskSnapshot']>, ParentType, ContextType, RequireFields<QuerytaskSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  treasuryToken?: Resolver<Maybe<ResolversTypes['TreasuryToken']>, ParentType, ContextType, RequireFields<QuerytreasuryTokenArgs, 'id' | 'subgraphError'>>;
  treasuryTokens?: Resolver<Array<ResolversTypes['TreasuryToken']>, ParentType, ContextType, RequireFields<QuerytreasuryTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  treasury?: Resolver<Maybe<ResolversTypes['Treasury']>, ParentType, ContextType, RequireFields<QuerytreasuryArgs, 'id' | 'subgraphError'>>;
  treasuries?: Resolver<Array<ResolversTypes['Treasury']>, ParentType, ContextType, RequireFields<QuerytreasuriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  deposit?: Resolver<Maybe<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<QuerydepositArgs, 'id' | 'subgraphError'>>;
  deposits?: Resolver<Array<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<QuerydepositsArgs, 'skip' | 'first' | 'subgraphError'>>;
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType, RequireFields<QueryactionArgs, 'id' | 'subgraphError'>>;
  actions?: Resolver<Array<ResolversTypes['Action']>, ParentType, ContextType, RequireFields<QueryactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  actionSnapshot?: Resolver<Maybe<ResolversTypes['ActionSnapshot']>, ParentType, ContextType, RequireFields<QueryactionSnapshotArgs, 'id' | 'subgraphError'>>;
  actionSnapshots?: Resolver<Array<ResolversTypes['ActionSnapshot']>, ParentType, ContextType, RequireFields<QueryactionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<QueryteamArgs, 'id' | 'subgraphError'>>;
  teams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<QueryteamsArgs, 'skip' | 'first' | 'subgraphError'>>;
  notification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<QuerynotificationArgs, 'id' | 'subgraphError'>>;
  notifications?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<QuerynotificationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  userStat?: SubscriptionResolver<Maybe<ResolversTypes['UserStat']>, "userStat", ParentType, ContextType, RequireFields<SubscriptionuserStatArgs, 'id' | 'subgraphError'>>;
  userStats?: SubscriptionResolver<Array<ResolversTypes['UserStat']>, "userStats", ParentType, ContextType, RequireFields<SubscriptionuserStatsArgs, 'skip' | 'first' | 'subgraphError'>>;
  userToken?: SubscriptionResolver<Maybe<ResolversTypes['UserToken']>, "userToken", ParentType, ContextType, RequireFields<SubscriptionuserTokenArgs, 'id' | 'subgraphError'>>;
  userTokens?: SubscriptionResolver<Array<ResolversTypes['UserToken']>, "userTokens", ParentType, ContextType, RequireFields<SubscriptionuserTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  organizationStat?: SubscriptionResolver<Maybe<ResolversTypes['OrganizationStat']>, "organizationStat", ParentType, ContextType, RequireFields<SubscriptionorganizationStatArgs, 'id' | 'subgraphError'>>;
  organizationStats?: SubscriptionResolver<Array<ResolversTypes['OrganizationStat']>, "organizationStats", ParentType, ContextType, RequireFields<SubscriptionorganizationStatsArgs, 'skip' | 'first' | 'subgraphError'>>;
  organization?: SubscriptionResolver<Maybe<ResolversTypes['Organization']>, "organization", ParentType, ContextType, RequireFields<SubscriptionorganizationArgs, 'id' | 'subgraphError'>>;
  organizations?: SubscriptionResolver<Array<ResolversTypes['Organization']>, "organizations", ParentType, ContextType, RequireFields<SubscriptionorganizationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  organizationSnapshot?: SubscriptionResolver<Maybe<ResolversTypes['OrganizationSnapshot']>, "organizationSnapshot", ParentType, ContextType, RequireFields<SubscriptionorganizationSnapshotArgs, 'id' | 'subgraphError'>>;
  organizationSnapshots?: SubscriptionResolver<Array<ResolversTypes['OrganizationSnapshot']>, "organizationSnapshots", ParentType, ContextType, RequireFields<SubscriptionorganizationSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  task?: SubscriptionResolver<Maybe<ResolversTypes['Task']>, "task", ParentType, ContextType, RequireFields<SubscriptiontaskArgs, 'id' | 'subgraphError'>>;
  tasks?: SubscriptionResolver<Array<ResolversTypes['Task']>, "tasks", ParentType, ContextType, RequireFields<SubscriptiontasksArgs, 'skip' | 'first' | 'subgraphError'>>;
  taskRevision?: SubscriptionResolver<Maybe<ResolversTypes['TaskRevision']>, "taskRevision", ParentType, ContextType, RequireFields<SubscriptiontaskRevisionArgs, 'id' | 'subgraphError'>>;
  taskRevisions?: SubscriptionResolver<Array<ResolversTypes['TaskRevision']>, "taskRevisions", ParentType, ContextType, RequireFields<SubscriptiontaskRevisionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  taskSnapshot?: SubscriptionResolver<Maybe<ResolversTypes['TaskSnapshot']>, "taskSnapshot", ParentType, ContextType, RequireFields<SubscriptiontaskSnapshotArgs, 'id' | 'subgraphError'>>;
  taskSnapshots?: SubscriptionResolver<Array<ResolversTypes['TaskSnapshot']>, "taskSnapshots", ParentType, ContextType, RequireFields<SubscriptiontaskSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  treasuryToken?: SubscriptionResolver<Maybe<ResolversTypes['TreasuryToken']>, "treasuryToken", ParentType, ContextType, RequireFields<SubscriptiontreasuryTokenArgs, 'id' | 'subgraphError'>>;
  treasuryTokens?: SubscriptionResolver<Array<ResolversTypes['TreasuryToken']>, "treasuryTokens", ParentType, ContextType, RequireFields<SubscriptiontreasuryTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  treasury?: SubscriptionResolver<Maybe<ResolversTypes['Treasury']>, "treasury", ParentType, ContextType, RequireFields<SubscriptiontreasuryArgs, 'id' | 'subgraphError'>>;
  treasuries?: SubscriptionResolver<Array<ResolversTypes['Treasury']>, "treasuries", ParentType, ContextType, RequireFields<SubscriptiontreasuriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  deposit?: SubscriptionResolver<Maybe<ResolversTypes['Deposit']>, "deposit", ParentType, ContextType, RequireFields<SubscriptiondepositArgs, 'id' | 'subgraphError'>>;
  deposits?: SubscriptionResolver<Array<ResolversTypes['Deposit']>, "deposits", ParentType, ContextType, RequireFields<SubscriptiondepositsArgs, 'skip' | 'first' | 'subgraphError'>>;
  action?: SubscriptionResolver<Maybe<ResolversTypes['Action']>, "action", ParentType, ContextType, RequireFields<SubscriptionactionArgs, 'id' | 'subgraphError'>>;
  actions?: SubscriptionResolver<Array<ResolversTypes['Action']>, "actions", ParentType, ContextType, RequireFields<SubscriptionactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  actionSnapshot?: SubscriptionResolver<Maybe<ResolversTypes['ActionSnapshot']>, "actionSnapshot", ParentType, ContextType, RequireFields<SubscriptionactionSnapshotArgs, 'id' | 'subgraphError'>>;
  actionSnapshots?: SubscriptionResolver<Array<ResolversTypes['ActionSnapshot']>, "actionSnapshots", ParentType, ContextType, RequireFields<SubscriptionactionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  team?: SubscriptionResolver<Maybe<ResolversTypes['Team']>, "team", ParentType, ContextType, RequireFields<SubscriptionteamArgs, 'id' | 'subgraphError'>>;
  teams?: SubscriptionResolver<Array<ResolversTypes['Team']>, "teams", ParentType, ContextType, RequireFields<SubscriptionteamsArgs, 'skip' | 'first' | 'subgraphError'>>;
  notification?: SubscriptionResolver<Maybe<ResolversTypes['Notification']>, "notification", ParentType, ContextType, RequireFields<SubscriptionnotificationArgs, 'id' | 'subgraphError'>>;
  notifications?: SubscriptionResolver<Array<ResolversTypes['Notification']>, "notifications", ParentType, ContextType, RequireFields<SubscriptionnotificationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type TaskResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  taskId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  externalId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orgId?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assigner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assignee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  teamAssignee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  taskTags?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  complexityScore?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  reputationLevel?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  requiredApprovals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  rewardAmount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardToken?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  assignDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  submitDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  dueDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  assignmentRequest?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  staked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  revisions?: Resolver<Maybe<Array<ResolversTypes['TaskRevision']>>, ParentType, ContextType, RequireFields<TaskrevisionsArgs, 'skip' | 'first'>>;
  raw?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  disableSelfAssign?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskRevisionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TaskRevision'] = ResolversParentTypes['TaskRevision']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  taskSnapshot?: Resolver<ResolversTypes['TaskSnapshot'], ParentType, ContextType>;
  revisionId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  requester?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalRevisionId?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  revisionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  dueDateExtension?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  dueDateExtensionRequest?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  teamAssignee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  taskTags?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  complexityScore?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  reputationLevel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  requiredApprovals?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardAmount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardToken?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  assignDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  submitDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  dueDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  assignmentRequest?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  staked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  disableSelfAssign?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeamResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  teamId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  walletAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  teamRewardMultiplier?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
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

export type UserStatResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UserStat'] = ResolversParentTypes['UserStat']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  proposedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  openedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  assignedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  submittedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  closedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  archivedTasks?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tokens?: Resolver<Maybe<Array<ResolversTypes['UserToken']>>, ParentType, ContextType, RequireFields<UserStattokensArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserTokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UserToken'] = ResolversParentTypes['UserToken']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserStat'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
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
  ActionSnapshot?: ActionSnapshotResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Deposit?: DepositResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Notification?: NotificationResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  OrganizationSnapshot?: OrganizationSnapshotResolvers<ContextType>;
  OrganizationStat?: OrganizationStatResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskRevision?: TaskRevisionResolvers<ContextType>;
  TaskSnapshot?: TaskSnapshotResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  Treasury?: TreasuryResolvers<ContextType>;
  TreasuryToken?: TreasuryTokenResolvers<ContextType>;
  UserStat?: UserStatResolvers<ContextType>;
  UserToken?: UserTokenResolvers<ContextType>;
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
              config: {"endpoint":"https://api.thegraph.com/subgraphs/name/kil-san/buildstream-v2"},
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
        document: GetNotificationsDocument,
        get rawSDL() {
          return printWithCache(GetNotificationsDocument);
        },
        location: 'GetNotificationsDocument.graphql'
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
        document: GetTaskSnapshotsDocument,
        get rawSDL() {
          return printWithCache(GetTaskSnapshotsDocument);
        },
        location: 'GetTaskSnapshotsDocument.graphql'
      },{
        document: GetTaskRevisionsDocument,
        get rawSDL() {
          return printWithCache(GetTaskRevisionsDocument);
        },
        location: 'GetTaskRevisionsDocument.graphql'
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
      },{
        document: GetDepositsDocument,
        get rawSDL() {
          return printWithCache(GetDepositsDocument);
        },
        location: 'GetDepositsDocument.graphql'
      },{
        document: GetDepositDocument,
        get rawSDL() {
          return printWithCache(GetDepositDocument);
        },
        location: 'GetDepositDocument.graphql'
      },{
        document: GetUserStatDocument,
        get rawSDL() {
          return printWithCache(GetUserStatDocument);
        },
        location: 'GetUserStatDocument.graphql'
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
export type ActionSnapshotFragmentFragment = (
  Pick<ActionSnapshot, 'id' | 'actionId' | 'orgId' | 'initiator' | 'targetAddress' | 'value' | 'data' | 'executed' | 'tokenAddress' | 'actionType' | 'approvedBy' | 'initiatedAt' | 'completedAt' | 'updateCount' | 'actor' | 'block' | 'timestamp'>
  & { organizationSnapshot: (
    Pick<OrganizationSnapshot, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
    & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
  ) }
);

export type ActionFragmentFragment = (
  Pick<Action, 'id' | 'actionId' | 'orgId' | 'initiator' | 'targetAddress' | 'value' | 'data' | 'executed' | 'tokenAddress' | 'actionType' | 'approvedBy' | 'initiatedAt' | 'completedAt' | 'updateCount'>
  & { organizationSnapshot: (
    Pick<OrganizationSnapshot, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
    & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
  ) }
);

export type GetActionQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetActionQuery = { action?: Maybe<(
    Pick<Action, 'id' | 'actionId' | 'orgId' | 'initiator' | 'targetAddress' | 'value' | 'data' | 'executed' | 'tokenAddress' | 'actionType' | 'approvedBy' | 'initiatedAt' | 'completedAt' | 'updateCount'>
    & { organizationSnapshot: (
      Pick<OrganizationSnapshot, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
    ) }
  )> };

export type GetActionsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Action_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Action_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetActionsQuery = { actions: Array<(
    Pick<Action, 'id' | 'actionId' | 'orgId' | 'initiator' | 'targetAddress' | 'value' | 'data' | 'executed' | 'tokenAddress' | 'actionType' | 'approvedBy' | 'initiatedAt' | 'completedAt' | 'updateCount'>
    & { organizationSnapshot: (
      Pick<OrganizationSnapshot, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
    ) }
  )> };

export type GetNotificationsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Notification_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Notification_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetNotificationsQuery = { notifications: Array<(
    Pick<Notification, 'id' | 'tags' | 'users' | 'timestamp'>
    & { orgId: (
      Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
    ), task?: Maybe<(
      Pick<Task, 'id' | 'externalId' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'dueDate' | 'comment' | 'approvedBy' | 'assignmentRequest' | 'disableSelfAssign'>
      & { orgId: (
        Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
        & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
      ) }
    )>, action?: Maybe<(
      Pick<Action, 'id' | 'actionId' | 'orgId' | 'initiator' | 'targetAddress' | 'value' | 'data' | 'executed' | 'tokenAddress' | 'actionType' | 'approvedBy' | 'initiatedAt' | 'completedAt' | 'updateCount'>
      & { organizationSnapshot: (
        Pick<OrganizationSnapshot, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
        & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
      ) }
    )>, deposit?: Maybe<Pick<Deposit, 'id' | 'orgId' | 'amount' | 'token' | 'initiator' | 'completedAt'>>, taskSnapshot?: Maybe<(
      Pick<TaskSnapshot, 'id' | 'actor' | 'block' | 'timestamp' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'dueDate' | 'comment' | 'approvedBy' | 'assignmentRequest' | 'disableSelfAssign'>
      & { orgId: (
        Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
        & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
      ) }
    )>, actionSnapshot?: Maybe<(
      Pick<ActionSnapshot, 'id' | 'actionId' | 'orgId' | 'initiator' | 'targetAddress' | 'value' | 'data' | 'executed' | 'tokenAddress' | 'actionType' | 'approvedBy' | 'initiatedAt' | 'completedAt' | 'updateCount' | 'actor' | 'block' | 'timestamp'>
      & { organizationSnapshot: (
        Pick<OrganizationSnapshot, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
        & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
      ) }
    )> }
  )> };

export type OrganizationFragmentFragment = (
  Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
  & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
);

export type OrganizationSnapshotFragmentFragment = (
  Pick<OrganizationSnapshot, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
  & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
);

export type GetOrganizationQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetOrganizationQuery = { organization?: Maybe<(
    Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
    & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
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
    Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
    & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
  )> };

export type TaskFragmentFragment = (
  Pick<Task, 'id' | 'externalId' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'dueDate' | 'comment' | 'approvedBy' | 'assignmentRequest' | 'disableSelfAssign'>
  & { orgId: (
    Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
    & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
  ) }
);

export type TaskSnapshotFragmentFragment = (
  Pick<TaskSnapshot, 'id' | 'actor' | 'block' | 'timestamp' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'dueDate' | 'comment' | 'approvedBy' | 'assignmentRequest' | 'disableSelfAssign'>
  & { orgId: (
    Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
    & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
  ) }
);

export type GetTaskQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetTaskQuery = { task?: Maybe<(
    Pick<Task, 'id' | 'externalId' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'dueDate' | 'comment' | 'approvedBy' | 'assignmentRequest' | 'disableSelfAssign'>
    & { orgId: (
      Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
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
    Pick<Task, 'id' | 'externalId' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'dueDate' | 'comment' | 'approvedBy' | 'assignmentRequest' | 'disableSelfAssign'>
    & { orgId: (
      Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
    ) }
  )> };

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
    Pick<TaskSnapshot, 'id' | 'actor' | 'block' | 'timestamp' | 'taskId' | 'title' | 'description' | 'assigner' | 'assignee' | 'taskTags' | 'status' | 'complexityScore' | 'reputationLevel' | 'requiredApprovals' | 'rewardAmount' | 'rewardToken' | 'assignDate' | 'submitDate' | 'dueDate' | 'comment' | 'approvedBy' | 'assignmentRequest' | 'disableSelfAssign'>
    & { orgId: (
      Pick<Organization, 'id' | 'orgId' | 'name' | 'description' | 'approvers' | 'signers' | 'members' | 'requiredTaskApprovals' | 'requiredConfirmations' | 'rewardMultiplier' | 'rewardSlashMultiplier' | 'slashRewardEvery' | 'rewardToken' | 'isInitialized'>
      & { treasury: { tokens?: Maybe<Array<Pick<TreasuryToken, 'token' | 'balance' | 'lockedBalance'>>> }, stat?: Maybe<Pick<OrganizationStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks' | 'tags'>> }
    ) }
  )> };

export type GetTaskRevisionsQueryVariables = Exact<{
  block?: InputMaybe<Block_height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TaskRevision_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TaskRevision_filter>;
}>;


export type GetTaskRevisionsQuery = { taskRevisions: Array<(
    Pick<TaskRevision, 'id' | 'revisionId' | 'requester' | 'externalRevisionId' | 'revisionHash' | 'dueDateExtension' | 'dueDateExtensionRequest' | 'status'>
    & { taskSnapshot: Pick<TaskSnapshot, 'comment' | 'status'> }
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

export type GetDepositsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetDepositsQuery = { deposits: Array<Pick<Deposit, 'id' | 'orgId' | 'amount' | 'token' | 'initiator' | 'completedAt'>> };

export type GetDepositQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetDepositQuery = { deposit?: Maybe<Pick<Deposit, 'id' | 'orgId' | 'amount' | 'token' | 'initiator' | 'completedAt'>> };

export type StatFragmentFragment = (
  Pick<UserStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks'>
  & { tokens?: Maybe<Array<Pick<UserToken, 'id' | 'token' | 'count'>>> }
);

export type GetUserStatQueryVariables = Exact<{
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
}>;


export type GetUserStatQuery = { userStat?: Maybe<(
    Pick<UserStat, 'id' | 'proposedTasks' | 'openedTasks' | 'assignedTasks' | 'submittedTasks' | 'closedTasks' | 'archivedTasks'>
    & { tokens?: Maybe<Array<Pick<UserToken, 'id' | 'token' | 'count'>>> }
  )> };

export const OrganizationSnapshotFragmentFragmentDoc = gql`
    fragment OrganizationSnapshotFragment on OrganizationSnapshot {
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
  stat {
    id
    proposedTasks
    openedTasks
    assignedTasks
    submittedTasks
    closedTasks
    archivedTasks
    tags
  }
}
    ` as unknown as DocumentNode<OrganizationSnapshotFragmentFragment, unknown>;
export const ActionSnapshotFragmentFragmentDoc = gql`
    fragment ActionSnapshotFragment on ActionSnapshot {
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
  initiatedAt
  completedAt
  updateCount
  actor
  block
  timestamp
  organizationSnapshot {
    ...OrganizationSnapshotFragment
  }
}
    ${OrganizationSnapshotFragmentFragmentDoc}` as unknown as DocumentNode<ActionSnapshotFragmentFragment, unknown>;
export const ActionFragmentFragmentDoc = gql`
    fragment ActionFragment on Action {
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
  initiatedAt
  completedAt
  updateCount
  organizationSnapshot {
    ...OrganizationSnapshotFragment
  }
}
    ${OrganizationSnapshotFragmentFragmentDoc}` as unknown as DocumentNode<ActionFragmentFragment, unknown>;
export const OrganizationFragmentFragmentDoc = gql`
    fragment OrganizationFragment on Organization {
  id
  orgId
  name
  description
  approvers
  signers
  members
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
  stat {
    id
    proposedTasks
    openedTasks
    assignedTasks
    submittedTasks
    closedTasks
    archivedTasks
    tags
  }
}
    ` as unknown as DocumentNode<OrganizationFragmentFragment, unknown>;
export const TaskFragmentFragmentDoc = gql`
    fragment TaskFragment on Task {
  id
  externalId
  taskId
  orgId {
    ...OrganizationFragment
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
  dueDate
  comment
  approvedBy
  assignmentRequest
  disableSelfAssign
}
    ${OrganizationFragmentFragmentDoc}` as unknown as DocumentNode<TaskFragmentFragment, unknown>;
export const TaskSnapshotFragmentFragmentDoc = gql`
    fragment TaskSnapshotFragment on TaskSnapshot {
  id
  actor
  block
  timestamp
  taskId
  orgId {
    ...OrganizationFragment
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
  dueDate
  comment
  approvedBy
  assignmentRequest
  disableSelfAssign
}
    ${OrganizationFragmentFragmentDoc}` as unknown as DocumentNode<TaskSnapshotFragmentFragment, unknown>;
export const StatFragmentFragmentDoc = gql`
    fragment StatFragment on UserStat {
  id
  proposedTasks
  openedTasks
  assignedTasks
  submittedTasks
  closedTasks
  archivedTasks
  tokens {
    id
    token
    count
  }
}
    ` as unknown as DocumentNode<StatFragmentFragment, unknown>;
export const GetActionDocument = gql`
    query GetAction($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  action(id: $id, block: $block, subgraphError: $subgraphError) {
    ...ActionFragment
  }
}
    ${ActionFragmentFragmentDoc}` as unknown as DocumentNode<GetActionQuery, GetActionQueryVariables>;
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
    ...ActionFragment
  }
}
    ${ActionFragmentFragmentDoc}` as unknown as DocumentNode<GetActionsQuery, GetActionsQueryVariables>;
export const GetNotificationsDocument = gql`
    query GetNotifications($skip: Int = 0, $first: Int = 100, $orderBy: Notification_orderBy, $orderDirection: OrderDirection, $where: Notification_filter, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  notifications(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
    subgraphError: $subgraphError
  ) {
    id
    tags
    users
    orgId {
      ...OrganizationFragment
    }
    task {
      ...TaskFragment
    }
    action {
      ...ActionFragment
    }
    deposit {
      id
      orgId
      amount
      token
      initiator
      completedAt
    }
    taskSnapshot {
      ...TaskSnapshotFragment
    }
    actionSnapshot {
      ...ActionSnapshotFragment
    }
    timestamp
  }
}
    ${OrganizationFragmentFragmentDoc}
${TaskFragmentFragmentDoc}
${ActionFragmentFragmentDoc}
${TaskSnapshotFragmentFragmentDoc}
${ActionSnapshotFragmentFragmentDoc}` as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetOrganizationDocument = gql`
    query GetOrganization($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  organization(id: $id, block: $block, subgraphError: $subgraphError) {
    ...OrganizationFragment
  }
}
    ${OrganizationFragmentFragmentDoc}` as unknown as DocumentNode<GetOrganizationQuery, GetOrganizationQueryVariables>;
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
    ...OrganizationFragment
  }
}
    ${OrganizationFragmentFragmentDoc}` as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetTaskDocument = gql`
    query GetTask($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  task(id: $id, block: $block, subgraphError: $subgraphError) {
    ...TaskFragment
  }
}
    ${TaskFragmentFragmentDoc}` as unknown as DocumentNode<GetTaskQuery, GetTaskQueryVariables>;
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
    ...TaskFragment
  }
}
    ${TaskFragmentFragmentDoc}` as unknown as DocumentNode<GetTasksQuery, GetTasksQueryVariables>;
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
    ...TaskSnapshotFragment
  }
}
    ${TaskSnapshotFragmentFragmentDoc}` as unknown as DocumentNode<GetTaskSnapshotsQuery, GetTaskSnapshotsQueryVariables>;
export const GetTaskRevisionsDocument = gql`
    query GetTaskRevisions($block: Block_height, $first: Int = 100, $orderBy: TaskRevision_orderBy, $orderDirection: OrderDirection, $skip: Int = 0, $subgraphError: _SubgraphErrorPolicy_! = deny, $where: TaskRevision_filter) {
  taskRevisions(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
    subgraphError: $subgraphError
  ) {
    id
    taskSnapshot {
      comment
      status
    }
    revisionId
    requester
    externalRevisionId
    revisionHash
    dueDateExtension
    dueDateExtensionRequest
    status
  }
}
    ` as unknown as DocumentNode<GetTaskRevisionsQuery, GetTaskRevisionsQueryVariables>;
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
export const GetDepositsDocument = gql`
    query GetDeposits($skip: Int = 0, $first: Int = 100, $orderBy: Deposit_orderBy, $orderDirection: OrderDirection, $where: Deposit_filter, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  deposits(
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
    amount
    token
    initiator
    completedAt
  }
}
    ` as unknown as DocumentNode<GetDepositsQuery, GetDepositsQueryVariables>;
export const GetDepositDocument = gql`
    query GetDeposit($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  deposit(id: $id, block: $block, subgraphError: $subgraphError) {
    id
    orgId
    amount
    token
    initiator
    completedAt
  }
}
    ` as unknown as DocumentNode<GetDepositQuery, GetDepositQueryVariables>;
export const GetUserStatDocument = gql`
    query GetUserStat($id: ID!, $block: Block_height, $subgraphError: _SubgraphErrorPolicy_! = deny) {
  userStat(id: $id, block: $block, subgraphError: $subgraphError) {
    ...StatFragment
  }
}
    ${StatFragmentFragmentDoc}` as unknown as DocumentNode<GetUserStatQuery, GetUserStatQueryVariables>;















export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetAction(variables: GetActionQueryVariables, options?: C): Promise<GetActionQuery> {
      return requester<GetActionQuery, GetActionQueryVariables>(GetActionDocument, variables, options) as Promise<GetActionQuery>;
    },
    GetActions(variables?: GetActionsQueryVariables, options?: C): Promise<GetActionsQuery> {
      return requester<GetActionsQuery, GetActionsQueryVariables>(GetActionsDocument, variables, options) as Promise<GetActionsQuery>;
    },
    GetNotifications(variables?: GetNotificationsQueryVariables, options?: C): Promise<GetNotificationsQuery> {
      return requester<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, variables, options) as Promise<GetNotificationsQuery>;
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
    GetTaskSnapshots(variables?: GetTaskSnapshotsQueryVariables, options?: C): Promise<GetTaskSnapshotsQuery> {
      return requester<GetTaskSnapshotsQuery, GetTaskSnapshotsQueryVariables>(GetTaskSnapshotsDocument, variables, options) as Promise<GetTaskSnapshotsQuery>;
    },
    GetTaskRevisions(variables?: GetTaskRevisionsQueryVariables, options?: C): Promise<GetTaskRevisionsQuery> {
      return requester<GetTaskRevisionsQuery, GetTaskRevisionsQueryVariables>(GetTaskRevisionsDocument, variables, options) as Promise<GetTaskRevisionsQuery>;
    },
    GetTreasury(variables: GetTreasuryQueryVariables, options?: C): Promise<GetTreasuryQuery> {
      return requester<GetTreasuryQuery, GetTreasuryQueryVariables>(GetTreasuryDocument, variables, options) as Promise<GetTreasuryQuery>;
    },
    GetTreasurys(variables?: GetTreasurysQueryVariables, options?: C): Promise<GetTreasurysQuery> {
      return requester<GetTreasurysQuery, GetTreasurysQueryVariables>(GetTreasurysDocument, variables, options) as Promise<GetTreasurysQuery>;
    },
    GetDeposits(variables?: GetDepositsQueryVariables, options?: C): Promise<GetDepositsQuery> {
      return requester<GetDepositsQuery, GetDepositsQueryVariables>(GetDepositsDocument, variables, options) as Promise<GetDepositsQuery>;
    },
    GetDeposit(variables: GetDepositQueryVariables, options?: C): Promise<GetDepositQuery> {
      return requester<GetDepositQuery, GetDepositQueryVariables>(GetDepositDocument, variables, options) as Promise<GetDepositQuery>;
    },
    GetUserStat(variables: GetUserStatQueryVariables, options?: C): Promise<GetUserStatQuery> {
      return requester<GetUserStatQuery, GetUserStatQueryVariables>(GetUserStatDocument, variables, options) as Promise<GetUserStatQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;