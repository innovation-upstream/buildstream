import { useTranslation } from 'next-i18next'
import ClockSmall from 'SVGs/ClockSmall'

const SolutionTime = () => {
  const { t } = useTranslation('tasks')

  return (
    <div className='paper flex items-center gap-x-4 mt-7'>
      <div className='shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center rounded-md bg-[#E1F3EC]'>
        <ClockSmall className='fill-[#6BC5A1]' />
      </div>
      <p className='text-2xl font-semibold'>
        {t('solution_will_be_in').replace('{placeholder}', '3d')}
      </p>
    </div>
  )
}

export default SolutionTime
