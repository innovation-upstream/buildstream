import React from 'react'

const Hamburger: React.FC<{ width?: number }> = ({ width = 40 }) => {
  return (
    <svg
      width={width}
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect x='0.5' y='0.5' width='39' height='39' rx='9.5' fill='white' />
      <path
        d='M11 25H29M11 20H29M11 15H29'
        stroke='#17191A'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <rect x='0.5' y='0.5' width='39' height='39' rx='9.5' stroke='#EFF0F1' />
    </svg>
  )
}

export default Hamburger
