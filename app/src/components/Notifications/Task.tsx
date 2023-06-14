import TokenGeneric from 'SVGs/TokenGeneric'
import { ethers } from 'ethers'
import { Currency } from 'hooks/currency/types'
import { Notification } from 'hooks/notification/types'
import { TaskSnapshot, TaskStatus } from 'hooks/task/types'

interface TaskNotificationsProps {
  notification: Notification
  tokenInfos?: Currency[]
}

const messageTemplates: Record<any, string> = {
  0: '<strong>{title}</strong> has been created',
  1: '<strong>{title}</strong> is <strong>opened</strong>',
  2: 'The request for <strong>{title}</strong> has been approved',
  3: '<strong>{title}</strong> has been submitted',
  4: '<strong>{title}</strong> has been completed',
  alt: 'A request for <strong>{title}</strong> has been made'
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
        <div className='flex items-center gap-1 w-fit h-fit border border-[#6BC5A1] px-3 py-2 rounded-md'>
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
