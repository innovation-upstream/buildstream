import Alert from 'components/Alert/Alert'
import { useWeb3 } from 'hooks'
import { Task } from 'hooks/task/types'
import moment from 'moment'
import { useTranslation } from 'next-i18next'

interface ISolutionTimeProps {
  task: Task
}

const SolutionTime = ({ task }: ISolutionTimeProps) => {
  const { t } = useTranslation('tasks')
  const { account } = useWeb3()

  const isAssignee = task.assigneeAddress === account
  const days = moment.unix(task.dueDate).diff(moment(), 'days')

  return (
    <div className='mt-4'>
      <Alert>
        {isAssignee && (
          <p className='font-bold mb-2 text-lg'>
            {t('you_are_assigned', {
              days
            })}
          </p>
        )}
        <p>
          {t(isAssignee ? 'you_are_assigned_body' : 'task_is_assigned_body', {
            days
          })}
        </p>
      </Alert>
    </div>
  )
}

export default SolutionTime
