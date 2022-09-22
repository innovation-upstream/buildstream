import { BigNumber, ethers } from 'ethers'
import {
  Action as ActionType,
  Organization as Org,
  Task as TaskType,
  TaskSnapshot as TaskSnapshotType,
  Treasury as TreasuryType
} from 'graphclient'
import { Action } from 'hooks/action/types'
import { Organization } from 'hooks/organization/types'
import { Task, TaskSnapshot } from 'hooks/task/types'
import { Treasury } from 'hooks/treasury/types'

export class Converter {
  public static OrganizationFromQuery = (org: Org): Organization => {
    return {
      id: BigNumber.from(org.orgId).toNumber(),
      name: org.name,
      description: org.description,
      reviewers: org.reviewers,
      approvers: org.approvers,
      signers: org.signers,
      requiredTaskApprovals: Number(org.requiredTaskApprovals),
      requiredConfirmations: Number(org.requiredTaskApprovals),
      rewardMultiplier: BigNumber.from(org.rewardMultiplier),
      rewardToken: org.rewardToken,
      rewardSlashDivisor: BigNumber.from(org.rewardSlashDivisor),
      slashRewardEvery: Number(org.slashRewardEvery),
      isInitialized: org.isInitialized,
      treasury: Converter.TreasuryFromQuery(org.treasury)
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
      approvedBy: action.approvedBy || []
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
      taskDuration: Number(task.reputationLevel),
      approvedBy: task.approvedBy || [],
      assigner: task.assigner,
      assignmentRequests: task.assignmentRequest || []
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
}
