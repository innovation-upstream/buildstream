import { useTranslation } from 'next-i18next'
import Closed from 'SVGs/Closed'

const ClosedCard = () => {
  const { t } = useTranslation('tasks')
  return (
    <div className='paper mt-7'>
      <div className='flex items-center gap-x-4'>
        <div className='shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center rounded-md bg-[#FEEBEB]'>
          <Closed className='fill-[#F35B5B]' />
        </div>
        <p className='text-2xl font-semibold'>{t('task_closed')}</p>
      </div>
      <p className='mt-4'>{t('reward_message')}</p>
    </div>
  )
}

export default ClosedCard
