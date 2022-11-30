import React from 'react'

const Hamburger: React.FC<{ width?: number }> = ({ width = 20 }) => {
  return (
    <svg
      width={width}
      viewBox='0 0 20 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1 11H19M1 6H19M1 1H19'
        stroke='#17191A'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Hamburger
