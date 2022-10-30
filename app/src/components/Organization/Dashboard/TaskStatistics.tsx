import Clock from 'SVGs/Clock'
import Close from 'SVGs/Close'
import Calendar from 'SVGs/Calendar'

const TaskStatistics = () => {
  return (
    <div className='paper'>
      <p className='text-2xl font-semibold mb-5'>Task Statistics</p>
      <div className='divider' />
      <div className='mt-5 p-3 gap-5 flex rounded-lg bg-[#F5F7F9]'>
        <div className='w-14 h-14 flex items-center justify-center rounded-lg bg-[#EFA045]'>
          <Clock />
        </div>
        <div>
          <p className='text-2xl font-semibold'>0</p>
          <span>Tasks in progress</span>
        </div>
      </div>
      <div className='mt-3 p-3 gap-5 flex rounded-lg bg-[#F5F7F9]'>
        <div className='w-14 h-14 flex items-center justify-center rounded-lg bg-[#EDBBC3]'>
          <Close />
        </div>
        <div>
          <p className='text-2xl font-semibold'>0</p>
          <span>Closed Tasks</span>
        </div>
      </div>
      <div className='mt-3 p-3 gap-5 flex rounded-lg bg-[#F5F7F9]'>
        <div className='w-14 h-14 flex items-center justify-center rounded-lg bg-[#F56689]'>
          <Calendar />
        </div>
        <div>
          <p className='text-2xl font-semibold'>0</p>
          <span>Overdue Tasks</span>
        </div>
      </div>
    </div>
  )
}

export default TaskStatistics
