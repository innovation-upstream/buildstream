import AlertIcon from 'SVGs/AlertIcon'
import { ReactNode } from 'react'

interface AlertProps {
  className?: string
  icon?: ReactNode
  children: ReactNode
}

const Alert = ({ className, icon, children }: AlertProps) => {
  return (
    <div
      className={`bg-white border-t-4 border-orange-200 rounded-2xl text-teal-900 px-4 py-5 shadow-md ${className}`}
      role='alert'
    >
      <div className='flex'>
        <div className='py-1 mr-4'>
          {icon || (
            <AlertIcon className='fill-current h-6 w-6 text-orange-500' />
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Alert
