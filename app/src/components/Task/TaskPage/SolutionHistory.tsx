import { useGetTaskRevisionsQuery, usePolling, useWeb3 } from 'hooks'
import {
  Task,
  TaskRevision,
  TaskRevisionStatus,
  TaskStatus
} from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { Converter } from 'utils/converter'
import ChangeRequest from './ChangeRequest'
import SolutionCard from './SolutionCard'

interface SolutionHistoryProps {
  task: Task
  isApprover?: boolean
}

// const demoTaskRevision = [
//   {
//     taskSnapshot: {
//       comment: 'comment 1',
//       status: TaskStatus.SUBMITTED
//     },
//     status: TaskRevisionStatus.ACCEPTED
//   },
//   {
//     taskSnapshot: {
//       comment: 'comment 2',
//       status: TaskStatus.SUBMITTED
//     },
//     status: TaskRevisionStatus.PROPOSED
//   }
// ] as any[] as TaskRevision[]

const SolutionHistory = ({ task, isApprover }: SolutionHistoryProps) => {
  const { account, library } = useWeb3()
  const [taskRevisions, setTaskRevisions] = useState<TaskRevision[]>([])
  const { data, startPolling, stopPolling } = useGetTaskRevisionsQuery({
    variables: {
      orderBy: 'revisionId',
      orderDirection: 'asc',
      where: {
        task: task.id.toString()
      }
    }
  })
  usePolling(startPolling, stopPolling)
  const { t } = useTranslation('tasks')

  useEffect(() => {
    if (data?.taskRevisions) {
      setTaskRevisions(
        data.taskRevisions?.map((t) =>
          Converter.TaskRevisionFromQuery(t as any)
        )
      )
    }
  }, [data])

  const wasChangesRequested = (index: number) =>
    taskRevisions[index - 1].status === TaskRevisionStatus.CHANGES_REQUESTED

  return (
    <>
      {taskRevisions?.map((revision, index) => {
        return (
          <React.Fragment key={`hist-${index}`}>
            {(index === 0 || !wasChangesRequested(index)) && (
              <SolutionCard
                task={task}
                comment={revision.taskSnapshot.comment}
                isUpdatedSolution={!!index}
              />
            )}
            <ChangeRequest
              revision={revision}
              isAssignee={task.assigneeAddress === account}
              taskId={task.id}
            />
          </React.Fragment>
        )
      })}
      {task.status >= TaskStatus.SUBMITTED && (
        <SolutionCard
          task={task}
          comment={task.comment}
          isUpdatedSolution={!!taskRevisions.length}
          showControls={task.status !== TaskStatus.CLOSED && isApprover}
        />
      )}
    </>
  )
}

export default SolutionHistory
