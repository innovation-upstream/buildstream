import Alert from 'components/Alert/Alert'
import { Task } from 'hooks/task/types'
import moment from 'moment'
import { useTranslation } from 'next-i18next'

interface ISolutionTimeProps {
  task: Task
}

const SolutionTime = ({ task }: ISolutionTimeProps) => {
  const { t } = useTranslation('tasks')

  const days = moment.unix(task.dueDate).diff(moment(), 'days')

  return (
    <div className='mt-4'>
      <Alert>
        <p className='font-bold mb-2 text-lg'>
          {t('you_are_assigned', {
            days
          })}
        </p>
        <p>{t('you_are_assigned_body')}</p>
      </Alert>
    </div>
  )
}

export default SolutionTime
