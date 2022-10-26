import React from 'react'

const CloseIcon: React.FC<{ width?: number; color?: string }> = ({
  width = 14
}) => {
  return (
    <svg
      width={width}
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M13 13L1 1M13 1L1 13'
        stroke='#17191A'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default CloseIcon
