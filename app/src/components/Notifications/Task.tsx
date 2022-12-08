import { TaskSnapshot, TaskStatus } from 'hooks/task/types'
import TokenGeneric from 'SVGs/TokenGeneric'
import { ethers } from 'ethers'
import { Notification } from 'hooks/notification/types'
import { TokenInfo } from 'hooks/tokenInfo/types'

interface TaskNotificationsProps {
  notification: Notification
  tokenInfos?: TokenInfo[]
}

const messageTemplates: Record<any, string> = {
  0: 'Task:  <strong>{title}</strong> is <strong>created</strong>',
  1: 'Task:  <strong>{title}</strong> is <strong>opened</strong>',
  2: 'Task:  <strong>{title}</strong> is <strong>assigned</strong>',
  3: 'Task:  <strong>{title}</strong> is <strong>submitted</strong>',
  4: 'Task:  <strong>{title}</strong> is <strong>closed</strong>',
  alt: 'Task:  Request to be assigned <strong>{title}</strong>'
}


const TaskNotification = ({
  notification,
  tokenInfos
}: TaskNotificationsProps) => {
  const snapshot = notification.taskSnapshot as TaskSnapshot
  let message = messageTemplates[snapshot.status as any]?.replace(
    '{title}',
    snapshot.title
  )
  if (
    snapshot.status === TaskStatus.OPEN &&
    snapshot.assignmentRequests?.includes(snapshot.actor)
  )
    message = messageTemplates.alt?.replace('{title}', snapshot.title)
  const token = tokenInfos?.find((i) => i.address === snapshot.rewardToken)
  const symbol = token?.symbol
  const reward = ethers.utils.formatUnits(
    snapshot.rewardAmount?.toString(),
    token?.decimal
  )
  return (
    <>
      <div>
        <p className='text-lg font-semibold mb-2'>
          {snapshot.actor?.substring(0, 7)}...
          {snapshot.actor?.substring(snapshot.actor?.length - 4)}
        </p>
        <p
          className='text-[#646873]'
          dangerouslySetInnerHTML={{
            __html: message
          }}
        />
      </div>
      {snapshot.status === TaskStatus.CLOSED && (
        <div className='flex items-center gap-1 w-fit border border-[#6BC5A1] px-3 py-2 rounded-md'>
          +
          <TokenGeneric width={7} />
          <span className='font-semibold text-sm whitespace-nowrap'>
            {`${reward} ${symbol}`}
          </span>
        </div>
      )}
    </>
  )
}

export default TaskNotification
