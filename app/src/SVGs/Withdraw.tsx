const Withdraw = ({ width = 20, className = '' }) => {
  return (
    <svg
      width={width}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5'
        stroke='white'
        strokeWidth='1.3'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      />
      <path
        d='M14.1663 6.66667L9.99967 2.5L5.83301 6.66667'
        stroke='white'
        strokeWidth='1.3'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      />
      <path
        d='M10 2.5V12.5'
        stroke='white'
        strokeWidth='1.3'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      />
    </svg>
  )
}

export default Withdraw