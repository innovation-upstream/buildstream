import { taskConnectors } from './taskConnectors'

const TaskConnect = () => {
  return (
    <div className='mt-6'>
      <p className='mb-9 text-secondary'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor, lobortis
        auctor amet, sit amet. Nisl parturient nisl.
      </p>
      <div className='flex flex-wrap gap-4'>
        {taskConnectors.map((connector) => {
          const Logo = connector.logo
          return (
            <button
              key={connector.name}
              type='button'
              className='flex items-center justify-center grow rounded-2xl px-5 h-40 basis-1/3 bg-white hover:bg-[#F8F9FA] focus:bg-[#F8F9FA] border border-[#EFF0F1]'
            >
              <Logo width={connector.width} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TaskConnect
