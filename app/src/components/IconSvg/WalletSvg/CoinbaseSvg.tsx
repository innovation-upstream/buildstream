import React from 'react'

const CoinbaseSvg: React.FC<{ width?: number }> = ({ width = 36 }) => {
  return (
    <svg
      width={width}
      viewBox='0 0 36 36'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='36' height='36' rx='18' fill='#2C5FF6' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M17.9995 29.0001C24.0746 29.0001 28.9995 24.0752 28.9995 18.0001C28.9995 11.925 24.0746 7.00009 17.9995 7.00009C11.9244 7.00009 6.99951 11.925 6.99951 18.0001C6.99951 24.0752 11.9244 29.0001 17.9995 29.0001ZM15.7495 15.0001C15.3353 15.0001 14.9995 15.3359 14.9995 15.7501V20.2501C14.9995 20.6643 15.3353 21.0001 15.7495 21.0001H20.2495C20.6637 21.0001 20.9995 20.6643 20.9995 20.2501V15.7501C20.9995 15.3359 20.6637 15.0001 20.2495 15.0001H15.7495Z'
        fill='white'
      />
    </svg>
  )
}

export default CoinbaseSvg
