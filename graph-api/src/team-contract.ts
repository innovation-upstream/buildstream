import {
  TaskAssignment as TaskAssignmentEvent,
  TeamArchived as TeamArchivedEvent,
  TeamCreation as TeamCreationEvent,
  TeamMemberAdded as TeamMemberAddedEvent,
  TeamMemberRemoved as TeamMemberRemovedEvent,
  TeamUnArchived as TeamUnArchivedEvent,
  TeamUpdated as TeamUpdatedEvent
} from '../generated/TeamContract/TeamContract'
import { Organization, Task, Team } from '../generated/schema'

export function handleTaskAssignment(event: TaskAssignmentEvent): void {
  const taskId = event.params.taskId.toString()
  const entity = Team.load(event.params.teamAddress.toHexString())
  if (!entity) return
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.teamAssignee = event.params.assignee.toHexString()

  const organizationEntity = Organization.load(taskEntity.orgId)

  taskEntity.raw = `${taskEntity.title as string} ~ ${taskEntity.description as string} ~ ${taskEntity.taskTags.toString()} ~ ${
    organizationEntity ? (organizationEntity.name as string) : ''
  } ~ ${taskEntity.assignee as string} ~ ${entity.name as string} ~ ${taskEntity.teamAssignee as string}`

  taskEntity.save()
}

export function handleTeamArchived(event: TeamArchivedEvent): void {
  const entity = Team.load(event.params.teamAddress.toHexString())
  if (!entity) return
  entity.archived = true
  entity.save()
}

export function handleTeamCreation(event: TeamCreationEvent): void {
  const entity = new Team(event.params.teamAddress.toHexString())

  entity.teamId = event.params.team.id
  entity.name = event.params.team.name
  entity.description = event.params.team.description
  entity.walletAddress = event.params.team.walletAddress.toHexString()
  entity.archived = event.params.team.archived
  entity.members = event.params.team.members.map<string>((a) => a.toHexString())
  entity.teamRewardMultiplier = event.params.team.teamRewardMultiplier
  entity.save()
}

export function handleTeamMemberAdded(event: TeamMemberAddedEvent): void {
  const entity = Team.load(event.params.teamAddress.toHexString())
  if (!entity) return
  let members = entity.members || []
  members.push(event.params.member.toHexString())
  entity.members = members
  entity.save()
}

export function handleTeamMemberRemoved(event: TeamMemberRemovedEvent): void {
  const entity = Team.load(event.params.teamAddress.toHexString())
  if (!entity) return
  let members = entity.members
  const index = members.indexOf(event.params.member.toHexString())
  if (index != -1) {
    members.splice(index, 1)
    entity.members = members
    entity.save()
  }
}

export function handleTeamUnArchived(event: TeamUnArchivedEvent): void {
  const entity = Team.load(event.params.teamAddress.toHexString())
  if (!entity) return
  entity.archived = false
  entity.save()
}

export function handleTeamUpdated(event: TeamUpdatedEvent): void {
  const entity = Team.load(event.params.teamAddress.toHexString())
  if (!entity) return
  entity.name = event.params.team.name
  entity.description = event.params.team.description
  entity.teamRewardMultiplier = event.params.team.teamRewardMultiplier
  entity.save()
}
