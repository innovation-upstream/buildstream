import { useTranslation } from 'next-i18next'
import Correct from 'SVGs/Correct'

const ClosedCard = () => {
  const { t } = useTranslation('tasks')
  return (
    <div className='paper mt-7'>
      <div className='flex items-center gap-x-4'>
        <div className='shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center rounded-full bg-[#4bae4e]/30'>
          <Correct className='fill-[#4bae4e]' width={40} />
        </div>
        <p className='text-2xl font-semibold'>{t('task_closed')}</p>
      </div>
      <p className='mt-4'>{t('reward_message')}</p>
    </div>
  )
}

export default ClosedCard
