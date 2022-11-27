import { BigNumber, ethers } from 'ethers'
import {
  Action as ActionType,
  Deposit,
  Organization as Org,
  Task as TaskType,
  TaskRevision as TaskRevisionType,
  TaskSnapshot as TaskSnapshotType,
  Treasury as TreasuryType,
  UserStat
} from 'graphclient'
import { Action } from 'hooks/action/types'
import { Organization } from 'hooks/organization/types'
import { Task, TaskRevision, TaskSnapshot } from 'hooks/task/types'
import { DepositRecord, Treasury } from 'hooks/treasury/types'
import { Stat } from 'hooks/userstat/types'

export class Converter {
  public static OrganizationFromQuery = (org: Org): Organization => {
    return {
      id: BigNumber.from(org.orgId).toNumber(),
      name: org.name,
      description: org.description,
      approvers: org.approvers,
      signers: org.signers,
      requiredTaskApprovals: Number(org.requiredTaskApprovals),
      requiredConfirmations: Number(org.requiredTaskApprovals),
      rewardMultiplier: BigNumber.from(org.rewardMultiplier),
      rewardToken: org.rewardToken,
      rewardSlashMultiplier: BigNumber.from(org.rewardSlashMultiplier),
      slashRewardEvery: Number(org.slashRewardEvery),
      isInitialized: org.isInitialized,
      treasury: Converter.TreasuryFromQuery(org.treasury),
      stat: Converter.StatFromQuery(org.stat as any)
    }
  }

  public static StatFromQuery = (stat?: UserStat): Stat => {
    return {
      id: stat?.id || '',
      proposedTasks: BigNumber.from(stat?.proposedTasks || 0),
      openedTasks: BigNumber.from(stat?.openedTasks || 0),
      assignedTasks: BigNumber.from(stat?.assignedTasks || 0),
      submittedTasks: BigNumber.from(stat?.submittedTasks || 0),
      closedTasks: BigNumber.from(stat?.closedTasks || 0),
      archivedTasks: BigNumber.from(stat?.archivedTasks || 0),
      tags: stat?.tags || []
    }
  }

  public static ActionFromQuery = (action: ActionType): Action => {
    return {
      id: Number(action.actionId),
      orgId: Number(action.orgId),
      initiator: action.initiator,
      targetAddress: action.targetAddress || ethers.constants.AddressZero,
      value: BigNumber.from(action.value),
      data: action.data,
      executed: action.executed,
      tokenAddress: action.tokenAddress || ethers.constants.AddressZero,
      actionType: action.actionType,
      approvedBy: action.approvedBy || [],
      initiatedAt: BigNumber.from(action.initiatedAt),
      completedAt: action.completedAt
        ? BigNumber.from(action.completedAt)
        : undefined
    }
  }

  public static TreasuryFromQuery = (treasury: TreasuryType): Treasury => {
    return {
      orgId: Number(treasury.orgId),
      tokens: treasury?.tokens?.map((t) => ({
        token: t.token,
        balance: BigNumber.from(t.balance),
        lockedBalance: BigNumber.from(t.lockedBalance)
      }))
    }
  }

  public static TaskFromQuery = (task: TaskType): Task => {
    return {
      id: Number(task.taskId),
      orgId: Number(task.orgId.id),
      organization: Converter.OrganizationFromQuery(task.orgId),
      title: task.title || '',
      description: task.description || '',
      assigneeAddress: task.assignee || ethers.constants.AddressZero,
      taskTags: task.taskTags,
      status: task.status,
      complexityScore: Number(task.complexityScore),
      reputationLevel: Number(task.reputationLevel),
      requiredApprovals: Number(task.requiredApprovals),
      rewardAmount: BigNumber.from(task.rewardAmount),
      rewardToken: task.rewardToken,
      taskDuration: Number(task.taskDuration),
      approvedBy: task.approvedBy || [],
      assigner: task.assigner || '',
      assignmentRequests: task.assignmentRequest || [],
      comment: task.comment || ''
    }
  }

  public static TaskSnapshotFromQuery = (
    taskSnapshot: TaskSnapshotType
  ): TaskSnapshot => {
    const snapShot = Converter.TaskFromQuery(taskSnapshot as any)
    return {
      ...snapShot,
      actor: taskSnapshot.actor || '',
      taskId: Number(taskSnapshot.taskId),
      block: BigNumber.from(taskSnapshot.block),
      timestamp: BigNumber.from(taskSnapshot.timestamp)
    }
  }

  public static TaskRevisionFromQuery = (
    taskRevision: TaskRevisionType
  ): TaskRevision => {
    return {
      id: Number(taskRevision.id),
      taskSnapshot: {
        comment: taskRevision.taskSnapshot.comment || '',
        status: taskRevision.taskSnapshot.status
      },
      revisionId: taskRevision.revisionId.toString(),
      requester: taskRevision.requester,
      externalRevisionId: taskRevision.externalRevisionId,
      revisionHash: taskRevision.revisionHash,
      durationExtension: Number(taskRevision.durationExtension),
      durationExtensionRequest: Number(taskRevision.durationExtensionRequest),
      status: taskRevision.status
    }
  }

  public static DepositFromQuery = (deposit: Deposit): DepositRecord => {
    return {
      id: deposit.id,
      orgId: deposit.orgId.toString(),
      initiator: deposit.initiator,
      token: deposit.token,
      amount: BigNumber.from(deposit.amount),
      completedAt: BigNumber.from(deposit.completedAt)
    }
  }
}
